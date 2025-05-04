import { Username, Id } from "../domain/core";
import { User } from "../domain/User";
import { IUserRepository } from "./interfaces/IUserRepository";

export default class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];
  constructor() {}

  findById(id: Id): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  findByUsername(username: Username): User | undefined {
    return this.users.find((u) => u.username === username);
  }

  create(newUser: User): Partial<User> {
    this.users.push(newUser);
    return newUser;
  }

  getWalletId(username: Username): Id {
    const user = this.users.find((u) => u.username === username);
    if (!user) throw new Error("User not found");
    return user.walletId;
  }

  getIdByUsername(username: Username): Id {
    const user = this.users.find((u) => u.username === username);
    if (!user) throw new Error("User not found..");
    return user.id;
  }

  getIdsByUsernames(usernames: Username[]): Id[] {
    const missing: Username[] = [];

    const ids = usernames.map((username) => {
      const user = this.users.find((u) => u.username === username);
      if (!user) {
        missing.push(username);
        return null;
      }
      return user.id;
    });

    if (missing.length > 0) {
      throw new Error(`User(s) not found: ${missing.join(", ")}`);
    }

    return ids as Id[];
  }
}
