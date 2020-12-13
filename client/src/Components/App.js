import React, { useState, useEffect } from "react"
import Main from "./Main"
import Box from "@material-ui/core/Box"
import SignIn from "./SignIn"
import HeaderBar from "./HeaderBar"
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import MyParticles from './MyParticles'
import Itinerary from "./Itinerary"
import ItineraryInfo from "./ItineraryInfo"
import SignUp from "./SignUp"
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';



function App() {


  const [user, setLogged] = useState({logged : false,
                                      user_id : "",
                                      snackBarOpensLoginControl : false,
                                      snackBarOpensLogOutControl : false,
                                      snackBarOpensSignUpControl : false})
  
  const [clickedItinMeteos, setClickedItinMeteos] = useState([]);
  const [clickedItinId, setClickedItinId] = useState("");
  const [clickedItinName, setClickedItinName] = useState("");

    useEffect(() => {
      console.log(user.user_id)
      if(user.user_id == ""){
        checkToken()
      }
    },[])

  const signInDone = (userID) => {
    setLogged({logged : true,//checkToken()
              user_id : userID,
              snackBarOpensLoginControl : true,
              snackBarOpensLogOutControl : false,
              snackBarOpensSignUpControl : false})
  }

  const signUpDone = () => {
    setLogged({logged : false, 
              user_id : "",
              snackBarOpensLoginControl : false,
              snackBarOpensLogOutControl : false,
              snackBarOpensSignUpControl : true})
  }



  const logOut = (val) => {       //se il valore passato è 0 l' utente si slogga altrimenti si logga (necessario solo per l' alert)
    localStorage.setItem('token',"");
    val==0 ? 
      setLogged({logged : false, 
                user_id : "",
                snackBarOpensLoginControl : false,
                snackBarOpensLogOutControl : true,
                snackBarOpensSignUpControl : false})
    :
      setLogged({logged : false, 
                user_id : "",
                snackBarOpensLoginControl : false,
                snackBarOpensLogOutControl : false,
                snackBarOpensSignUpControl : false})
  }
  
  async function validToken(token){
    await fetch("/api/provaVerifica", {
      headers: {
        'auth-token' : token
    },
      method : "GET"
    })
      .then((resp) => resp.json())
      .then(function(data) {
        if (data.error != null) {
          alert("ERROR," + "\n" + data.error);
          console.log("ERROR");
          return false
        } else { 
          setLogged({logged : true,
                    user_id : data._id,
                    snackBarOpensLoginControl : false,
                    snackBarOpensLogOutControl : false,
                    snackBarOpensSignUpControl : false})
          //localStorage.setItem('user-id', data._id);
          return true
        } 
      })
        .catch(error => console.error(error));
      return false
  }
  
  async function checkToken(){
    console.log("sto controllando il token")
    var token= localStorage.getItem("token");
    console.log(token)
    if(token!=null)
      await validToken(token)
  }

  console.log("App : " + user.logged + " " + user.user_id)
  console.log("Bar Status login : " + user.snackBarOpensLoginControl)
  console.log("Bar Status logOut : " + user.snackBarOpensLogOutControl)
  console.log("Bar Status SignUp : " + user.snackBarOpensSignUpControl)
  
  return (
    <Router>
      <Box 
        component="div"
      >
        <MyParticles />

          <Switch>
            <Route exact path="/">
              <HeaderBar logged = {user.logged} setLogged = {logOut}/> 

              <Snackbar
                  style = {{marginTop : "37px", marginRight : "6px"}}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}

                  open={user.snackBarOpensLogOutControl}
                  autoHideDuration={850}
                  onClose={() => setLogged({logged : false, 
                                      user_id : "",
                                      snackBarOpensLoginControl : false,
                                      snackBarOpensLogOutControl : false,
                                      snackBarOpensSignUpControl : false})}
              >
                <MuiAlert elevation={6} variant="filled" severity="success">
                  User logged out.
                </MuiAlert>
              </Snackbar>

              <Snackbar
                  style = {{marginTop : "37px", marginRight : "6px"}}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}

                  open={user.snackBarOpensLoginControl}
                  autoHideDuration={850}
                  onClose={() => setLogged({logged : user.logged, 
                                      user_id : user.user_id,
                                      snackBarOpensLoginControl : false,
                                      snackBarOpensLogOutControl : false,
                                      snackBarOpensSignUpControl : false})}
              >
                <MuiAlert elevation={6} variant="filled" severity="success">
                  User logged in.
                </MuiAlert>
              </Snackbar>

              <Snackbar
                  style = {{marginTop : "37px", marginRight : "6px"}}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}

                  open={user.snackBarOpensSignUpControl}
                  autoHideDuration={850}
                  onClose={() => setLogged({logged : user.logged, 
                                      user_id : user.user_id,
                                      snackBarOpensLoginControl : false,
                                      snackBarOpensLogOutControl : false,
                                      snackBarOpensSignUpControl : false})}
              >
                <MuiAlert elevation={6} variant="filled" severity="success">
                  User signed up.
                </MuiAlert>
              </Snackbar>
              
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
              <SignUp setSignedUp = {signUpDone}/>
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
