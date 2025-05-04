import { Id, Amount } from "./core";
import { Transaction } from "./Transaction";

export type Wallet = {
    id: Id;
    userId: Id;
    balance: Amount;
    transactions: Transaction[]
}