import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Box from "@material-ui/core/Box"
import Form from "./Form"
import HeaderBar from "./HeaderBar"
import Itinerary from "./Itinerary"
import ItineraryInfo from "./ItineraryInfo"
import MuiAlert from '@material-ui/lab/Alert';
import MyAccount from "./MyAccount"
import MyParticles from './MyParticles'
import React, { useState } from "react"
import SignIn from "./SignIn"
import SignUp from "./SignUp"
import Snackbar from '@material-ui/core/Snackbar';


function App() {

  const [objectUser, setObjectUser] = useState({})
  const [user, setLogged] = useState({logged : false,
                                      user_id : "",
                                      snackBarOpensLoginControl : false,
                                      snackBarOpensLogOutControl : false,
                                      snackBarOpensSignUpControl : false})
  const [clickedItinMeteos, setClickedItinMeteos] = useState([]);
  const [clickedItinId, setClickedItinId] = useState("");
  const [clickedItinName, setClickedItinName] = useState("");

  const signInDone = (userID) => {
    setLogged({logged : true, 
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
  
  /*async function validToken(token){
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
          return false;
        } else { 
          setLogged({logged: true,
            user_id: data._id});
          //localStorage.setItem('user-id', data._id);
          return true
        } 
      })
        .catch(error => console.error(error));
      return false;
  }
  
  async function checkToken(){
    var token= localStorage.getItem("token");
    if(token!=null && await validToken(token)==true){
      console.log("user logged is:" + user.user_id);
      return true;
    }else{
      return false;
    }
  }*/

  console.log("User: " + objectUser.email)

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
              
              <Form logged = {user.logged}/>
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

            { /*NYMO */ console.log("")}
            <Route exact path="/myaccount">
              <HeaderBar logged = {user.logged} setLogged = {logOut}/> 
              <MyAccount user = {objectUser} setLogged = {logOut} />
            </Route>

            <Route exact path="/signup">
              <HeaderBar logged = {user.logged} setLogged = {logOut}/>
              <SignUp setSignedUp = {signUpDone}/>
            </Route>

            <Route exact path = "/login">
                <HeaderBar logged = {user.logged} setLogged = {logOut}/>
                <SignIn logged = {user.logged} setLogged = {signInDone} setObjectUser={setObjectUser} />
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
