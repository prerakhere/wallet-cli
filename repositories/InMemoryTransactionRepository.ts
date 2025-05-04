import { Username, Amount, Id } from "../domain/core";
import {
  Transaction,
  TransactionFlow,
  TransactionStatus,
} from "../domain/Transaction";
import { ITransactionRepository } from "./interfaces/ITransactionRepository";

export default class InMemoryTransactionRepository
  implements ITransactionRepository
{
  private transactions: Transaction[] = [];
  constructor() {}
  create(params: {
    txnId: Id;
    fromUserId: Id;
    toUserId: Id;
    fromUsername: Username;
    toUsername: Username;
    transferAmount: Amount;
  }): Transaction {
    const {
      txnId,
      fromUserId,
      toUserId,
      fromUsername,
      toUsername,
      transferAmount,
    } = params;
    const newTransaction: Transaction = {
      id: txnId,
      from: fromUsername,
      to: toUsername,
      amount: transferAmount,
      status: TransactionStatus.Succeeded,
      createdAt: new Date(),
    };

    this.transactions.push(newTransaction);
    return newTransaction;
  }

  getAll(): Transaction[] {
    return this.transactions;
  }

  getAllByUser(username: Username): any {
    return this.transactions
      .filter((tx) => tx.from === username || tx.to === username)
      .map((tx) => ({
        id: tx.id,
        user: tx.from === username ? tx.to : tx.from,
        "sent/received":
          tx.from === username
            ? TransactionFlow.Sent
            : TransactionFlow.Received,
        amount: tx.amount,
        status: tx.status,
        createdAt: new Date(tx.createdAt).toLocaleString(),
      }));
  }
}
