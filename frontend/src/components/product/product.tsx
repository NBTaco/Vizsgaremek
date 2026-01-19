import "bootstrap/dist/css/bootstrap.min.css"

export default function Product({image, name} : any) {
    return (
        <div className="bg-warning container m-2 w-25 p-2">
                <div className=""><img src={image} alt={name} /> </div> 
                <div className="product-name">{name}</div>
                <div className="watch-button">
                    <button>Megtekintés</button>
                </div>
        </div>
    )
}