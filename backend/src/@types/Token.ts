interface Token {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  profilePicture: string;
  bio: string;
  status: string;
  keys: {
    publicKey: string;
  };
}

export default Token;
