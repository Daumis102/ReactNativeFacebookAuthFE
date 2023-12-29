export type User = {
  id: number;
  firstName: string;
  lastName: string;
  facebookId: string;
  userType: UserType | null;
};

export enum UserType {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
