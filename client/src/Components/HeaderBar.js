import React , {useState , useEffect} from "react"
import AppBar from '@material-ui/core/AppBar'
import Button from "@material-ui/core/Button"
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Person from "@material-ui/icons/Person"
import Home from "@material-ui/icons/Home"
import {Link} from "react-router-dom"
import TextField from "@material-ui/core/TextField"
import MapMarkerPathIcon from 'mdi-react/MapMarkerPathIcon'

function HeaderBar(props){

       /*
       const handleClick = e => {
              props.setLogged(e)
       }
       */

       return(
              <AppBar position="static" style = {{color : "white", backgroundColor : "Black"}}>
                     <Toolbar style = {{minHeight : "50px"}}>
                            <Link to={"/"} style={{ textDecoration: 'none'}}>
                                   <Button startIcon={ <Home style = {{color : "white"}}/> } style={{color : "white"}} >
                                          Home
                                   </Button> 
                            </Link>
                            <div style = {{marginLeft : "auto"}}>
                                   {props.logged ? 
                                          <Link to={"/itinerary"} style={{ textDecoration: 'none'}}>
                                                 <Button variant="outlined" style={{color : "white"}} startIcon = {<MapMarkerPathIcon size = {18}/>}>
                                                        Your Itineraries
                                                 </Button>
                                          </Link>
                                   :
                                          null
                                   }
                            </div>
                            <div style={{marginLeft : "auto"}}>
                                   {props.logged ?  
                                   (
                                          <Link to={"/"} onClick = {props.logged ? () => props.setLogged(0) : () => props.setLogged(1)} style={{ textDecoration: 'none'}}>
                                                 <Button color="inherit" startIcon = {<Person/>} style={{color : "white"}}>
                                                        LogOut
                                                 </Button>
                                          </Link>
                                   )
                                          :
                                   (
                                          <Link to={"/login"} onClick = {props.logged ? () => props.setLogged(0) : () => props.setLogged(1)} style={{ textDecoration: 'none'}}>
                                                 <Button color="inherit" startIcon = {<Person/>} style={{color : "white"}}>
                                                        LogIn
                                                 </Button>
                                          </Link>
                                   )
                                   }
                            </div>
                     </Toolbar>
              </AppBar>
       )
}

export default HeaderBar