import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import HomeCategories from './components/homecategories/HomeCategories'
{/* import LogIn from './components/login/LogIn'  */}
{/* import Registration from './components/registration/Registration' */}

import './App.css'

function App() {
  return (
    <>
      <Header />
      <main className="main-content">
        <h1 className='welcome'>Üdvözlünk a weboldalon!</h1>
        <HomeCategories />
        {/* <LogIn /> */}
        {/*<Registration />*/} 
      </main>
      <Footer />
    </>
  )
}

export default App
