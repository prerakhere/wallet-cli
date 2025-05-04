import { Id, Amount, Username } from "../domain/core";
import { Wallet } from "../domain/Wallet";
import { IWalletRepository } from "./interfaces/IWalletRepository";

export default class InMemoryWalletRepository implements IWalletRepository {
  private walletsById: Map<Id, Wallet> = new Map();
  private userIdToWalletId: Map<Username, Id> = new Map();

  constructor() {}
  create(wallet: Wallet): void {
    this.walletsById.set(wallet.id, wallet);
    this.userIdToWalletId.set(wallet.userId, wallet.id);
  }

  updateBalance(userId: Id, balance: Amount): Amount {
    const walletId = this.userIdToWalletId.get(userId);
    const wallet = this.walletsById.get(walletId!);
    if (!wallet) throw new Error("Wallet not found");
    wallet.balance = balance;
    this.walletsById.set(walletId!, wallet);
    return balance;
  }

  getBalance(userId: Id): Amount {
    const walletId = this.userIdToWalletId.get(userId);
    if (!walletId) throw new Error("Wallet not found for username");

    const wallet = this.walletsById.get(walletId);
    if (!wallet) throw new Error("Wallet not found");
    return wallet.balance;
  }

  getWallet(userId: Id): Partial<Wallet> {
    const walletId = this.userIdToWalletId.get(userId);
    if (!walletId) throw new Error("Wallet not found for username");

    const wallet = this.walletsById.get(walletId);
    if (!wallet) throw new Error("Wallet not found");
    return {
      id: wallet.id,
      balance: wallet.balance,
    };
  }
}
