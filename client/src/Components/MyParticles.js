import React from "react"
import Particles from 'react-particles-js'

function MyParticles(){
    return (
            <Particles
                params={{
                    particles: {
                        number : {
                            value : 50
                        },
                        color : "#ffffff",
                        line_linked : {
                            enable: true,
                            //distance: 150,
                            color : "#bdbdbd",
                            opacity: 0.5,
                            width : 0.5
                        },
                    }
                }}
            />
    )
}

export default MyParticles