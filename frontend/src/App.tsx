import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import HomeCategories from './components/homecategories/HomeCategories'
import LogIn from './components/login/LogIn'
import { useState, useEffect } from 'react'

import './App.css'

function App() {
  const [showLogin, setShowLogin] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLoginSuccess = (user: any) => {
    setLoggedInUser(user)
    localStorage.setItem("user", JSON.stringify(user)) 
    setShowLogin(false)
  }

  const handleLogout = () => {
    setLoggedInUser(null)
    localStorage.removeItem("user") 
  }

  return (
    <>
      <Header 
        onLoginClick={() => setShowLogin(true)} 
        user={loggedInUser}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <h1 className='welcome'>Üdvözlünk a weboldalon!</h1>
        <HomeCategories />

        {showLogin && (
          <LogIn 
            onClose={() => setShowLogin(false)} 
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </main>

      <Footer />
    </>
  )
}

export default App
