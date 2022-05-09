import { useState } from 'react'
import Rotas from './routes'
import GlobalStyle from "./styles/global"
function App() {
  const urlApi="https://api.github.com"
  return (
  <>
    <GlobalStyle />
   <Rotas />
  </>
  )
}

export default App
