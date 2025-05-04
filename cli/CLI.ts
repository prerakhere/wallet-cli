import { input, select, confirm, Separator, number } from "@inquirer/prompts";
import chalk from "chalk";

export class CLI {
  constructor() {
    this.displayWelcomeMessage();
  }

  private displayWelcomeMessage() {
    console.log(
      chalk.blue(`
        -------------------------
       |    Welcome to tPay!     |
        -------------------------
      `)
    );
  }

  public async showHomeMenu(): Promise<string> {
    return await select({
      message: "What would you like to do?",
      pageSize: 10,
      choices: [
        { name: "Register Users", value: "register-users" },
        { name: "Top-up Wallet", value: "topup-wallet" },
        { name: "Transfer Money", value: "transfer-money" },
        { name: "Check Balance", value: "check-balance" },
        { name: "View all transactions", value: "view-all-transactions" },
        { name: "View Transaction of a user", value: "view-user-transactions" },
        new Separator(),
        { name: "Exit", value: "exit" },
      ],
    });
  }

  public async promptUsername(message = "Enter username:"): Promise<string> {
    return await input({ message });
  }

  public async promptAmount(message = "Enter amount:"): Promise<number | undefined> {
    return await number({ message });
  }

  public async confirmAction(message: string): Promise<boolean> {
    const confirmationMessage = chalk.blue(`CONFIRMATION: ${message}\n--`)
    return await confirm({ message: confirmationMessage });
  }

  public showMessage(msg: string) {
    console.log(msg);
  }

  public showSuccess(msg: string, bannered = true) {
    const border = chalk.green("-".repeat(msg.length + 8));
    if (bannered) console.log(chalk.green(`${border}\n✅ SUCCESS: ${msg}\n${border}`));
    else console.log(chalk.green(`${border}\n${msg}\n${border}`));
  }

  public showAdditionalInfo(msg: string) {
    console.log(chalk.yellow(`${msg}\n--`));
  }

  public showError(msg: string) {
    console.log(chalk.red(msg));
  }
}