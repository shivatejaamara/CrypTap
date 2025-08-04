// Transaction logging service (can be extended with Firebase later)

export interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: string;
  amountInr: string;
  token: string;
  upiId?: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  gasUsed?: string;
  message?: string;
}

class TransactionService {
  private transactions: Transaction[] = [];

  constructor() {
    this.loadTransactions();
  }

  // Add new transaction
  addTransaction(transaction: Omit<Transaction, 'id' | 'timestamp'>): Transaction {
    const newTransaction: Transaction = {
      ...transaction,
      id: this.generateId(),
      timestamp: Date.now(),
    };

    this.transactions.unshift(newTransaction); // Add to beginning
    this.saveTransactions();
    
    return newTransaction;
  }

  // Update transaction status
  updateTransaction(id: string, updates: Partial<Transaction>): void {
    const index = this.transactions.findIndex(tx => tx.id === id);
    if (index !== -1) {
      this.transactions[index] = { ...this.transactions[index], ...updates };
      this.saveTransactions();
    }
  }

  // Get all transactions
  getAllTransactions(): Transaction[] {
    return [...this.transactions];
  }

  // Get transactions by status
  getTransactionsByStatus(status: Transaction['status']): Transaction[] {
    return this.transactions.filter(tx => tx.status === status);
  }

  // Get transaction by hash
  getTransactionByHash(hash: string): Transaction | null {
    return this.transactions.find(tx => tx.hash === hash) || null;
  }

  // Get recent transactions (last N)
  getRecentTransactions(count: number = 10): Transaction[] {
    return this.transactions.slice(0, count);
  }

  // Get total sent amount in INR
  getTotalSentAmount(): number {
    return this.transactions
      .filter(tx => tx.status === 'confirmed')
      .reduce((total, tx) => total + parseFloat(tx.amountInr), 0);
  }

  // Get transaction statistics
  getStatistics() {
    const confirmed = this.getTransactionsByStatus('confirmed');
    const pending = this.getTransactionsByStatus('pending');
    const failed = this.getTransactionsByStatus('failed');

    return {
      total: this.transactions.length,
      confirmed: confirmed.length,
      pending: pending.length,
      failed: failed.length,
      totalAmountInr: this.getTotalSentAmount(),
      totalAmountMatic: confirmed.reduce((total, tx) => total + parseFloat(tx.amount), 0),
    };
  }

  // Clear all transactions
  clearTransactions(): void {
    this.transactions = [];
    this.saveTransactions();
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Save to localStorage
  private saveTransactions(): void {
    try {
      localStorage.setItem('cryptap_transactions', JSON.stringify(this.transactions));
    } catch (error) {
      console.error('Failed to save transactions:', error);
    }
  }

  // Load from localStorage
  private loadTransactions(): void {
    try {
      const saved = localStorage.getItem('cryptap_transactions');
      if (saved) {
        this.transactions = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
      this.transactions = [];
    }
  }

  // Export transactions as JSON
  exportTransactions(): string {
    return JSON.stringify(this.transactions, null, 2);
  }

  // Get Polygonscan URL for transaction
  getPolygonscanUrl(hash: string): string {
    return `https://polygonscan.com/tx/${hash}`;
  }
}

export const transactionService = new TransactionService();
export default transactionService;