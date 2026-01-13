import Header from '../header/Header'
import Footer from '../footer/Footer'
import HomeCategories from '../homecategories/HomeCategories'

export default function MainPage() {

    return (
      <>
        <Header />
        <main className="main-content">
          <h1 className='welcome'>Üdvözlünk a weboldalon!</h1>
          <HomeCategories />
        </main>
        <Footer />
      </>
    )
}