import { CLI } from "../cli/CLI";
import { TransactionService } from "../services/TransactionService";
import { UserService } from "../services/UserService";
import { WalletService } from "../services/WalletService";

export class CLIAppController {
  constructor(
    private cli: CLI,
    private userService: UserService,
    private walletService: WalletService,
    private transactionService: TransactionService
  ) {}

  public async startProgram() {
    let running = true;

    while (running) {
      const option = await this.cli.showHomeMenu();
      running = await this.handleOption(option);
    }

    this.cli.showMessage("Exiting tPay. Goodbye!");
  }

  private async handleOption(option: string): Promise<boolean> {
    try {
      if (option === "register-users") {
        const username = await this.cli.promptUsername(
          "Enter username to register (without spaces):"
        );
        const registeredUser = this.userService.registerUser(username);
        this.cli.showSuccess(`User ${registeredUser.username} registered!`);
      } else if (option === "topup-wallet") {
        const username = await this.cli.promptUsername();
        const amount = await this.cli.promptAmount("Enter top-up amount:");
        let updatedBalance;
        if (amount) {
          const userId = this.userService.getIdByUsername(username);
          updatedBalance = this.walletService.topUpWithAmount(userId, amount);
        }
        this.cli.showSuccess(`${username}'s wallet topped up with ${amount}!`);
        this.cli.showAdditionalInfo(`Updated balance: ${updatedBalance}`);
      } else if (option === "transfer-money") {
        const fromUsername = await this.cli.promptUsername(
          "Sender's username:"
        );
        const toUsername = await this.cli.promptUsername(
          "Receiver's username:"
        );
        const transferAmount = await this.cli.promptAmount(
          "Enter transfer amount:"
        );
        if (transferAmount) {
          const confirm = await this.cli.confirmAction(
            `Transfer amount ${transferAmount} from ${fromUsername} to ${toUsername}?`
          );
          const userIds = this.userService.getIdsByUsernames([
            fromUsername,
            toUsername,
          ]);
          this.transactionService.makeTransaction({
            fromUserId: userIds[0],
            toUserId: userIds[1],
            fromUsername,
            toUsername,
            transferAmount,
          });
          if (confirm)
            this.cli.showSuccess(
              `Amount ${transferAmount} transfered from ${fromUsername} to ${toUsername}`
            );
        }
      } else if (option === "check-balance") {
        const username = await this.cli.promptUsername();
        const userId = this.userService.getIdByUsername(username);
        const balance = this.walletService.getBalance(userId);
        this.cli.showSuccess(
          `${username}'s wallet balance: ${balance}`,
          false
        );
      } else if (option === "view-all-transactions") {
        const allTransactions = this.transactionService.getAllTransactions();
        if (allTransactions.length === 0) {
          this.cli.showAdditionalInfo("No transactions done yet!");
        } else {
          const formatted = allTransactions.map((txn) => ({
            id: txn.id,
            from: txn.from,
            to: txn.to,
            amount: txn.amount,
            status: txn.status,
            createdAt: new Date(txn.createdAt).toLocaleString(),
          }));
          this.cli.showSuccess(`All Transactions...`, false);
          console.table(formatted, [
            "id",
            "from",
            "to",
            "amount",
            "status",
            "createdAt",
          ]);
        }
      } else if (option === "view-user-transactions") {
        const username = await this.cli.promptUsername();
        const userTransactions =
          this.transactionService.getAllTransactionsOfUser(username);
        if (userTransactions.length === 0) {
          this.cli.showAdditionalInfo(
            `No transactions for the user ${username}`
          );
        } else {
          const formatted = userTransactions.map((txn: any) => ({
            id: txn.id,
            "counter party": txn["counter party"],
            "sent/received": txn["sent/received"],
            amount: txn.amount,
            status: txn.status,
            createdAt: new Date(txn.createdAt).toLocaleString(),
          }));
          this.cli.showSuccess(`Transactions for ${username}...`, false);
          console.table(formatted, ["id", "amount", "sent/received", "counter party", "status", "createdAt"]);
        }
      } else if (option === "exit") {
        return false;
      } else {
        this.cli.showError("Invalid option.");
      }
    } catch (err: any) {
      this.cli.showError(err.message || "Something went wrong.");
    }
    return true;
  }
}
