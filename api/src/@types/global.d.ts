declare namespace NodeJS {
  interface Global {
    apiKey: string;
    apiSecret: string;
    apiUrl: string;
    dbId: string;
  }
}

// If using the global object directly:
declare var global: NodeJS.Global & typeof globalThis;
