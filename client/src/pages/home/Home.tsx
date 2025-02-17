//@ts-nocheck
import Featured from '../../components/featured/Featured';
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import MailList from '../../components/mailList/MailList';
import Navbar from '../../components/navbar/Navbar';
import './Home.css'

const Home = () => {
  return (
    <div className = "bg">
      <Navbar/>
      <Header/>
      <div className="homeContainer">
        <Featured/>
        {/*<MailList/>
        <Footer/>*/}
      </div>
    </div>
  )
}

export default Home