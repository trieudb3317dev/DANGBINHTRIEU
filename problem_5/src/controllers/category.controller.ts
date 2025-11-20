import { Request, Response } from 'express';
import { Category } from '../models/category.schema';
import { Product } from '../models/product.schema';
import { User } from '../models/user.schema';

const categoryController = {
  // Example: Get category by ID
  getCategoryById: async (req: Request, res: Response) => {
    try {
      const categoryId = req.params.id;
      const category = await Category.findOne({
        _id: categoryId,
        is_active: false,
      })
        .populate('products create_by')
        // .select('-__v')
        .exec();
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      return res.status(200).json({
        ...category.toObject(),
        products: category.products.map((product) => {
          return {
            _id: (product as any)._id,
            name: (product as any).name,
            description: (product as any).description,
            price: (product as any).price,
          };
        }),
        create_by: category.create_by
          ? {
              _id: (category.create_by as any)._id,
              username: (category.create_by as any).username,
              email: (category.create_by as any).email,
            }
          : null,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  },

  // Example: Get all categories (updated: supports query + pagination)
  getAllCategories: async (req: Request, res: Response) => {
    try {
      // Query params
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

      // Build filter
      const filter: any = { is_active: false };
      if (search && String(search).trim() !== '') {
        filter.name = { $regex: String(search).trim(), $options: 'i' };
      }

      // Build sort
      const sort: any = {};
      if (sortBy) {
        sort[String(sortBy)] =
          String(sortOrder).toLowerCase() === 'asc' ? 1 : -1;
      } else {
        sort.created_at = -1; // default: newest first
      }

      const total = await Category.countDocuments(filter).exec();

      const categories = await Category.find(filter)
        .populate('products create_by')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .exec();

      const data = categories.map((category) => ({
        ...category.toObject(),
        products: category.products.map((product) => {
          return {
            _id: (product as any)._id,
            name: (product as any).name,
            description: (product as any).description,
            price: (product as any).price,
          };
        }),
        create_by: category.create_by
          ? {
              _id: (category.create_by as any)._id,
              username: (category.create_by as any).username,
              email: (category.create_by as any).email,
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

  // Create new category
  createCategory: async (req: Request, res: Response) => {
    try {
      const { name, description, create_by } = req.body;

      const existingCategory = await Category.findOne({
        name,
        is_active: false,
      }).exec();
      if (existingCategory) {
        return res
          .status(400)
          .json({ message: 'Category with this name already exists' });
      }

      const user = await User.findById(create_by).exec();
      if (!user) {
        return res.status(400).json({ message: 'Creator user not found' });
      }

      const newCategory = new Category({
        name,
        description,
        create_by: user,
      });
      const savedCategory = await newCategory.save();
      return res.status(201).json(savedCategory);
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  },

  // Update category by ID
  updateCategory: async (req: Request, res: Response) => {
    try {
      const categoryId = req.params.id;
      const { name, description } = req.body;
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        { name, description },
        { new: true }
      );
      if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
      if (updatedCategory.is_active) {
        return res
          .status(400)
          .json({ message: 'Cannot update an active category' });
      }
      return res.status(200).json(updatedCategory);
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  },

  // Activate category by ID
  activateCategory: async (req: Request, res: Response) => {
    try {
      const categoryId = req.params.id;

      const existingCategory = await Category.findById(categoryId).exec();
      if (!existingCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }

      await Category.findByIdAndUpdate(
        categoryId,
        { is_active: true },
        { new: true }
      );

      await Product.updateMany(
        { category: categoryId },
        { is_active: true }
      ).exec();

      return res
        .status(200)
        .json({ message: 'Category activated successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  },
};

export default categoryController;
