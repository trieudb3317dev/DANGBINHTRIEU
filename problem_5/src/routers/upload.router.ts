import express from 'express';
import uploadController from '../controllers/upload.controller';
import upload from '../middleware/upload.middleware';

const router = express.Router();

// Define your upload routes here
/**
 * @openapi
 * /api/v1/upload:
 *   post:
 *     tags:
 *       - Uploads
 *     summary: Upload a file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       '500':
 *         description: Server error
 */
router.post('/', upload.single('file'), uploadController.uploadFile);

export default router;
