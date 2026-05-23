import { Router } from 'express';
import * as datasComemorativasController from '../controllers/datasComemorativasController';

const router = Router();

router.post('/', datasComemorativasController.createDataComemorativa);
router.get('/', datasComemorativasController.getDatasComemorativas);
router.get('/:id', datasComemorativasController.getDataComemorativa);
router.put('/:id', datasComemorativasController.updateDataComemorativa);
router.delete('/:id', datasComemorativasController.deleteDataComemorativa);

export default router;
