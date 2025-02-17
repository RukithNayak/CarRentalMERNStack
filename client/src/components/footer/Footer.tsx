import './Footer.css'

const Footer = () => {
  return (
    <div className = "footer">
        <div className="fLists">
            <ul className="fList">
                <li className="fListItem">Deals</li>
                <li className="fListItem">Contact Us</li>
                <li className="fListItem">FAQs</li>
                <li className="fListItem">Terms & Conditions</li>
                <li className="fListItem">Privacy Policy</li>
            </ul>
        </div>
        <div className="fText">Copyright © 2024 EasyRentals.</div>
    </div>
  )
}

export default Footer