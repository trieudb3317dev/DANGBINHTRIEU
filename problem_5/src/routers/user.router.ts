import express from 'express';
import userController from '../controllers/user.controller';

const userRouter = express.Router();

/**
 * @openapi
 * /api/v1/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       '200':
 *         description: Successful response with user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */
userRouter.get('/:id', userController.getUserById);

/**
 * @openapi
 * /api/v1/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               avatar:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *     responses:
 *       '201':
 *         description: User created
 *       '400':
 *         description: Invalid input
 *       '500':
 *         description: Server error
 */
userRouter.post('/', userController.createUser);

export default userRouter;