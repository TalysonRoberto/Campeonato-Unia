import mongoose, { Schema, Document } from 'mongoose';

export interface ITime extends Document {
  nome: string;
  jogadores: string[];
  logo: string;
  logoId?: string;
  cor: string;
  vitorias: number;
  derrotas: number;
  pontos: number;
  mapasGanhos: number;
  mapasPerdidos: number;
}

const TimeSchema = new Schema<ITime>({
  nome: { type: String, required: true },
  jogadores: { type: [String], default: [] },
  logo: { type: String, default: '/img/logo.png' },
  logoId: { type: String, default: null },
  cor: { type: String, default: '#14b8a6' },
  vitorias: { type: Number, default: 0 },
  derrotas: { type: Number, default: 0 },
  pontos: { type: Number, default: 0 },
  mapasGanhos: { type: Number, default: 0 },
  mapasPerdidos: { type: Number, default: 0 }
});

export default mongoose.models.Time || mongoose.model<ITime>('Time', TimeSchema);
