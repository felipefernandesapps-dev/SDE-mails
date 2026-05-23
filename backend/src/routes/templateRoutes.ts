import { Router } from 'express';
import * as templateController from '../controllers/templateController';

const router = Router();

router.post('/', templateController.createTemplate);
router.get('/', templateController.getTemplates);
router.get('/:id', templateController.getTemplate);
router.put('/:id', templateController.updateTemplate);
router.delete('/:id', templateController.deleteTemplate);
router.post('/preview', templateController.previewTemplate);

export default router;
