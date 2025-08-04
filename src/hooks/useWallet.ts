import { useState, useEffect, useCallback } from 'react';
import web3Service from '@/services/web3Service';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: null,
    isLoading: false,
    error: null,
  });

  // Connect wallet
  const connectWallet = useCallback(async () => {
    setWalletState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await web3Service.initialize();
      const address = await web3Service.connectWallet();
      const balance = await web3Service.getWalletBalance(address);
      
      setWalletState({
        isConnected: true,
        address,
        balance,
        isLoading: false,
        error: null,
      });

      // Save connection state
      localStorage.setItem('wallet_connected', 'true');
      localStorage.setItem('wallet_address', address);
    } catch (error: any) {
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to connect wallet',
      }));
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWalletState({
      isConnected: false,
      address: null,
      balance: null,
      isLoading: false,
      error: null,
    });

    localStorage.removeItem('wallet_connected');
    localStorage.removeItem('wallet_address');
  }, []);

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (walletState.address) {
      try {
        const balance = await web3Service.getWalletBalance(walletState.address);
        setWalletState(prev => ({ ...prev, balance }));
      } catch (error) {
        console.error('Failed to refresh balance:', error);
      }
    }
  }, [walletState.address]);

  // Auto-connect on page load if previously connected
  useEffect(() => {
    const wasConnected = localStorage.getItem('wallet_connected');
    const savedAddress = localStorage.getItem('wallet_address');

    if (wasConnected && savedAddress) {
      connectWallet();
    }
  }, [connectWallet]);

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== walletState.address) {
          connectWallet();
        }
      };

      const handleChainChanged = () => {
        // Refresh the page when chain changes
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [walletState.address, connectWallet, disconnectWallet]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  };
};