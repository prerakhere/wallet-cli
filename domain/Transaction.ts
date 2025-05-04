import { Id, Amount, Timestamp, Username } from "./core";

export type Transaction = {
    id: Id;
    from: Username;
    to: Username;
    amount: Amount;
    status: TransactionStatus;
    createdAt: Timestamp;
}

export enum TransactionStatus {
    Succeeded = 'succeeded',
    Failed = 'failed'
}

export enum TransactionType {
    Topup = 'topup',
    Transfer = 'transfer'
}

export enum TransactionFlow {
    Sent = 'sent',
    Received = 'received'
}