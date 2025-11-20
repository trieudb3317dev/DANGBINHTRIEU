import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });
upload.single('file');

export default upload;
