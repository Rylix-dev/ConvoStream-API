interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
  status?: "active" | "inactive";
  bio?: string;
  profilePic?: string;
  keys: {
    publicKey: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export default User;
