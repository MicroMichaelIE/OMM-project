import multer from 'multer';
import Template from '../models/templates.js';
import fetch from 'node-fetch';
import fs from "fs";
import path from "path";


const upload = multer();

// export const uploadTemplates = async (req, res, next) => {
//   try {
//     const { files } = req;
//     const templates = await Promise.all(files.map(async (file) => {
//       const newTemplate = new Template({
//         //name: file.originalname,
//         name: req.body.name,
//         data: file.buffer,
//       });
//       return await newTemplate.save();
//     }));
//     res.status(201).json({ templates });
//   } catch (error) {
//     next(error);
//   }
// };

export const uploadTemplates = async (req, res, next) => {
  try {
    const { files } = req;
    const templatePaths = [];

    files.forEach((file) => {
      const name = req.body.name;
      const ext = file.originalname.split('.').pop();
      const fileName = `${name}-${Date.now()}.${ext}`;
      const path = `./public/${fileName}`;

      fs.writeFileSync(path, file.buffer);

      templatePaths.push(path);
    });

    res.status(201).json({ templatePaths });
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

// export const getTemplates = async (req, res, next) => {
//   try {
//     // Get the list of files in the public folder
//     const files = await fs.promises.readdir('./public');

//     // Filter the list to only include image files
//     const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));

//     // Create an array of objects containing the file name
//     const templates = imageFiles.map((fileName) => ({
//       name: fileName
//     }));

//     res.json({ templates });
//   } catch (error) {
//     next(error);
//   }
// };



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