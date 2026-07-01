import fondoUTPN from '../assets/principal_utpn.png'
import SFlogo from '../assets/sociafast_logo.png'

function Layout({ children, className = "" }) {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${fondoUTPN})` }}
    >
      <div className={`min-h-screen backdrop-blur-sm bg-black/10 flex flex-col justify-center items-center px-4 ${className}`}>
        <img src={SFlogo} alt="Logo SociaFast" className="w-52 sm:w-64 md:w-80 lg:w-[350px] h-auto mb-4"/>

      <div className="w-full max-w-md">  
        {children}
      </div>

      </div>
    </div>
  )
}

export default Layout