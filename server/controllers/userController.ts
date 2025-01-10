import { Request, Response } from 'express';
import { User } from '../models/User';

export const userController = {
  async getProfile(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.json(user);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Error al obtener el perfil' });
    }
  },

  async updateProfile(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = await User.update(userId, req.body);
      
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.json(user);
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Error al actualizar el perfil' });
    }
  },

  async getFavorites(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const favorites = await User.getFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error('Get favorites error:', error);
      res.status(500).json({ message: 'Error al obtener los favoritos' });
    }
  },

  async addFavorite(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { recipeId } = req.body;
      await User.addFavorite(userId, recipeId);
      res.status(201).send();
    } catch (error) {
      console.error('Add favorite error:', error);
      res.status(500).json({ message: 'Error al añadir a favoritos' });
    }
  },

  async removeFavorite(req: Request, res: Response) {
    try {
      const { userId, recipeId } = req.params;
      await User.removeFavorite(userId, recipeId);
      res.status(204).send();
    } catch (error) {
      console.error('Remove favorite error:', error);
      res.status(500).json({ message: 'Error al eliminar de favoritos' });
    }
  }
};