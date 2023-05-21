const { initializeApp } = require('firebase/app');
const {
  getStorage, ref, getDownloadURL, uploadBytesResumable,
} = require('firebase/storage');

/*
API_KEY=AIzaSyCzAmonCFEZLVniL4kBrPhpaYhlKc2AcX0
AUTH_DOMAIN=dicoding-mentoring-a593e.firebaseapp.com
PROJECT_ID=dicoding-mentoring-a593e
STORAGE_BUCKET=dicoding-mentoring-a593e.appspot.com
MESSAGING_SENDER_ID=177840619572
APP_ID=1:177840619572:web:85c1445ef8cac0de62ca61,
MEASUREMENT_ID=G-BZSH6TQFSM
 */
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
}
module.exports = StorageService;
