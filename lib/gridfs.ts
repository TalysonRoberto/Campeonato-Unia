import { connectToDatabase } from './mongodb';
import mongoose from 'mongoose';
import { Readable } from 'stream';

function getDb() {
  return mongoose.connection.db!;
}

export async function uploadImageToGridFS(file: File, filename: string): Promise<string> {
  await connectToDatabase();
  const db = getDb();

  const bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: 'imagens'
  });

  const buffer = Buffer.from(await file.arrayBuffer());
  const readableStream = Readable.from(buffer);

  const uploadStream = bucket.openUploadStream(filename, {
    metadata: { contentType: file.type || 'image/png' }
  } as any);

  return new Promise((resolve, reject) => {
    readableStream
      .pipe(uploadStream)
      .on('error', reject)
      .on('finish', () => {
        resolve(uploadStream.id.toString());
      });
  });
}

export async function getImageFromGridFS(id: string): Promise<{ buffer: Buffer; contentType: string } | null> {
  await connectToDatabase();
  const db = getDb();

  const bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: 'imagens'
  });

  const objectId = new mongoose.Types.ObjectId(id);

  const files = await bucket.find({ _id: objectId }).toArray();
  if (files.length === 0) return null;

  const file = files[0] as any;
  const contentType = file.metadata?.contentType || file.contentType || 'image/png';

  const chunks: Buffer[] = [];
  const downloadStream = bucket.openDownloadStream(objectId);

  return new Promise((resolve, reject) => {
    downloadStream
      .on('data', (chunk: Buffer) => chunks.push(chunk))
      .on('error', reject)
      .on('end', () => {
        resolve({
          buffer: Buffer.concat(chunks),
          contentType
        });
      });
  });
}

export async function deleteImageFromGridFS(id: string): Promise<void> {
  await connectToDatabase();
  const db = getDb();

  const bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: 'imagens'
  });

  await bucket.delete(new mongoose.Types.ObjectId(id));
}
