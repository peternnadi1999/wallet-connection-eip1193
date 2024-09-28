import useWalletLogic from '../hooks/walletLogic';

const WalletConnect = () => {
  
  const {
    account,
    balance,
    network,
    isConnected,
    errorMessage,
    inputAddress,
    handleAccountsChanged,
    getBalance,
    connectWallet,
    checkEthereumProvider,
    setInputAddress,
  } = useWalletLogic();
  

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
