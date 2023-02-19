import mongoose from 'mongoose';

const templateSchema = mongoose.Schema({
  name: String,
  data: Buffer,
});

const Template = mongoose.model('Template', templateSchema);

export default Template;
