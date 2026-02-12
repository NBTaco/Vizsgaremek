import './product.css';

export default function Product({image, name, price} : any) {
    return (
        <div className="product-card">
                <div className="product-image"><img src={image} alt={name} /> </div> 
                <div className="product-name">{name}</div>
                <div className="product-price">{price} Ft</div>
                <div className="watch-button">
                    <button>Megtekintés</button>
                </div>
        </div>
    )
}