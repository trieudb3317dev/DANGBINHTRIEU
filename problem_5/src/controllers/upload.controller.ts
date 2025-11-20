import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// helper to upload buffer via stream
const uploadBuffer = (buffer: Buffer, options = {}) =>
  new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );
    stream.end(buffer);
  });

const uploadController = {
  uploadFile: async (req: Request, res: Response) => {
    try {
      // ensure cloudinary configured
      if (
        !process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
      ) {
        return res.status(500).json({ message: 'Cloudinary not configured' });
      }

      // Robust file extraction: support req.file, req.files array, req.files object (fields)
      const anyReq: any = req;
      let file: any = anyReq.file;

      if (!file && anyReq.files) {
        if (Array.isArray(anyReq.files) && anyReq.files.length > 0) {
          file = anyReq.files[0];
        } else if (typeof anyReq.files === 'object') {
          // multer.fields or similar -> object with arrays per field
          const keys = Object.keys(anyReq.files);
          if (keys.length > 0) {
            const first = anyReq.files[keys[0]];
            file = Array.isArray(first) ? first[0] : first;
          }
        }
      }

      if (!file) {
        // Helpful debug hint: likely mismatch between field name sent and multer.single(...) field name
        return res.status(400).json({
          message: 'No file uploaded',
          hint:
            "Check your multipart form field name matches multer middleware (e.g. upload.single('file')). If you use multer.fields/array, controller accepts the first provided file.",
        });
      }

      let result: any;
      // prefer buffer (use multer memoryStorage) -> upload via stream
      if (file.buffer) {
        result = await uploadBuffer(file.buffer, { folder: 'products' });
      } else if (file.path) {
        // disk storage (multer diskStorage) -> upload by file path
        result = await cloudinary.uploader.upload(file.path, {
          folder: 'products',
        });
      } else {
        return res.status(400).json({ message: 'Unsupported file payload' });
      }

      return res.status(200).json({
        image_url: result.secure_url,
        public_id: result.public_id,
        raw: result,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  },
};

export default uploadController;
