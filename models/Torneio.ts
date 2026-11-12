import mongoose, { Schema, Document } from 'mongoose';

export interface ITorneio extends Document {
  nome: string;
  faseAtual: 'grupos' | 'playoffs';
  status: string;
  dataInicio: string | null;
  dataFim: string | null;
  configuracoes: {
    pontosVitoria: number;
    formatoJogos: string;
  };
}

const TorneioSchema = new Schema<ITorneio>({
  nome: { type: String, default: 'Campeonato Unia' },
  faseAtual: { type: String, enum: ['grupos', 'playoffs'], default: 'grupos' },
  status: { type: String, default: 'Em andamento' },
  dataInicio: { type: String, default: null },
  dataFim: { type: String, default: null },
  configuracoes: {
    pontosVitoria: { type: Number, default: 50 },
    formatoJogos: { type: String, default: 'MD3' }
  }
});

export default mongoose.models.Torneio || mongoose.model<ITorneio>('Torneio', TorneioSchema);
