import { Username, Amount, Id } from "../domain/core";
import { Transaction } from "../domain/Transaction";
import { ITransactionRepository } from "../repositories/interfaces/ITransactionRepository";
import { UserService } from "./UserService";
import { WalletService } from "./WalletService";

export class TransactionService {
  constructor(
    private transactionRepository: ITransactionRepository,
    private userService: UserService,
    private walletService: WalletService
  ) {}

  getAllTransactions(): Transaction[] {
    return this.transactionRepository.getAll();
  }

  getAllTransactionsOfUser(username: Username): any {
    return this.transactionRepository.getAllByUser(username);
  }

  makeTransaction(params: {
    fromUserId: Id;
    toUserId: Id;
    fromUsername: Username;
    toUsername: Username;
    transferAmount: Amount;
  }): void {
    const { fromUserId, toUserId, fromUsername, toUsername, transferAmount } =
      params;
    const doesSenderExists = this.userService.isExistingUser({
      id: fromUserId,
    });
    const doesReceiverExists = this.userService.isExistingUser({
      id: toUserId,
    });
    const missingUsers: string[] = [];
    if (!doesSenderExists) missingUsers.push(`Sender (${fromUsername})`);
    if (!doesReceiverExists) missingUsers.push(`Receiver (${toUsername})`);

    if (missingUsers.length > 0) {
      throw new Error(`${missingUsers.join(" and ")} not found`);
    }

    const fromWallet = this.walletService.getWallet(fromUserId);
    const toWallet = this.walletService.getWallet(toUserId);
    if (
      fromWallet?.balance === undefined ||
      toWallet?.balance === undefined ||
      fromWallet.balance < transferAmount
    ) {
      throw new Error("Invalid transaction");
    }

    fromWallet.balance -= transferAmount;
    toWallet.balance += transferAmount;

    if (!this.walletService.hasSufficientBalance(fromUserId, transferAmount)) {
      throw new Error("Insufficient balance");
    }

    this.walletService.updateBalance(fromUserId, fromWallet.balance);
    this.walletService.updateBalance(toUserId, toWallet.balance);

    const txnId = this.generateId();
    this.transactionRepository.create({
      txnId,
      fromUserId,
      toUserId,
      fromUsername,
      toUsername,
      transferAmount,
    });
  }

  private generateId(): Id {
    return `TXN-${Math.random().toString(36).substring(2, 10)}`;
  }
}
