import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import { connectDB } from './db/config';
import { swaggerSpec, swaggerUi } from './swagger'; // <-- added

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8080;

// Connect to Database
connectDB()
  .then(() => {
    console.log('Database connection established');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

// Middleware

import userRouter from './routers/user.router';
import categoryRouter from './routers/category.router';
import productRouter from './routers/product.router';
import uploadRouter from './routers/upload.router';

app.use(cors({
  origin: '*',
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const API_PREFIX = '/api/v1';

// serve swagger ui
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Expose raw OpenAPI JSON for debugging (useful on deployed host)
app.get('/api-docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Routes

app.use(`${API_PREFIX}/upload`, uploadRouter);
app.use(`${API_PREFIX}/users`, userRouter);
app.use(`${API_PREFIX}/categories`, categoryRouter);
app.use(`${API_PREFIX}/products`, productRouter);

app.get('/', (req: Request, res: Response): void => {
  res.status(200).json({ message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} : http://localhost:${PORT}`);
});
