import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import GetMessage from './components/GetMessage'
import GetMessageNewVersion from './components/GetMessageNewVersion'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <GetMessage />
    </>
  )
}

export default App
