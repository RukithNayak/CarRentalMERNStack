//@ts-nocheck
import { Link } from "react-router-dom";
import "./SearchItem.css";

const SearchItem = ({ item }) => {
  const imageUrl = item.photos && item.photos[0]
    ? `http://localhost:8800/${item.photos[0].replace(/\\/g, "/")}`
    : "https://via.placeholder.com/150"; // Fallback placeholder

  return (
    <div className="searchItem">
      <img src={imageUrl} alt={`${item.name} image`} className="siImg" />
      <div className="siDesc">
        <h1 className="siTitle">{item.name}</h1>
        <span className="siDistance">2024 Model</span>
        <div className="carType">{item.type}</div>
        {/*<span className="siSubtitle">5 seater</span>*/}
        <span className="siFeatures">
          {item.mileage} kmpl {item.fueltype} engine
        </span>
        {/*<div className="siCancelOpSubtitle">Cancellation available</div>*/}
      </div>
      <div className="siDetails">
        <div className="siDetailsTexts">
          <span className="siPrice">₹{item.price}</span>
          <span className="siTaxOp">Includes taxes and fees</span>
          <Link to={`/cars/${item._id}`}>
            <button className="siCheckButton">See availability</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
