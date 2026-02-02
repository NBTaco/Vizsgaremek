import Header from "../header/Header";
import Footer from "../footer/Footer";
import Title from "../title/title";
import { Link } from "react-router-dom";

export default function AdminMain(){
    return(
        <>
        {localStorage.getItem('role') != "admin" && 
            <>
                <h1>Az oldal nem található!</h1>
                <Link to="/">Vissza a főoldalra</Link>
            </>
        }
        {
            localStorage.getItem('role') == "admin" && 
            <>
            <Header/>
            <Title titlemessage="ADMIN OLDAL"/>
            <h1>ADMIN OLDAL</h1>
            <Footer/>
            </>
        }
        </>
    )
}