import './product.css';
import { useNavigate } from 'react-router-dom';

export default function Product({id, image, name, price} : any) {
    const navigate = useNavigate();

    const handleWatch = () => {
        navigate(`/product/${id}`);
    };

    return (
        <div className="product-card">
            <div className="product-image"><img src={image} alt={name} /> </div> 
            <div className="product-name">{name}</div>
            <div className="product-price">{price} Ft</div>
            <div className="watch-button">
                <button onClick={handleWatch}>Megtekintés</button>
            </div>
        </div>
    )
}