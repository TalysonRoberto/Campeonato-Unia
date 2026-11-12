import mongoose, { Schema, Document } from 'mongoose';

export interface IPartida extends Document {
  timeA: string;
  timeB: string;
  data: string | null;
  horario: string | null;
  transmissao: string;
  fase: string;
  status: 'agendada' | 'ao_vivo' | 'finalizada';
  placarA: number;
  placarB: number;
  mapas: string[];
  estatisticas: any;
  vencedor: string | null;
}

const PartidaSchema = new Schema<IPartida>({
  timeA: { type: String, required: true },
  timeB: { type: String, required: true },
  data: { type: String, default: null },
  horario: { type: String, default: null },
  transmissao: { type: String, default: '' },
  fase: { type: String, default: 'grupos' },
  status: { type: String, enum: ['agendada', 'ao_vivo', 'finalizada'], default: 'agendada' },
  placarA: { type: Number, default: 0 },
  placarB: { type: Number, default: 0 },
  mapas: { type: [String], default: [] },
  estatisticas: { type: Schema.Types.Mixed, default: null },
  vencedor: { type: String, default: null }
});

export default mongoose.models.Partida || mongoose.model<IPartida>('Partida', PartidaSchema);
