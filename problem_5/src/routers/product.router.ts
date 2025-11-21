import express from 'express';
import productController from '../controllers/product.controller';

const productRouter = express.Router();

/**
 * @openapi
 * /api/v1/products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product id
 *     responses:
 *       '200':
 *         description: Successful response with product data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       '404':
 *         description: Product not found
 *       '500':
 *         description: Server error
 */
productRouter.get('/:id', productController.getProductById);

/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get all products (supports search, pagination and sorting)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (1-based)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search text against product name (case-insensitive)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by (e.g. created_at, name)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: "Sort order: asc or desc"
 *     responses:
 *       '200':
 *         description: List of products with pagination metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       '500':
 *         description: Server error
 */
productRouter.get('/', productController.getAllProducts);

/**
 * @openapi
 * /api/v1/products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               create_by:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Product created
 *       '400':
 *         description: Product with this name already exists
 *       '500':
 *         description: Server error
 */
productRouter.post('/', productController.createProduct);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Update a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Product updated
 *       '404':
 *         description: Product not found
 */
productRouter.put('/:id', productController.updateProduct);

/**
 * @openapi
 * /api/v1/products/{id}:
 *   delete:
 *     tags:
 *       - Products
 *     summary: Activate/deactivate a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Product activation toggled
 *       '404':
 *         description: Product not found
 */
productRouter.delete('/:id', productController.activateProduct);

// Uploasd image route can be added here if needed
// productRouter.post('/upload', uploadController.uploadFile);

export default productRouter;
