import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"Vinca Optics" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

export const sendOrderConfirmation = async (email: string, orderNumber: string, total: number): Promise<void> => {
  const html = `
    <h2>Thank you for your order!</h2>
    <p>Your order #${orderNumber} has been confirmed.</p>
    <p>Total: $${total.toFixed(2)}</p>
    <p>We'll send you another email when your order ships.</p>
  `;
  await sendEmail(email, `Order Confirmation - ${orderNumber}`, html);
};

export const sendOrderShipped = async (email: string, orderNumber: string, trackingNumber?: string): Promise<void> => {
  const html = `
    <h2>Your order has shipped!</h2>
    <p>Order #${orderNumber} is on its way.</p>
    ${trackingNumber ? `<p>Tracking Number: ${trackingNumber}</p>` : ''}
  `;
  await sendEmail(email, `Order Shipped - ${orderNumber}`, html);
};

