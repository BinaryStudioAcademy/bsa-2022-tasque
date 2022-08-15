export interface UserModel {
  id: number,
  name: string,
  email: string,
  password: string,
  salt: string,
  avatar?: string
}
