import { CLI } from "./cli/CLI";
import { CLIAppController } from "./controllers/CLIAppController";
import { UserService } from "./services/UserService";
import { WalletService } from "./services/WalletService";
import { TransactionService } from "./services/TransactionService";

import InMemoryUserRepository from "./repositories/InMemoryUserRepository";
import InMemoryWalletRepository from "./repositories/InMemoryWalletRepository";
import InMemoryTransactionRepository from "./repositories/InMemoryTransactionRepository";

const cli = new CLI();

// repositories
const userRepo = new InMemoryUserRepository();
const walletRepo = new InMemoryWalletRepository();
const transactionRepo = new InMemoryTransactionRepository();

// services
const walletService = new WalletService(walletRepo);
const userService = new UserService(userRepo, walletService);
const transactionService = new TransactionService(transactionRepo, userService, walletService);

const appController = new CLIAppController(
  cli,
  userService,
  walletService,
  transactionService
);

appController.startProgram()