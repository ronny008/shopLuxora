import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import { ProductModel, OrderModel, UserModel } from '@/lib/models';
import { mockProducts } from '@/lib/mocks/data';
import { getRazorpayClient } from '@/lib/razorpay';
import { getAuthCookie, verifySessionToken } from '@/lib/auth';

interface RequestItem {
  productId: string;
  quantity: number;
  size?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, shippingAddress, customerName, customerEmail, customerPhone } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    // Connect to database
    let isDbConnected = false;
    try {
      await dbConnect();
      isDbConnected = true;
    } catch (connErr) {
      console.warn('MongoDB connection failed during order creation, using fallback:', connErr);
    }

    // Determine current user identity if authenticated
    let userId: string = 'Customer';
    try {
      const token = await getAuthCookie();
      if (token) {
        const payload = verifySessionToken(token);
        if (payload?.userId) {
          userId = payload.userId;
        }
      }
    } catch {
      // Continue with provided name / default
    }

    if (userId === 'Customer' && body.userId) {
      userId = body.userId;
    }

    // Recalculate price strictly from the server/database (never trust frontend totals)
    const verifiedItems = [];
    let subtotal = 0;

    for (const item of items as RequestItem[]) {
      if (!item.productId) {
        return NextResponse.json({ error: 'Invalid product in cart' }, { status: 400 });
      }

      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
      let product: { _id: any; price: number; name: string } | null = null;

      if (isDbConnected) {
        try {
          product = await ProductModel.findById(item.productId).lean();
        } catch {
          // If query fails, fallback to mock data
        }
      }

      if (!product) {
        const mockP = mockProducts.find((p) => p._id === item.productId);
        if (mockP) {
          product = { _id: mockP._id, price: mockP.price, name: mockP.name };
        }
      }

      if (!product) {
        return NextResponse.json(
          { error: `Product with ID ${item.productId} was not found` },
          { status: 404 }
        );
      }

      const price = product.price;
      subtotal += price * quantity;

      verifiedItems.push({
        productId: product._id.toString(),
        quantity,
        price,
        size: item.size,
      });
    }

    // Calculate tax and shipping according to application rules
    const tax = subtotal * 0.08;
    const shipping = 5.0;
    const total = Number((subtotal + tax + shipping).toFixed(2));

    // Convert to smallest currency unit for INR (paise)
    const amountInPaise = Math.round(total * 100);

    // Format unique order number
    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    // Initialize Razorpay SDK
    let razorpay;
    try {
      razorpay = getRazorpayClient();
    } catch (rzpConfigErr: any) {
      return NextResponse.json(
        {
          error:
            rzpConfigErr.message ||
            'Razorpay credentials are not properly configured on the server.',
        },
        { status: 500 }
      );
    }

    // Format address string
    let formattedAddress = 'Standard Delivery';
    if (typeof shippingAddress === 'string' && shippingAddress.trim()) {
      formattedAddress = shippingAddress.trim();
    } else if (shippingAddress && typeof shippingAddress === 'object') {
      const parts = [
        shippingAddress.firstName && shippingAddress.lastName
          ? `${shippingAddress.firstName} ${shippingAddress.lastName}`
          : customerName,
        shippingAddress.address,
        shippingAddress.city,
        shippingAddress.postalCode,
        shippingAddress.phone || customerPhone,
      ].filter(Boolean);
      formattedAddress = parts.join(', ');
    }

    // Create Razorpay Order via SDK
    let rzpOrder;
    try {
      rzpOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: orderNumber,
        notes: {
          orderNumber,
          userId: String(userId),
          customerEmail: customerEmail || '',
        },
      });
    } catch (rzpApiErr: any) {
      console.error('Razorpay order creation API error:', rzpApiErr);
      const errorMessage =
        rzpApiErr?.error?.description ||
        rzpApiErr?.message ||
        'Failed to create order with Razorpay payment gateway.';
      return NextResponse.json({ error: errorMessage }, { status: 502 });
    }

    // Save pending order to application database
    let createdOrderId = `order_${Date.now()}`;
    if (isDbConnected) {
      try {
        const orderDoc = await OrderModel.create({
          orderNumber,
          userId,
          items: verifiedItems.map((vi) => ({
            productId: vi.productId,
            quantity: vi.quantity,
            price: vi.price,
          })),
          address: formattedAddress,
          payment: {
            method: 'Razorpay',
            status: 'Pending',
            razorpayOrderId: rzpOrder.id,
          },
          total,
          status: 'pending',
        });
        createdOrderId = orderDoc._id.toString();
      } catch (dbErr) {
        console.error('Failed to create pending order record in MongoDB:', dbErr);
      }
    }

    // Return only necessary checkout payload and public key to frontend
    return NextResponse.json({
      success: true,
      orderId: createdOrderId,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount, // in paise
      currency: rzpOrder.currency || 'INR',
      key: process.env.RAZORPAY_KEY_ID,
      orderNumber,
      total,
    });
  } catch (error: any) {
    console.error('Unhandled error in /api/payment/create-order:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error while creating payment order' },
      { status: 500 }
    );
  }
}
