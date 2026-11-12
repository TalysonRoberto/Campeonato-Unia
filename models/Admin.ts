import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  usuario: string;
  senha: string;
}

const AdminSchema = new Schema<IAdmin>({
  usuario: { type: String, required: true, unique: true },
  senha: { type: String, required: true }
});

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
