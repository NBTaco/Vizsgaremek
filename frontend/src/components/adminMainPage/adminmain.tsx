import Header from "../header/Header";
import Footer from "../footer/Footer";
import Title from "../title/title";

export default function AdminMain(){
    return(
        <>
        {localStorage.getItem('role') != "admin" && 
            <h1>404</h1>
        }
        {
            localStorage.getItem('role') == "admin" && 
            <>
            <Header/>
            <Title message="admin oldal"/>
            <h1>ADMIN OLDAL</h1>
            <Footer/>
            </>
        }
        </>
    )
}