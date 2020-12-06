import React , { useState, useEffect } from "react"
import Button from "@material-ui/core/Button"
import HeaderBar from "./HeaderBar"
import Particles from 'react-particles-js'
import SignIn from "./SignIn"

import "./App.css"


function App() {

  return (
    <>
        <div>
          <HeaderBar />
        </div>
        <div style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}>
        <Particles 
            params={{
                particles: {
                    number : {
                        value : 50
                    },
                    color : "#888888",
                    line_linked : {
                      enable: true,
                      //distance: 150,
                      color : "#000000",
                      opacity: 0.5,
                      width : 0.5
                    },
                }
            }}
        />
        </div>
        <div>
          <SignIn />
        </div>
    </>
  )
}

export default App;
