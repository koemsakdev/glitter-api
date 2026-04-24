import { diskStorage, StorageEngine } from 'multer';

export function createDiskStorage(destination: string): StorageEngine {
  return diskStorage({
    destination,
    filename: (
      _req,
      file: Express.Multer.File,
      callback: (error: Error | null, filename: string) => void,
    ) => {
      const filename = `${Date.now()}-${file.originalname}`;
      callback(null, filename);
    },
  });
}
