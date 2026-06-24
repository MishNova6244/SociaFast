import fondoUTPN from '../assets/principal_utpn.png'
import SFlogo from '../assets/sociafast_logo.png'

function Layout({ children, className = "" }) {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${fondoUTPN})` }}
    >
      <div className={`min-h-screen backdrop-blur-sm bg-black/10 flex flex-col justify-center items-center ${className}`}>
        <img src={SFlogo} alt="Logo SociaFast" className="w-[350px] h-auto mb-2"/>

        {children}

      </div>
    </div>
  )
}

export default Layout