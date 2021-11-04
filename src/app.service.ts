import { Injectable } from '@nestjs/common';
import { getStorage, ref } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

@Injectable()
export class AppService {
  constructor() {
    initializeApp({
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
    });
    const storage = getStorage();
    const storageRef = ref(storage);
  }

  getHello(): string {
    return 'dd';
  }
}
