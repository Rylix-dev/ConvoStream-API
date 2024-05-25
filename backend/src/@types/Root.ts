interface RootUser {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    apiToken?: string;
    apiSecret?: string;
  }
  
  export default RootUser;
  