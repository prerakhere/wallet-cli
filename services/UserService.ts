import { Id, Username } from "../domain/core";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { WalletService } from "./WalletService";

export class UserService {
  constructor(
    private userRepository: IUserRepository,
    private walletService: WalletService
) {}

  registerUser(username: Username) {
    if (username.includes(' ')) throw new Error("Username cannot contain spaces!");
    const isExistingUser = this.isExistingUser({username});
    if (isExistingUser) throw new Error(`User ${username} already exists!`);
    
    const userId = this.generateId();
    const walletId = this.generateWalletId();

    this.walletService.createWallet(userId, walletId);
    const newUser = this.userRepository.create({
      id: userId,
      username,
      walletId,
    });
    return newUser;
  }

  isExistingUser(params: { id?: Id; username?: Username }): boolean {
    if (params.id) {
      const doesUserExist = this.userRepository.findById(params.id);
      return !!doesUserExist;
    }
    if (params.username) {
      const doesUserExist = this.userRepository.findByUsername(params.username);
      return !!doesUserExist;
    }
    return false;
  }

  getIdByUsername(username: Username) {
    return this.userRepository.getIdByUsername(username);
  }

  getIdsByUsernames(usernames: Username[]) {
    return this.userRepository.getIdsByUsernames(usernames);
  }

  private generateId(): Id {
    return `USER-${Math.random().toString(36).substring(2, 10)}`;
  }

  private generateWalletId(): Id {
    return `WLT-${Math.random().toString(36).substring(2, 10)}`;
  }
}
