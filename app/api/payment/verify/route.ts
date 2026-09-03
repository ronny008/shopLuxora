import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import { OrderModel } from '@/lib/models';
import { verifyRazorpayPaymentSignature } from '@/lib/razorpay';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required Razorpay payment credentials' },
        { status: 400 }
      );
    }

    // 1. Cryptographically verify signature server-side
    const isValid = verifyRazorpayPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValid) {
      console.warn('Payment verification failed: Invalid HMAC signature', {
        razorpay_order_id,
        razorpay_payment_id,
      });
      return NextResponse.json(
        { success: false, error: 'Payment signature verification failed. Untrusted payment.' },
        { status: 400 }
      );
    }

    // 2. Connect to database
    await dbConnect();

    // 3. Find the order either by MongoDB _id, orderNumber, or razorpayOrderId
    let order = null;
    if (orderId && orderId.match(/^[0-9a-fA-F]{24}$/)) {
      order = await OrderModel.findById(orderId);
    }

    if (!order) {
      order = await OrderModel.findOne({
        $or: [
          { 'payment.razorpayOrderId': razorpay_order_id },
          { _id: orderId },
          { orderNumber: orderId },
        ],
      });
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found in system record' },
        { status: 404 }
      );
    }

    // 4. Idempotency Check: Prevent duplicate processing if already marked as Paid
    if (order.payment.status === 'Paid') {
      return NextResponse.json({
        success: true,
        message: 'Order was already verified and marked as Paid',
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
      });
    }

    // 5. Update order to 'Paid' and 'processing'
    order.payment.status = 'Paid';
    order.payment.method = 'Razorpay';
    order.payment.razorpayOrderId = razorpay_order_id;
    order.payment.razorpayPaymentId = razorpay_payment_id;
    order.payment.razorpaySignature = razorpay_signature;
    order.status = 'processing';

    await order.save();

    // Revalidate relevant cache paths
    try {
      revalidatePath('/orders');
      revalidatePath(`/orders/${order._id.toString()}`);
      revalidatePath('/dashboard/orders');
      revalidatePath('/dashboard');
      revalidatePath('/profile');
    } catch {
      // Revalidation error should not fail the verification response
    }

    return NextResponse.json({
      success: true,
      message: 'Payment successfully verified',
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
    });
  } catch (error: any) {
    console.error('Error during payment verification:', error);
    return NextResponse.json(
      { error: error.message || 'Server error during payment verification' },
      { status: 500 }
    );
  }
}
