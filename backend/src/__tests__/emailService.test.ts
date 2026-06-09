import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService';

describe('EmailService (dev mode)', () => {
  it('sends verification email without throwing', async () => {
    await expect(sendVerificationEmail('test@muse.style', 'Test', 'token123')).resolves.not.toThrow();
  });

  it('sends password reset email without throwing', async () => {
    await expect(sendPasswordResetEmail('test@muse.style', 'Test', 'token456')).resolves.not.toThrow();
  });
});
