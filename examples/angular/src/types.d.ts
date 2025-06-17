declare interface FirebaseEnv {
  projectId: string;
  appId: string;
  storageBucket: string;
  apiKey: string;
  authDomain: string;
  messagingSenderId: string;
  measurementId: string;
}

declare interface FireAuthEnv {
  serverUrl: string;
}

declare let process: {
  env: {
    PORT: string;
    firebase: FirebaseEnv;
    fireauth: FireAuthEnv;
  };
};
