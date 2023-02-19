import express from 'express';
import { uploadTemplates, getTemplates, getTemplateById } from '../services/templates.js';

import multer from 'multer';

const upload = multer();

const router = express.Router();

router.post('/', upload.array('template'), uploadTemplates);
router.use(express.static('./public'))
router.get('/', getTemplates);
router.use(express.static('./public'))
router.get('/:id', getTemplateById);


export default router;
