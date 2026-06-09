import nodemailer from 'nodemailer';
import { config } from '../config';
import logger from '../utils/logger';

function createTransporter() {
  if (config.email.enabled) {
    return nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: config.email.resendKey,
      },
    });
  }
  // Dev: log to console
  return {
    sendMail: async (opts: { to: string; subject: string; html?: string }) => {
      logger.info(`[EMAIL DEV] To: ${opts.to} | Subject: ${opts.subject}`);
      if (opts.html) {
        const match = opts.html.match(/href="([^"]+)"/);
        if (match) logger.info(`[EMAIL DEV] Link: ${match[1]}`);
      }
      return { messageId: 'dev-mode' };
    },
  };
}

const transporter = createTransporter();

function emailTemplate(title: string, content: string, buttonText?: string, buttonUrl?: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0F0D0B;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0F0D0B;padding:40px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#1A1714;border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden">
        <tr><td style="background:linear-gradient(135deg,#B5674D,#A8864A);padding:32px 40px;text-align:center">
          <h1 style="margin:0;font-size:28px;color:#fff;letter-spacing:0.1em;font-weight:400">MU<span style="color:#FFD980">S</span>E</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:12px;letter-spacing:0.2em;text-transform:uppercase">Fashion Intelligence</p>
        </td></tr>
        <tr><td style="padding:40px">
          <h2 style="margin:0 0 16px;font-size:22px;color:#F0EBE3;font-weight:400">${title}</h2>
          <div style="color:rgba(240,235,227,0.7);font-size:15px;line-height:1.7">${content}</div>
          ${buttonText && buttonUrl ? `
          <div style="text-align:center;margin:32px 0">
            <a href="${buttonUrl}" style="display:inline-block;background:linear-gradient(135deg,#B5674D,#A8864A);color:#fff;text-decoration:none;padding:14px 36px;border-radius:4px;font-size:14px;letter-spacing:0.08em;font-weight:500">${buttonText}</a>
          </div>` : ''}
          <p style="color:rgba(240,235,227,0.4);font-size:12px;border-top:1px solid rgba(255,255,255,0.08);padding-top:20px;margin-top:20px">
            If you didn't request this, you can safely ignore this email.<br>
            © 2026 MUSE Studio — <a href="${config.email.appUrl}" style="color:#B5674D">muse.style</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const url = `${config.email.appUrl}/api/auth/verify/${token}`;
  try {
    await transporter.sendMail({
      from: `MUSE Studio <${config.email.from}>`,
      to: email,
      subject: 'Verify your MUSE account',
      html: emailTemplate(
        `Welcome to MUSE, ${name}!`,
        `<p>You're almost ready. Click the button below to verify your email address and unlock your personal fashion intelligence dashboard.</p>
         <p>This link expires in <strong style="color:#B5674D">24 hours</strong>.</p>`,
        'Verify Email →',
        url,
      ),
    });
  } catch (err: any) {
    logger.warn(`[EMAIL] Failed to send verification to ${email}: ${err.message}`);
  }
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const url = `${config.email.appUrl}/auth?reset=${token}`;
  try {
    await transporter.sendMail({
      from: `MUSE Studio <${config.email.from}>`,
      to: email,
      subject: 'Reset your MUSE password',
      html: emailTemplate(
        'Password Reset Request',
        `<p>Hi ${name},</p>
         <p>We received a request to reset your MUSE password. Click the button below to set a new password.</p>
         <p>This link expires in <strong style="color:#B5674D">1 hour</strong>. If you didn't request this, no action is needed.</p>`,
        'Reset Password →',
        url,
      ),
    });
  } catch (err: any) {
    logger.warn(`[EMAIL] Failed to send password reset to ${email}: ${err.message}`);
  }
}
export default { sendVerificationEmail, sendPasswordResetEmail };
