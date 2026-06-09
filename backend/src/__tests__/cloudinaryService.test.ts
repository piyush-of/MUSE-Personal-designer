import cloudinaryService from '../services/cloudinaryService';

describe('CloudinaryService', () => {
  it('returns demo URL when Cloudinary is not configured', async () => {
    const url = await cloudinaryService.uploadImage(Buffer.from('fake-image'));
    expect(url).toContain('cloudinary.com');
  });
});
