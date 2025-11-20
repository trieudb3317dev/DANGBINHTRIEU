import { Request, Response } from 'express';
import { Category } from '../models/category.schema';
import { Product } from '../models/product.schema';
import { User } from '../models/user.schema';

const productController = {
  // Example: Get product by ID
  getProductById: async (req: Request, res: Response) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId)
        .populate('category create_by')
        .exec();
      if (!product || product.is_active) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.status(200).json({
        ...product.toObject(),
        category: product.category
          ? {
              _id: (product.category as any)._id,
              name: (product.category as any).name,
              description: (product.category as any).description,
            }
          : null,
        create_by: product.create_by
          ? {
              _id: (product.create_by as any)._id,
              username: (product.create_by as any).username,
              email: (product.create_by as any).email,
            }
          : null,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  },

  // Example: Get all products (updated: supports query + pagination)
  getAllProducts: async (req: Request, res: Response) => {
    try {
      const {
        page = '1',
        limit = '10',
        search,
        sortBy,
        sortOrder = 'desc',
      } = req.query as Record<string, any>;

      const pageNum = Math.max(parseInt(page, 10) || 1, 1);
      const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
      const skip = (pageNum - 1) * limitNum;

      const filter: any = { is_active: false };
      if (search && String(search).trim() !== '') {
        filter.name = { $regex: String(search).trim(), $options: 'i' };
      }

      const sort: any = {};
      if (sortBy) {
        sort[String(sortBy)] =
          String(sortOrder).toLowerCase() === 'asc' ? 1 : -1;
      } else {
        sort.created_at = -1;
      }

      const total = await Product.countDocuments(filter).exec();

      const products = await Product.find(filter)
        .populate('category create_by')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .exec();

      const data = products.map((product) => ({
        ...product.toObject(),
        category: product.category
          ? {
              _id: (product.category as any)._id,
              name: (product.category as any).name,
              description: (product.category as any).description,
            }
          : null,
        create_by: product.create_by
          ? {
              _id: (product.create_by as any)._id,
              username: (product.create_by as any).username,
              email: (product.create_by as any).email,
            }
          : null,
      }));

      return res.status(200).json({
        data,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  },

  // Create new product
  createProduct: async (req: Request, res: Response) => {
    try {
      const { name, description, image, price, category, create_by } = req.body;

      const existingProduct = await Product.findOne({
        name,
        is_active: false,
      }).exec();
      if (existingProduct) {
        return res
          .status(400)
          .json({ message: 'Product with this name already exists' });
      }

      const existingCategory = await Category.findById(category).exec();

      if (!existingCategory || existingCategory.is_active) {
        return res.status(400).json({ message: 'Invalid category' });
      }

      const existingUser = await User.findById(create_by).exec();

      if (!existingUser || existingUser.is_active) {
        return res.status(400).json({ message: 'Invalid user' });
      }

      // create product using ids (match Category/User _id types)
      const newProduct = new Product({
        name,
        description,
        image: image,
        price,
        category: (existingCategory as any)._id,
        create_by: (existingUser as any)._id,
      });

      const savedProduct = await newProduct.save();

      // update category to add product id
      await Category.findByIdAndUpdate(existingCategory._id, {
        $push: { products: savedProduct._id },
      }).exec();

      return res.status(201).json(savedProduct);
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  },

  // Update product by ID
  updateProduct: async (req: Request, res: Response) => {
    try {
      const productId = req.params.id;
      const { name, description, price, image } = req.body;
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { name, description, price, image },
        { new: true }
      );
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      if (updatedProduct.is_active) {
        return res
          .status(400)
          .json({ message: 'Cannot update an active product' });
      }
      return res.status(200).json(updatedProduct);
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  },

  // Delete product by ID
  // Activate product by ID
  activateProduct: async (req: Request, res: Response) => {
    try {
      const productId = req.params.id;
      const existingProduct = await Product.findById(productId).exec();

      if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

      await Product.findByIdAndUpdate(
        productId,
        { is_active: true },
        { new: true }
      );

      await Category.findByIdAndUpdate(existingProduct.category, {
        $pull: { products: productId },
      }).exec();

      return res
        .status(200)
        .json({ message: 'Product activated successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  },
};

export default productController;
