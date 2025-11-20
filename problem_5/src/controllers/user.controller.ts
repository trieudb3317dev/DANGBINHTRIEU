import { User } from '../models/user.schema';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

const userController = {
  // Example: Get user by ID
  getUserById: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId).exec();
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  },

  createUser: async (req: Request, res: Response) => {
    try {
      const { username, email, password, avatar, role } = req.body;

      const existingUser = await User.findOne({ username }).exec();
      if (existingUser) {
        return res
          .status(400)
          .json({ message: 'User with this username already exists' });
      }

      const salt = 10;

      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        avatar,
        role,
      });
      const savedUser = await newUser.save();
      return res.status(201).json(savedUser);
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  },
};

export default userController;
