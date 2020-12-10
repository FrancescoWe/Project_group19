import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import "../Css/search.css"
import { TextField, InputBase, withTheme, ThemeProvider, withStyles } from '@material-ui/core';
import { createMuiTheme } from "@material-ui/core/styles"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Link } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from "@material-ui/core/Card"
import { grey } from '@material-ui/core/colors';
import Itinerary from "./Itinerary"
import { Redirect } from "react-router-dom";
import CssTextField from "./CssTextField"

// STYLING

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    palette: {
      primary: {
        main: grey,
        mainGradient: "linear-gradient(to right, #ffffff, #5c5c5c)"
      }
    }
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(2, 0, 2),
    background: "linear-gradient(to right, #ffffff,#5c5c5c)"
  },
  cssLabel: {
    color: "white"
  },
  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: `${theme.palette.primary.main} !important`,
    }
  },
  notchedOutline: {
    borderWidth: '1px',
    borderColor: 'grey !important'
  },
  multilineColor: {
    color: "white"
  },

}));

// COMPONENT
function SignUp() {
  const classes = useStyles();

  // STATO
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPass, setConfPass] = useState("");
  const [isRegistered, setRegistered] = useState(false);

  // GESTIONE EVENTI E "COMPONENT DID MOUNT"
  useEffect(() => {

  }, [])

  function handleChangeMail(event) {
    const { value } = event.target
    setEmail(value);
  }

  function handleChangePsw(event) {
    const { value } = event.target
    setPassword(value);
  }

  function handleChangeConfPass(event){
    const { value } = event.target
    setConfPass(value);
  }

  async function handleClick() {
    if(password.localeCompare(confPass) !== 0 || email.localeCompare("")===0 || password.localeCompare("")===0){

      if(password.localeCompare(confPass) !== 0 )
        window.alert("Password does not match!");

      if (email.localeCompare("")===0) 
        window.alert("E-mail field must not be empty!"); 

      if (password.localeCompare("")===0) 
        window.alert("Password field must not be empty!");
    } else {

      await fetch('/users', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          "email": email,
          "password": password
        })
      }).then((resp) => resp.json())
        .then(function (data) {
          console.log(data);
          if (data.error != null) {
            window.alert(data.error);
            console.log("ERROR");
            return false;
          } else {
            // console.log(data);
            setRegistered(true);
            return true;
          }
        })
        .catch(error => {
          window.alert(error)
          console.error(error)
        });
      return false;
      //console.log("the email is: "+_email);
      //console.log("you clicked sign up");
    }

}


  // GRAFICA
  return (
    <div>
      {isRegistered ? <Redirect to={"/"} /> : 
      <Container component="main" maxWidth="xs" style={{ paddingTop: 85 }}>
        <CssBaseline />
        <div className={classes.paper}>

          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography style={{ color: "white" }} component="h1" variant="h5">
            SIGN UP
          </Typography>

          <form className={classes.form} noValidate>
            <CssTextField
              onChange={handleChangeMail}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              InputProps={{
                className: classes.multilineColor,
                classes: {
                  root: classes.cssOutlinedInput,
                  notchedOutline: classes.notchedOutline
                }
              }}
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel,
                },
              }}
            />
            <CssTextField
              onChange={handleChangePsw}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              InputProps={{
                className: classes.multilineColor,
                classes: {
                  root: classes.cssOutlinedInput,
                  notchedOutline: classes.notchedOutline
                }
              }}
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel,
                },
              }}
            />
            <CssTextField
              onChange={handleChangeConfPass}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirm password"
              label="Confirm password"
              type="password"
              id="password"
              autoComplete="current-password"
              InputProps={{
                className: classes.multilineColor,
                classes: {
                  root: classes.cssOutlinedInput,
                  notchedOutline: classes.notchedOutline
                }
              }}
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel,
                },
              }}
            />

            <Button
              className={classes.submit}
              fullWidth
              variant="contained"
              size="large"
              onClick={handleClick}
            >
              SIGN UP
            </Button> 
            
            <Grid container>
              <Grid
                item
                style={{ margin: "auto" }}
              >
                <Button
                  variant="outlined"
                  style={{ textTransform: "none", borderColor: "#5c5c5c" }}
                >
                  <Link
                    style={{ color: "white" }}
                    to={"/login"}
                    variant="body2"
                  >
                    Already have an account? Sign In
                        </Link>
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>}
    </div>
  )
}


export default SignUp;