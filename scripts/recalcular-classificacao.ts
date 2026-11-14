import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import { atualizarEstatisticasTimes } from '../lib/data';

async function recalcular() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI não definida');
  }

  console.log('Conectando ao MongoDB...');
  await mongoose.connect(uri);
  console.log('Conectado!');

  console.log('Recalculando estatísticas...');
  await atualizarEstatisticasTimes();
  console.log('Estatísticas recalculadas!');

  await mongoose.disconnect();
  process.exit(0);
}

recalcular().catch(erro => {
  console.error('Erro:', erro);
  process.exit(1);
});
