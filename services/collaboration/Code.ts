import mongoose, { Schema, Document } from "mongoose";

interface ICode extends Document {
  content: string;
}

const CodeSchema: Schema = new Schema({
  content: { type: String, required: true },
});

const CodeModel = mongoose.model<ICode>("Code", CodeSchema);

export default CodeModel;
