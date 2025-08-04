import { ethers } from 'ethers';

// Polygon Mainnet configuration
const POLYGON_NETWORK = {
  chainId: '0x89', // 137 in decimal
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: ['https://polygon-rpc.com/'],
  blockExplorerUrls: ['https://polygonscan.com/'],
};

// UPI ID to Wallet Address mapping (you can manually configure these)
const UPI_TO_WALLET_MAPPING: Record<string, string> = {
  'merchant@paytm': '0x742d35Cc6635b8bCc6d6eAa5e5b1B5b5D5E5F5G5',
  'shop@phonepe': '0x853e46De7e7c2b2b6d6eAa5e5b1B5b5D5E5F5G6',
  'restaurant@gpay': '0x964f57Ef8f8d3c3c7d7fBb6f6c2C6c6E6F6G6H7',
  // Add more mappings as needed
};

class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  // Initialize Web3 provider
  async initialize(): Promise<boolean> {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    try {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      await this.switchToPolygon();
      return true;
    } catch (error) {
      console.error('Failed to initialize Web3:', error);
      return false;
    }
  }

  // Switch to Polygon network
  async switchToPolygon(): Promise<void> {
    if (!window.ethereum) throw new Error('MetaMask not found');

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: POLYGON_NETWORK.chainId }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [POLYGON_NETWORK],
          });
        } catch (addError) {
          throw new Error('Failed to add Polygon network to MetaMask');
        }
      } else {
        throw new Error('Failed to switch to Polygon network');
      }
    }
  }

  // Connect wallet
  async connectWallet(): Promise<string> {
    if (!this.provider) {
      await this.initialize();
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      this.signer = await this.provider!.getSigner();
      return accounts[0];
    } catch (error) {
      throw new Error('Failed to connect wallet');
    }
  }

  // Get wallet balance
  async getWalletBalance(address: string): Promise<string> {
    if (!this.provider) {
      await this.initialize();
    }

    try {
      const balance = await this.provider!.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      throw new Error('Failed to get wallet balance');
    }
  }

  // Resolve UPI ID to wallet address
  resolveUpiToWallet(upiId: string): string | null {
    return UPI_TO_WALLET_MAPPING[upiId.toLowerCase()] || null;
  }

  // Send MATIC payment
  async sendMaticPayment(
    toAddress: string,
    amountInMatic: string,
    upiId?: string
  ): Promise<{
    hash: string;
    from: string;
    to: string;
    amount: string;
    gasUsed?: string;
  }> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      // Validate amount
      const amount = ethers.parseEther(amountInMatic);
      if (amount <= 0) {
        throw new Error('Invalid amount');
      }

      // Check if recipient address is valid
      if (!ethers.isAddress(toAddress)) {
        throw new Error('Invalid recipient address');
      }

      // Get current gas price
      const gasPrice = await this.provider!.getFeeData();

      // Send transaction
      const transaction = await this.signer.sendTransaction({
        to: toAddress,
        value: amount,
        gasPrice: gasPrice.gasPrice,
      });

      console.log('Transaction sent:', transaction.hash);

      // Wait for confirmation
      const receipt = await transaction.wait();
      
      if (!receipt) {
        throw new Error('Transaction failed');
      }

      console.log('Transaction confirmed:', receipt);

      return {
        hash: transaction.hash,
        from: await this.signer.getAddress(),
        to: toAddress,
        amount: amountInMatic,
        gasUsed: receipt.gasUsed.toString(),
      };
    } catch (error: any) {
      console.error('Payment failed:', error);
      throw new Error(`Payment failed: ${error.message}`);
    }
  }

  // Send payment via UPI ID (resolves to wallet address)
  async sendPaymentToUpi(
    upiId: string,
    amountInMatic: string
  ): Promise<{
    hash: string;
    from: string;
    to: string;
    amount: string;
    upiId: string;
    gasUsed?: string;
  }> {
    // Resolve UPI ID to wallet address
    const walletAddress = this.resolveUpiToWallet(upiId);
    
    if (!walletAddress) {
      throw new Error(`UPI ID ${upiId} is not mapped to any wallet address`);
    }

    const result = await this.sendMaticPayment(walletAddress, amountInMatic, upiId);
    
    return {
      ...result,
      upiId,
    };
  }

  // Get transaction details
  async getTransactionDetails(hash: string): Promise<any> {
    if (!this.provider) {
      await this.initialize();
    }

    try {
      const transaction = await this.provider.getTransaction(hash);
      const receipt = await this.provider.getTransactionReceipt(hash);
      
      return {
        transaction,
        receipt,
      };
    } catch (error) {
      throw new Error('Failed to get transaction details');
    }
  }

  // Get current network
  async getNetwork(): Promise<any> {
    if (!this.provider) {
      await this.initialize();
    }

    return await this.provider.getNetwork();
  }

  // Add new UPI mapping (for manual configuration)
  addUpiMapping(upiId: string, walletAddress: string): void {
    if (!ethers.isAddress(walletAddress)) {
      throw new Error('Invalid wallet address');
    }
    UPI_TO_WALLET_MAPPING[upiId.toLowerCase()] = walletAddress;
    
    // Save to localStorage for persistence
    localStorage.setItem('upiMappings', JSON.stringify(UPI_TO_WALLET_MAPPING));
  }

  // Load UPI mappings from localStorage
  loadUpiMappings(): void {
    try {
      const saved = localStorage.getItem('upiMappings');
      if (saved) {
        const mappings = JSON.parse(saved);
        Object.assign(UPI_TO_WALLET_MAPPING, mappings);
      }
    } catch (error) {
      console.error('Failed to load UPI mappings:', error);
    }
  }

  // Get all UPI mappings
  getUpiMappings(): Record<string, string> {
    return { ...UPI_TO_WALLET_MAPPING };
  }
}

export const web3Service = new Web3Service();
export default web3Service;