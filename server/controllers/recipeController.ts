import { Request, Response } from 'express';
import { Recipe } from '../models/Recipe';

export const recipeController = {
  async getAll(req: Request, res: Response) {
    try {
      const recipes = await Recipe.findAll();
      res.json(recipes);
    } catch (error) {
      console.error('Get recipes error:', error);
      res.status(500).json({ message: 'Error al obtener las recetas' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const recipe = await Recipe.findById(id);
      
      if (!recipe) {
        return res.status(404).json({ message: 'Receta no encontrada' });
      }

      res.json(recipe);
    } catch (error) {
      console.error('Get recipe error:', error);
      res.status(500).json({ message: 'Error al obtener la receta' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const recipe = await Recipe.create(req.body);
      res.status(201).json(recipe);
    } catch (error) {
      console.error('Create recipe error:', error);
      res.status(500).json({ message: 'Error al crear la receta' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const recipe = await Recipe.update(id, req.body);
      
      if (!recipe) {
        return res.status(404).json({ message: 'Receta no encontrada' });
      }

      res.json(recipe);
    } catch (error) {
      console.error('Update recipe error:', error);
      res.status(500).json({ message: 'Error al actualizar la receta' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await Recipe.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Delete recipe error:', error);
      res.status(500).json({ message: 'Error al eliminar la receta' });
    }
  }
};