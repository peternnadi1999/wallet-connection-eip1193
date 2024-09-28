import { useState } from 'react'
import WalletConnect from './components/wallet'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <WalletConnect/>
    </>
  )
}

export default App
