import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Auth from './pages/Auth'
import Home from './pages/Home'
import { useEffect } from 'react'
import axios from 'axios'

function App() {

  useEffect(() => {
    axios.get('/api/auth/user', { withCredentials: true }).then((res) => {
      console.log(res);
      // return res.data
      localStorage.setItem('user', JSON.stringify(res.data))
    }).catch((err) => {
      console.log(err);
    })
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/dash' element={<Home />}></Route>
        <Route path='/' element={<Auth />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
