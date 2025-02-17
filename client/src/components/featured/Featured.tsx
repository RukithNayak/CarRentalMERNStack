import './Featured.css'
import meridianImage from './Screenshot 2024-12-20 204141.png'
import fordImage from './ford.jpeg'
import newCamryImage from './camry.png'
import glanzaImage from './Toyota-Glanza.webp'

const Featured = () => {
  return (
    <div className = "featured">
        <div className = "featuredItem">
            <img className = "featuredImg" src = {glanzaImage}/>
            <div className="featuredTitles">
                {/*<h1>Hyundai i20</h1>*/}
                <h2>Hatchback</h2>
            </div>
        </div>
        <div className = "featuredItem">
            <img className = "featuredImg" src = {newCamryImage}/>
            <div className = "featuredTitles">
                {/*<h1>Toyota Camry</h1>*/}
                <h2>Sedan</h2>
            </div>
        </div>
        <div className = "featuredItem">
            <img className = "featuredImg" src = {meridianImage}/>
            <div className = "featuredTitles">
                {/*<h1>Jeep Meridian</h1>*/}
                <h2>SUV</h2>
            </div>
        </div>
    </div>
  )
}

export default Featured