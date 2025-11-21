import express from 'express';
import categoryController from '../controllers/category.controller';

const categoryRouter = express.Router();

/**
 * @openapi
 * /api/v1/categories/{id}:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category id
 *     responses:
 *       '200':
 *         description: Successful response with category data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       '404':
 *         description: Category not found
 *       '500':
 *         description: Server error
 */
categoryRouter.get('/:id', categoryController.getCategoryById);

/**
 * @openapi
 * /api/v1/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get all categories (supports search, pagination and sorting)
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
 *         description: Text to search in category name (case-insensitive, partial match)
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
 *         description: List of categories with pagination metadata
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
categoryRouter.get('/', categoryController.getAllCategories);

/**
 * @openapi
 * /api/v1/categories:
 *   post:
 *     tags:
 *       - Categories
 *     summary: Create a new category
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
 *               create_by:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Category created
 *       '400':
 *         description: Invalid input
 *       '500':
 *         description: Server error
 */
categoryRouter.post('/', categoryController.createCategory);

/**
 * @openapi
 * /api/v1/categories/{id}:
 *   put:
 *     tags:
 *       - Categories
 *     summary: Update a category by ID
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
 *               image:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Category updated
 *       '404':
 *         description: Category not found
 */
categoryRouter.put('/:id', categoryController.updateCategory);

/**
 * @openapi
 * /api/v1/categories/{id}:
 *   delete:
 *     tags:
 *       - Categories
 *     summary: Activate/deactivate a category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Category activation toggled
 *       '404':
 *         description: Category not found
 */
categoryRouter.delete('/:id', categoryController.activateCategory);

export default categoryRouter;
