import { Amount, Id } from "../domain/core";
import { Wallet } from "../domain/Wallet";
import { IWalletRepository } from "../repositories/interfaces/IWalletRepository";

export class WalletService {
  constructor(private walletRepository: IWalletRepository) {}

  createWallet(userId: Id, walletId: Id) {
    const newWallet: Wallet = {
      id: walletId,
      userId: userId,
      balance: 0,
      transactions: [],
    };
    this.walletRepository.create(newWallet);
    return newWallet;
  }

  getBalance(userId: Id): Amount {
    return this.walletRepository.getBalance(userId);
  }

  getWallet(userId: Id): Partial<Wallet> {
    return this.walletRepository.getWallet(userId);
  }

  topUpWithAmount(userId: Id, amount: Amount): unknown {
    const currentWalletBalance = this.getBalance(userId);
    const balanceToUpdateWalletWith = currentWalletBalance + amount;
    return this.walletRepository.updateBalance(
      userId,
      balanceToUpdateWalletWith
    );
  }

  hasSufficientBalance(userId: Id, amountToTransfer: Amount): boolean {
    const balance = this.getBalance(userId);
    return balance >= amountToTransfer;
  }
}
