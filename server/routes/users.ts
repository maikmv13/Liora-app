import express from 'express';
import { userController } from '../controllers/userController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/:userId/profile', auth, userController.getProfile);
router.put('/:userId/profile', auth, userController.updateProfile);
router.get('/:userId/favorites', auth, userController.getFavorites);
router.post('/:userId/favorites', auth, userController.addFavorite);
router.delete('/:userId/favorites/:recipeId', auth, userController.removeFavorite);

export default router;