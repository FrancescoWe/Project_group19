import React, { useState, useEffect } from "react"
import Header from "./Header"
import Main from "./Main"
import Footer from "./Footer"
import Box from "@material-ui/core/Box"
import SignIn from "./SignIn"
import HeaderBar from "./HeaderBar"
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import MyParticles from './MyParticles'
import Itinerary from "./Itinerary"
import ItineraryInfo from "./ItineraryInfo"
import SignUp from "./SignUp"


function App() {

  const [user, setLogged] = useState({logged : false,
                                      user_id : ""})
                            
  const [clickedItinMeteos, setClickedItinMeteos] = useState([]);
  const [clickedItinId, setClickedItinId] = useState("");
  const [clickedItinName, setClickedItinName] = useState("");

  const signInDone = (userID) => {
    setLogged({logged : true, 
                user_id : userID})
  }

  const logOut = () => {
    setLogged({logged : false, 
                user_id : ""})
  }
  
  
  console.log("App : " + user.logged + " " + user.user_id)
  
  return (
    <Router>
      <Box 
        component="div"
<<<<<<< HEAD
        className = "body"
=======
>>>>>>> f403f62a61f76978d45eb5359cedef0ea9ec1ae5
      >
        <MyParticles />

          <Switch>
            <Route exact path="/">
              <HeaderBar logged = {user.logged} setLogged = {logOut}/> 
              <Main logged = {user.logged}/>
            </Route>

            <Route exact path="/itinerary">
              <HeaderBar logged = {user.logged} setLogged = {logOut}/>
              <Itinerary 
                user = {user.user_id} 
                setClickedItinMeteos={setClickedItinMeteos} 
                setClickedItinId={setClickedItinId}
                setClickedItinName={setClickedItinName}
              />
            </Route>

            <Route exact path="/myitinerary">
              <HeaderBar logged = {user.logged} setLogged = {logOut}/> 
              <ItineraryInfo 
                user = {user.user_id} 
                clickedItinMeteos={clickedItinMeteos} 
                clickedItinName={clickedItinName}
                clickedItinId={clickedItinId}
              />
            </Route>

            <Route exact path="/signup">
              <HeaderBar logged = {user.logged} setLogged = {logOut}/>
              <SignUp/>
            </Route>

            <Route exact path = "/login">
                <HeaderBar logged = {user.logged} setLogged = {logOut}/>
                <SignIn logged = {user.logged} setLogged = {signInDone} />
            </Route>

            <Route exact path="/logout">
              <HeaderBar logged = {user.logged} setLogged = {logOut}/>
            </Route>

          </Switch>
      </Box>
    </Router>
  );
}

export default App;
