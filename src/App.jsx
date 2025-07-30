import './App.css'
import Login from './components/login.jsx'
import MovieApp from './components/Movie.jsx'
import MyFooter from './components/Footer.jsx'
import MyNavbar from './components/Navbar.jsx'
import Register from './components/register.jsx'
import SectionHome from './components/section-home.jsx'


function App() {
  
  return (
    <>
      <Register/>

      <Login/>

      <MyNavbar/>
      <MovieApp/>
      <MyFooter/> 


     <MyNavbar/>
     <SectionHome/>
    
    </>
  )
}

export default App
