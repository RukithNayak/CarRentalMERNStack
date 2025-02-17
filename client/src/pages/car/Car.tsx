//@ts-nocheck
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Navbar from "../../components/navbar/Navbar";
import "./Car.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import Reserve from "../../components/reserve/Reserve";

const Car = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [openModal, setOpenModal] = useState(false);
  const { data, loading, error } = useFetch(`http://localhost:8800/api/cars/find/${id}`);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { dates } = useContext(SearchContext);

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }

  const days = dayDifference(dates[0].endDate, dates[0].startDate);

  const handleClick = () => {
    if (user) {
      setOpenModal(true);
    } else {
      navigate("/login");
    }
  };

  return (
    <div>
      <Navbar />
      <Header type="list" />
      {loading ? (
        "loading"
      ) : (
        <div className="carContainer">
          <div className="carWrapper">
            <button className="bookNow" onClick={handleClick}>Reserve or Book Now!</button>
            <h1 className="carTitle">{data.name}</h1>
            <div className="carModel">
              <span>
                {data.name || "Model not available"}
              </span>
            </div>
            <div className="carImages">
              {data.photos?.map((photo, index) => {
                const imageUrl = `http://localhost:8800/${photo.replace(/\\/g, '/')}`;
                console.log("Image URL:", imageUrl);

                return (
                  <div className="carImgWrapper" key={index}>
                    <img
                      src={imageUrl}
                      alt={`Car Image ${index + 1}`}
                      className="carImg"
                    />
                  </div>
                );
              })}
            </div>

            <div className="carDetails">
              <div className="carDetailsTexts">
                <h1 className="carDetailsTitle">Perfect for city-driving</h1>
                <p className="carDesc">
                  {data.desc}
                </p>
              </div>
              <div className="carDetailsPrice">
                <h1>Your journey awaits you!</h1>
                <h2>
                  <b>₹{days * data.price}</b>
                  ({days} days)
                </h2>
                <button onClick={handleClick}>Reserve or Book Now!</button>
              </div>
            </div>
          </div>
          {/*<MailList />*/}
          {/*<Footer />*/}
        </div>
      )}
      {openModal && <Reserve setOpen={setOpenModal} carId={id} />}
    </div>
  );
};

export default Car;
