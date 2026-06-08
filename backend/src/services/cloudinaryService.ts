import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config';

if (config.cloudinary.enabled) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
}

export class CloudinaryService {
  async uploadImage(fileBuffer: Buffer, folder = 'muse'): Promise<string> {
    if (!config.cloudinary.enabled) {
      // Return a simulated URL if keys are not present (dev mode fallback)
      return `https://res.cloudinary.com/demo/image/upload/sample.jpg`;
    }

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Upload to Cloudinary failed'));
          } else {
            resolve(result.secure_url);
          }
        }
      ).end(fileBuffer);
    });
  }
}
export default new CloudinaryService();
