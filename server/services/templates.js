import multer from 'multer';
import Template from '../models/templates.js';
import fetch from 'node-fetch';

const upload = multer();

export const uploadTemplates = async (req, res, next) => {
  try {
    const { files } = req;
    const templates = await Promise.all(files.map(async (file) => {
      const newTemplate = new Template({
        //name: file.originalname,
        name: req.body.name,
        data: file.buffer,
      });
      return await newTemplate.save();
    }));
    res.status(201).json({ templates });
  } catch (error) {
    next(error);
  }
};

export const getTemplates = async (req, res, next) => {
  try {
    const templates = await Template.find();
    res.json({ templates });
  } catch (error) {
    next(error);
  }
};

export const getTemplateById = async (req, res, next) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json({ template });
  } catch (error) {
    next(error);
  }
};