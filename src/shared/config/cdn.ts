import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUDNAME,
      api_key: process.env.CLOUDINARY_APIKEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
  }

  async upload(
    file: Express.Multer.File,
  ): Promise<cloudinary.UploadApiResponse | cloudinary.UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      const imageStream = Readable.from(file.buffer);
      imageStream.pipe(upload);
    });
  }
}
