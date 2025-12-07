import { useState } from 'react';
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTask,
} from 'firebase/storage';
import { storage } from '@/lib/firebase';

export const useStorage = () => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadTask, setUploadTask] = useState<UploadTask | null>(null);

  // Upload de arquivo com progresso
  const uploadFile = (
    file: File,
    path: string,
    onComplete?: (url: string) => void
  ) => {
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);

    setUploadTask(task);
    setError(null);

    task.on(
      'state_changed',
      (snapshot) => {
        const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressPercent);
      },
      (err) => {
        setError(err.message);
        console.error('Erro no upload:', err);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(task.snapshot.ref);
          if (onComplete) {
            onComplete(downloadURL);
          }
        } catch (err: any) {
          setError(err.message);
        }
      }
    );

    return task;
  };

  // Upload simples sem progresso
  const uploadFileSimple = async (file: File, path: string) => {
    try {
      setError(null);
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Deletar arquivo
  const deleteFile = async (path: string) => {
    try {
      setError(null);
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Cancelar upload
  const cancelUpload = () => {
    if (uploadTask) {
      uploadTask.cancel();
      setUploadTask(null);
      setProgress(0);
    }
  };

  return {
    progress,
    error,
    uploadFile,
    uploadFileSimple,
    deleteFile,
    cancelUpload,
  };
};

