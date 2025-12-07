import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import HomeCategories from './components/homecategories/HomeCategories'
 import LogIn from './components/login/LogIn'  
{/* import Registration from './components/registration/Registration' */}
import  { useState } from 'react'

import './App.css'

function App() {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      <Header onLoginClick={() => setShowLogin(true)} />
      <main className="main-content">
        <h1 className='welcome'>Üdvözlünk a weboldalon!</h1>
        <HomeCategories />
        {showLogin && <LogIn onClose={() => setShowLogin(false)} />}
        {/*<Registration />*/} 
      </main>
      <Footer />
    </>
  )
}

export default App
