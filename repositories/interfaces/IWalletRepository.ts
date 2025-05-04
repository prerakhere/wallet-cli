import { Amount, Id, Username } from "../../domain/core";
import { Wallet } from "../../domain/Wallet";

export interface IWalletRepository {
  create(wallet: Wallet): void;
  getBalance(username: Username): Amount;
  updateBalance(walletId: Id, balance: Amount): Amount;
  getWallet(username: Username): Partial<Wallet>;
}
