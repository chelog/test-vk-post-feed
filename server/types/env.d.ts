declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: string;
      PORT?: number;
      SECRET?: string;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

export {};
