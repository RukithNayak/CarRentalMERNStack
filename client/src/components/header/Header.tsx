//@ts-nocheck
import { faCalendarDays, faCar, faPerson } from "@fortawesome/free-solid-svg-icons"
import "./Header.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { DateRange } from 'react-date-range';
import { useContext, useState } from "react";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {format} from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";

const Header = ({type}) => {
  const [openDate, setOpenDate] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [options, setOptions] = useState({
    adults: 1,
    children: 1,
  })
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  

  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return{
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  const { dispatch } = useContext(SearchContext);

  const handleSearch = () => {
    dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options }});
    navigate("/cars", {state: {destination, dates, options}})
  }
  return (
    <div className="header">
      <div className={type === "list" ? "headerContainer listMode" : "headerContainer"}>
        {type !== "list" && <><h1 className="headerTitle">Rent.Ride.Relax</h1>
        <p className="headerDesc">Rent for cheap.</p>
        <Link to = '/register' style={{ color: "inherit", textDecoration: "none" }}>
        {!user && (<button className="headerBtn">Click here to sign up</button>)}
        </Link>
        <div className="headerSearch">
          <div className="headerSearchItem">
            <FontAwesomeIcon icon={faCar} className = "headerIcon"/>
            <input type = "text" placeholder = "Where are you going?" className = "headerSearchInput" onChange = {(e) => setDestination(e.target.value)}/>
          </div>
          <div className="headerSearchItem">
            <FontAwesomeIcon icon={faCalendarDays} className = "headerIcon"/>
            <span onClick = {() => setOpenDate(!openDate)} className = "headerSearchText">{`${format(dates[0].startDate, "dd/MM/yyyy")} to ${format(dates[0].endDate, "dd/MM/yyyy")}`}</span>
            {openDate && <DateRange editableDateInputs={true} onChange={item => setDates([item.selection])} moveRangeOnFirstSelection={false} ranges={dates} className = "date" minDate = {new Date()}/>}
          </div>
          <div className="headerSearchItem">
            <FontAwesomeIcon icon={faPerson} className = "headerIcon"/>
            <span onClick = {() => setOpenOptions(!openOptions)} className = "headerSearchText">{`${options.adults} adult ${options.children} child`}</span>
            {openOptions && <div className="options">
              <div className="optionItem">
                <span className="optionText">Adult</span>
                <div className="optionCounter">
                  <button disabled = {options.adults <= 1} className="optionCounterButton" onClick = {() => handleOption("adults", "d")}>-</button>
                  <span className="optionCounterNumber">{options.adults}</span>
                  <button className="optionCounterButton" onClick = {() => handleOption("adults", "i")}>+</button>
                </div>
              </div>
              <div className="optionItem">
                <span className="optionText">Children</span>
                <div className="optionCounter">
                  <button disabled = {options.children <= 0} className="optionCounterButton" onClick = {() => handleOption("children", "d")}>-</button>
                  <span className="optionCounterNumber">{options.children}</span>
                  <button className="optionCounterButton" onClick = {() => handleOption("children", "i")}>+</button>
                </div>
              </div>
            </div>}
          </div>
          <div className="headerSearchItem">
            <button className="headerBtn" onClick = {handleSearch}>Search</button>
          </div>
        </div></>}
      </div>
    </div>
  ) 
}

export default Header