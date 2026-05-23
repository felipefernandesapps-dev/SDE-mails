import { Router } from 'express';
import * as destinatarioController from '../controllers/destinatarioController';

const router = Router();

router.post('/', destinatarioController.createDestinatario);
router.get('/', destinatarioController.getDestinatarios);
router.get('/:id', destinatarioController.getDestinatario);
router.put('/:id', destinatarioController.updateDestinatario);
router.delete('/:id', destinatarioController.deleteDestinatario);

export default router;
