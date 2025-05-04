import { Id, Username } from "../../domain/core";
import { User } from "../../domain/User";

export interface IUserRepository {
  getIdByUsername(username: Username): Id;
  getIdsByUsernames(usernames: Username[]): Id[];
  findById(id: Id): User | undefined;
  findByUsername(username: Username): User | undefined;
  create(user: User): Partial<User>;
  getWalletId(username: Username): Id;
}
