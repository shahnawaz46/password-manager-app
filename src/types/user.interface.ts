export interface IUser {
  _id: string;
  email: string;
  fullName: string;
  profileImage: string;
}

export interface IUpdateSessionArgs extends IUser {
  token: string;
}
