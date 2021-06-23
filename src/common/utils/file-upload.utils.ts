import { HttpException } from '@nestjs/common';

export enum MimeTypes {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
}

export function getFileCreationTimestamp() {
  return Date.now();
}

export function validateFileByMimeType(acceptableMimeTypes: MimeTypes[]) {
  return (req, file, cb) => {
    const isFileMimeTypeAcceptable = acceptableMimeTypes.includes(file.mimetype);
    if (!isFileMimeTypeAcceptable) {
      cb(new HttpException('This file format is not acceptable', 409), false);
    } else {
      cb(null, true);
    }
  };
}

export function getFileName(req, file, cb) {
  const fileNameParts = file.originalname.split('.');
  const fileExtension = fileNameParts[fileNameParts.length - 1];
  const fileNameWithoutExtension = fileNameParts.slice(0, fileNameParts.length - 1).join();
  cb(null, `${fileNameWithoutExtension}-${getFileCreationTimestamp()}.${fileExtension}`);
}
