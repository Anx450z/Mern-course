export interface UserInterface{
  username: string,
  password: string,
  isAdmin: true
}

export interface DatabaseUserInterface {
  username: string;
  password: string;
  isAdmin: boolean;
  _id: string;
}