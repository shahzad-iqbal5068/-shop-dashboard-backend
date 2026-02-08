import { Role } from "./role";
import { Permission } from "./permisisons";
export interface RegisterUser {
  username: string;
  email: string;
  password: string;

  role: Role; // SINGLE role
  permissions?: Permission[]; // Optional overrides
}
