interface Response<T = any> {
  message?: string;
  error?: string;
  data?: T;
}

export default Response;