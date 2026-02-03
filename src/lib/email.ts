import nodemailer from 'nodemailer';
import { formatPrice } from './shop-utils';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vrindavan.com';

export async function sendEmail(to: string, subject: string, html: string) {
    try {
        // Skip if no credentials in prod (prevent crash) but log in dev
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log('Skipping email sending: SMTP credentials not provided');
            console.log('Would send to:', to);
            console.log('Subject:', subject);
            return;
        }

        const info = await transporter.sendMail({
            from: `"Vrindavan Ras Desh" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export async function sendOrderReceivedEmail(order: any) {
    const subject = `Order Received - #${order.orderNumber}`;
    const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #d35400;">Jai Shri Radhe!</h1>
      <p>Dear ${order.customerName},</p>
      <p>Thank you for your order. We have received your request and it is currently <strong>pending payment verification</strong>.</p>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Order Details (#${order.orderNumber})</h3>
        <p><strong>Total Amount:</strong> ${formatPrice(order.total)}</p>
        <p><strong>Payment Status:</strong> Verification Pending</p>
      </div>

      <p>If you haven't completed the payment yet, please use the QR code provided at checkout or contact us.</p>
      
      <p>Once your payment is verified, we will confirm your order and begin processing it.</p>
      
      <p>With Love & Devotion,<br>Vrindavan Ras Desh Team</p>
    </div>
  `;
    return sendEmail(order.customerEmail, subject, html);
}

export async function sendPaymentVerificationEmail(order: any) {
    // Email to Admin
    const subjectAdmin = `Action Required: Verify Payment for Order #${order.orderNumber}`;
    const htmlAdmin = `
    <div style="font-family: sans-serif;">
      <h2>Payment Verification Needed</h2>
      <p>Customer <strong>${order.customerName}</strong> has marked Order #${order.orderNumber} as PAID.</p>
      <p><strong>Amount:</strong> ${formatPrice(order.total)}</p>
      <p><strong>Action:</strong> Please check your bank/UPI statement. If received, mark order as PAID in admin panel.</p>
      <p><a href="${process.env.NEXTAUTH_URL}/admin/orders">Go to Admin Panel</a></p>
    </div>
  `;

    await sendEmail(ADMIN_EMAIL, subjectAdmin, htmlAdmin);

    // Email to Customer
    const subjectCustomer = `Payment Verification in Progress - Order #${order.orderNumber}`;
    const htmlCustomer = `
    <div style="font-family: sans-serif;">
      <p>Dear ${order.customerName},</p>
      <p>Thank you! We have received your payment confirmation for Order #${order.orderNumber}.</p>
      <p>We are currently verifying the transaction with our bank. You will receive a final confirmation email shortly once executed.</p>
    </div>
  `;

    return sendEmail(order.customerEmail, subjectCustomer, htmlCustomer);
}

export async function sendPaymentConfirmedEmail(order: any) {
    const subject = `Payment Confirmed! Your Order #${order.orderNumber} is confirmed`;
    const html = `
    <div style="font-family: sans-serif;">
      <h1 style="color: #27ae60;">Payment Received!</h1>
      <p>Dear ${order.customerName},</p>
      <p>We are happy to inform you that your payment for Order #${order.orderNumber} has been verified successfully.</p>
      <p>We will now start packing your order with care and devotion.</p>
      <p>Thank you for shopping with Vrindavan Ras Desh.</p>
    </div>
  `;
    return sendEmail(order.customerEmail, subject, html);
}
