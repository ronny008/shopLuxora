import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import { OrderModel } from '@/lib/models';
import { verifyRazorpayWebhookSignature } from '@/lib/razorpay';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      console.warn('Webhook rejected: Missing x-razorpay-signature header');
      return NextResponse.json(
        { error: 'Missing signature header' },
        { status: 400 }
      );
    }

    // 1. Verify webhook signature cryptographically
    const isValid = verifyRazorpayWebhookSignature({
      rawBody,
      signature,
    });

    if (!isValid) {
      console.warn('Webhook rejected: Invalid signature');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      );
    }

    // 2. Parse event payload
    let event;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const eventType = event.event;
    console.log(`Received verified Razorpay webhook event: ${eventType}`);

    // 3. Connect to database
    await dbConnect();

    // 4. Handle events idempotently
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = event.payload?.payment?.entity;
      const orderEntity = event.payload?.order?.entity;
      const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
      const razorpayPaymentId = paymentEntity?.id;

      if (razorpayOrderId) {
        const order = await OrderModel.findOne({
          'payment.razorpayOrderId': razorpayOrderId,
        });

        if (order) {
          // Idempotency: If already marked Paid, don't re-save or duplicate actions
          if (order.payment.status !== 'Paid') {
            order.payment.status = 'Paid';
            order.payment.method = 'Razorpay';
            if (razorpayPaymentId) {
              order.payment.razorpayPaymentId = razorpayPaymentId;
            }
            order.status = 'processing';
            await order.save();
            console.log(`Order #${order.orderNumber} successfully marked as Paid via webhook`);

            try {
              revalidatePath('/orders');
              revalidatePath(`/orders/${order._id.toString()}`);
              revalidatePath('/dashboard/orders');
              revalidatePath('/dashboard');
            } catch {}
          } else {
            console.log(`Order #${order.orderNumber} already marked as Paid. Webhook skipped.`);
          }
        } else {
          console.warn(`Webhook: Order with razorpayOrderId ${razorpayOrderId} not found.`);
        }
      }
    } else if (eventType === 'payment.failed') {
      const paymentEntity = event.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      const razorpayPaymentId = paymentEntity?.id;

      if (razorpayOrderId) {
        const order = await OrderModel.findOne({
          'payment.razorpayOrderId': razorpayOrderId,
        });

        // Only mark failed if order is not already marked Paid
        if (order && order.payment.status !== 'Paid') {
          order.payment.status = 'Failed';
          if (razorpayPaymentId) {
            order.payment.razorpayPaymentId = razorpayPaymentId;
          }
          await order.save();
          console.log(`Order #${order.orderNumber} payment marked as Failed via webhook`);

          try {
            revalidatePath('/orders');
            revalidatePath(`/orders/${order._id.toString()}`);
          } catch {}
        }
      }
    }

    // Always acknowledge 200 OK to Razorpay webhook deliverer
    return NextResponse.json({ received: true, event: eventType });
  } catch (err: any) {
    console.error('Unhandled error in Razorpay webhook handler:', err);
    // Return 500 so Razorpay knows to retry if an unexpected server exception occurred
    return NextResponse.json(
      { error: err.message || 'Server error processing webhook' },
      { status: 500 }
    );
  }
}
