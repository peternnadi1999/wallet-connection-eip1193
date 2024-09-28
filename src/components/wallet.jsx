import useWalletLogic from './walletLogic';
import  { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const WalletConnect = () => {
  
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
    <div className="w-1/2 mt-12 flex flex-col items-center m-auto shadow-lg rounded-md bg-gray-100 p-5 font-mono space-y-4">
      <h1 className='text-lg text-black font-mono'>Connect to Ethereum Wallet</h1>
      {isConnected ? (
        <div className="mt-5">
          <p className='p-6 mt-2 text-green-600 bg-green-500/10 border-l-2 text-sm rounded border-green-700'><strong>Connected Account:</strong> {account}</p>
          <p className="p-6 mt-2 text-green-600 bg-green-500/10 border-l-2 text-sm rounded border-green-700">
            <strong>Connected to Network:</strong> {network ? network : 'Loading...'}
          </p>

          <div className='border-2 mt-5 flex p-5 space-x-2 rounded-md'>
            <input
              type="text"
              value={inputAddress}  
              onChange={(e) => setInputAddress(e.target.value)}  
              className='py-1 px-2 text-green-600 border rounded-md bg-slate-50 w-3/5'
              placeholder="Enter Ethereum address"
            />
            <button
              className='outline-none text-white w-1/3 rounded-md cursor-pointer bg-green-600 py-1 px-4'
              onClick={getBalance}
            >
              Check Balance
            </button>
          </div>

          {balance ? (
            <p className="p-6 mt-2 text-green-600 bg-green-500/10 border-l-2 text-sm rounded border-green-700">
              <strong>Balance:</strong> {balance} ETH
            </p>
          ) : ""}
          

        </div>
      ) : (
        <button className='outline-none text-white rounded-md cursor-pointer bg-green-600 py-1 px-4' onClick={connectWallet}>Connect Wallet</button>
      )}
      {errorMessage && <p className="p-6 mt-2 text-red-600 bg-red-500/10 border-l-2 text-sm rounded border-red-700">{errorMessage}</p>}
    </div>
  );
};

export default WalletConnect;
