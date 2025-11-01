import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Light from './components/light.jsx'

function App() {

  return (
    <>
      <div className='App'>
        <h1>Control de luces</h1>
        <Light/>
      </div>
    </>
  )
}

export default App
