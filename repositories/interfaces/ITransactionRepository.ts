import { Username, Amount, Id } from "../../domain/core";
import { Transaction } from "../../domain/Transaction";

export interface ITransactionRepository {
  create(params: {
    txnId: Id;
    fromUserId: Id;
    toUserId: Id;
    fromUsername: Username;
    toUsername: Username;
    transferAmount: Amount;
  }): Transaction;
  getAll(): Transaction[];
  getAllByUser(username: Username): any;
}
