import { AuditFields } from '@/shared/types/db.types';

export interface User extends AuditFields {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface PublicUserData
  extends Pick<User, 'id' | 'username' | 'email' | 'name'> {}
