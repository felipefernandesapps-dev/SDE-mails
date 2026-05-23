import { Router } from 'express';
import * as historicoController from '../controllers/historicoController';

const router = Router();

router.get('/', historicoController.getHistorico);
router.get('/stats', historicoController.getStats);

export default router;
