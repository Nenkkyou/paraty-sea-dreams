/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Firebase Client SDK
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  
  // App Config
  readonly VITE_APP_URL: string;
  readonly VITE_ENABLE_DEBUG_LOGS: string;
  readonly VITE_API_VERSION: string;
  
  // Mode
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
