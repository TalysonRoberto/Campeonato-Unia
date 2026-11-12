import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import TimeModel from '../models/Time';

async function migrarImagens() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI não definida');
  }

  console.log('Conectando ao MongoDB...');
  await mongoose.connect(uri);
  console.log('Conectado!');

  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db!, {
    bucketName: 'imagens'
  });

  const times = await TimeModel.find();
  console.log(`Verificando ${times.length} times...`);

  for (const time of times) {
    const logoPath = time.logo;

    // Pula logos que já são do GridFS ou são o padrão
    if (!logoPath || logoPath.startsWith('/api/imagem/') || logoPath === '/img/logo.png') {
      console.log(`Pulando ${time.nome}: ${logoPath}`);
      continue;
    }

    const fullPath = path.join(process.cwd(), 'public', logoPath);
    if (!fs.existsSync(fullPath)) {
      console.log(`Arquivo não encontrado para ${time.nome}: ${fullPath}`);
      continue;
    }

    console.log(`Migrando imagem de ${time.nome}...`);
    const buffer = fs.readFileSync(fullPath);
    const ext = path.extname(logoPath) || '.png';
    const contentType = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';

    const uploadStream = bucket.openUploadStream(`time-${Date.now()}${ext}`, { metadata: { contentType } } as any);
    const logoId = await new Promise<string>((resolve, reject) => {
      uploadStream.on('error', reject);
      uploadStream.on('finish', () => resolve(uploadStream.id.toString()));
      uploadStream.end(buffer);
    });

    time.logoId = logoId;
    time.logo = `/api/imagem/${logoId}`;
    await time.save();
    console.log(`  -> Novo logo: ${time.logo}`);
  }

  console.log('Migração de imagens concluída!');
  await mongoose.disconnect();
  process.exit(0);
}

migrarImagens().catch(erro => {
  console.error('Erro na migração de imagens:', erro);
  process.exit(1);
});
