import  { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const useWalletLogic = () => {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    const [network, setNetwork] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [inputAddress, setInputAddress] = useState("");
  
    
    const checkEthereumProvider = () => {
      return typeof window.ethereum !== 'undefined';
    };
  
    
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setErrorMessage('Please connect to MetaMask.');
        setAccount(null);
        setIsConnected(false);
      } else {
        setAccount(accounts[0]);
        setIsConnected(true);
        setErrorMessage(null);
      }
    };
  
    const getBalance = async () => {
      if (!inputAddress) {
        setErrorMessage("No address provided.");
        return;
      }
  
      try {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [account, 'latest'], 
        });
        const balanceInEther = ethers.formatEther(balance); 
        console.log(balanceInEther);
        setBalance(balanceInEther);
        
      } catch (err) {
        setErrorMessage("Failed to fetch balance. Ensure the address is correct.");
      }
    };
  
  
    const handleChainChanged = async (chainId) => {
      const networkId = parseInt(chainId, 16); 
      setNetwork(networkId);
      setErrorMessage(null);
      console.log(`Network changed to ${networkId}`);
    };
  
  
    const connectWallet = async () => {
      if (!checkEthereumProvider()) {
        setErrorMessage('Ethereum wallet not detected.');
        return;
      } 
  
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        handleAccountsChanged(accounts);
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        handleChainChanged(chainId);
        setInputAddress(accounts)
      } catch (err) {
        if (err.code === 4001) {
          setErrorMessage('User rejected the connection request.');
        } else {
          setErrorMessage(err.message);
        }
      }
    };
  
    useEffect(() => {
      if (checkEthereumProvider()) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
      }
  
      return () => {
        if (checkEthereumProvider()) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }, []);

  return (
    account,
    inputAddress,
    isConnected,
    errorMessage,
    balance,
    network,
    connectWallet,
    getBalance,
    setInputAddress
  );
};

export default useWalletLogic;
