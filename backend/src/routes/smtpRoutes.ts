import { Router } from 'express';
import * as smtpController from '../controllers/smtpController';

const router = Router();

router.post('/', smtpController.saveConfigSmtp);
router.get('/', smtpController.getConfigSmtp);
router.post('/test', smtpController.testSmtpConnection);

export default router;
