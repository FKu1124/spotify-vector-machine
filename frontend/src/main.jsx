import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Login from './routes/Login'
import ProtectedRoute from './components/ProtectedRoute'
import { ChakraProvider } from '@chakra-ui/react'
import Presentation from './components/Presentation'


// import { TransitionGroup, CSSTransition } from 'react-transition-group'
// const AnimatedSwitch = () => {
//   const location = useLocation();
//   const [transitionName, setTransitionName] = useState("next");
//   return (
//     <TransitionGroup>
//       <CSSTransition
//         key={location.name}
//         className={transitionName}
//         timeout={3000}
//       >
//         <Routes location={location}>
//           <Route path="/home" element={<ProtectedRoute component={App} />} />
//           <Route path="login" element={<Login />} />
//           <Route path="*" element={<ProtectedRoute component={App} />} />
//           <Route path="/presentation" element={<Presentation />} />
//         </Routes>
//       </CSSTransition>
//     </TransitionGroup>
//   )
// }


ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        {/* <AnimatedSwitch /> */}
        <Routes location={location}>
          <Route path="/home" element={<ProtectedRoute component={App} />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<ProtectedRoute component={App} />} />
          <Route path="/presentation" element={<Presentation />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,

  document.getElementById('root')
)