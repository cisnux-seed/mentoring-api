const { initializeApp } = require('firebase/app');
const { URL } = require('url');
const path = require('path');
const {
  getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject,
} = require('firebase/storage');

// Initialize Firebase Admin SDK
class StorageService {
  #storage;

  #firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    apiId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
  };

  constructor() {
    initializeApp(this.#firebaseConfig);
    this.#storage = getStorage();
  }

  async uploadFile(file, meta) {
    try {
      const storageRef = ref(this.#storage, `files/${meta.filename}${new Date()}`);
      const metaData = {
        contentType: meta.headers['content-type'],
      };

      const snapshot = await uploadBytesResumable(storageRef, file._data, metaData);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      console.log(snapshot);
      console.log(downloadUrl);
      console.log('File uploaded successfully.');
      return downloadUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async deleteFile(fileUrl) {
    const decodeUrl = decodeURIComponent(fileUrl).replace('files%2F', '');
    const parsed = new URL(decodeUrl);
    const decodeName = decodeURIComponent(path.basename(parsed.pathname));
    const storageRef = ref(this.#storage, `files/${decodeName}`);
    await deleteObject(storageRef)
      .then(() => {
        console.log('File deleted successfully.');
      })
      .catch((error) => {
        throw error;
      });
  }
}
module.exports = StorageService;
