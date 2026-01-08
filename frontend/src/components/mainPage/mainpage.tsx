import Header from '../header/Header'
import Footer from '../footer/Footer'
import HomeCategories from '../homecategories/HomeCategories'
import LogIn from '../login/LogIn'
import { useState, useEffect } from 'react'
import Registration from '../registration/Registration'

export default function MainPage() {
    const [showLogin, setShowLogin] = useState(false)
    const [loggedInUser, setLoggedInUser] = useState<any>(null)
    const [showRegistration, setShowRegistration] = useState(false)

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

    const handleRegistrationSuccess = (user: any) => {
      setLoggedInUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      setShowRegistration(false);
    }
    
    return (
      <>
        <Header 
          onLoginClick={() => setShowLogin(true)} 
          user={loggedInUser}
          onLogout={handleLogout}
          onRegistrationClick={() => setShowRegistration(true)}
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
          {showRegistration && (
            <Registration
              onClose={() => setShowRegistration(false)}
              onRegistrationSuccess={handleRegistrationSuccess}
            />
          )}
        </main>

        <Footer />
      </>
    )
}