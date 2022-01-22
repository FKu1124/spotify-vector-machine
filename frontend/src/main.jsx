import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './routes/Login'
import ProtectedRoute from './components/ProtectedRoute'


ReactDOM.render(
  // <React.StrictMode>
  //   {/* <BrowserRouter> */}
  //     <App />
  //   {/* </BrowserRouter> */}
  // </React.StrictMode>,
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<ProtectedRoute component={App} />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<ProtectedRoute component={App} />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,

  document.getElementById('root')
)