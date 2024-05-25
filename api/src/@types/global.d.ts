declare namespace NodeJS {
  interface Global {
    cs_token: string;
    cs_apiSecret: string;
    cs_apiUrl: string;
  }
}

// If using the global object directly:
declare var global: NodeJS.Global & typeof globalThis;
