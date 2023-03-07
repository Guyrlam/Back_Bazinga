interface ILogin {
    nick?: string;
    email?: string;
    password: string;
}
interface IUser {
    name: string;
    nick: string;
    email: string;
    password: string;
    avatar?: string;
  }

export { ILogin, IUser }