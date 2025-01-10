import express from 'express';
import { recipeController } from '../controllers/recipeController';
import { auth, checkRole } from '../middleware/auth';

const router = express.Router();

router.get('/', recipeController.getAll);
router.get('/:id', recipeController.getById);
router.post('/', auth, checkRole(['nutritionist']), recipeController.create);
router.put('/:id', auth, checkRole(['nutritionist']), recipeController.update);
router.delete('/:id', auth, checkRole(['nutritionist']), recipeController.delete);

export default router;