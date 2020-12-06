import React, { useEffect, useState } from "react"
import Card from "./Card"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import Divider from "@material-ui/core/Divider"
import PriorityHighIcon from '@material-ui/icons/PriorityHigh'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import OpacityIcon from '@material-ui/icons/Opacity'
import ThermometerIcon from 'mdi-react/ThermometerIcon'
import WeatherWindyIcon from 'mdi-react/WeatherWindyIcon'
import SunglassesIcon from 'mdi-react/SunglassesIcon'


function Container(props) {

    //console.log(props.dataToPass)

    const [incomingData, setData] = useState(props.dataToPass);

    const paperstyles = {
        backgroundColor : "rgba(255,255,255,0.45)",
        margin : "auto"
    }

    const textStyle = {
        color : "white"
    }

    function  toTextualDescription(degree){
        if (degree>337.5) 
            return 'N'
        if (degree>292.5) 
            return 'NW'
        if (degree>247.5) 
            return 'W'
        if (degree>202.5) 
            return 'SW'
        if (degree>157.5) 
            return 'S'
        if (degree>122.5) 
            return 'SE'
        if (degree>67.5) 
            return 'E'
        if (degree>22.5) 
            return 'NE'
        return 'N';
    }


    return (
        <div>
            <Box
                mx={0}
                mt={15}
                pt={0}
                pb={0}
                width = "50%"
                style = {{
                    position: 'relative', 
                    left: '50%', 
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
            >
                    <Grid container direction="row" alignContent="center" alignItems="center" spacing = {2}>
                        <Grid item>
                            <Paper elevation = {10} style = {paperstyles}>
                                <img src={"http://openweathermap.org/img/wn/" + incomingData.current.weather[0].icon + "@2x.png"} alt={incomingData.daily[0].weather[0].main} />
                                <h1>{incomingData.current.weather[0].main}</h1>
                            </Paper>
                        </Grid>
                        <Grid item>
                            <Paper elevation = {4} style = {paperstyles}>
                                <ThermometerIcon size = {37}/>
                                <h2>{incomingData.current.temp + "°"}</h2>
                                <br />
                                <p>
                                    <ArrowDownwardIcon style = {{color: "blue", fontSize : "15px"}}/>
                                    {incomingData.daily[0].temp.min}
                                    <br/>
                                    <ArrowUpwardIcon style = {{color: "red", fontSize : "15px"}}/>
                                    {incomingData.daily[0].temp.max}
                                </p>
                            </Paper>
                        </Grid>
                        <Grid item>
                            <Paper elevation = {4} style = {paperstyles}>
                                <OpacityIcon style = {{color: "lightblue", fontSize : "37px"}}/>
                                <h2>{incomingData.current.humidity + "%"}</h2>
                                <br/>
                                <h4>Feels like</h4>
                                <h3 style = {{color: "lightblue"}}>{incomingData.current.feels_like + "°"}</h3>
                            </Paper>
                        </Grid>
                        <Grid item>
                            <Paper elevation = {4} style = {paperstyles}>
                                <WeatherWindyIcon size = {37} />
                                <h2>{incomingData.current.wind_speed}</h2>
                                <h4>km/h</h4>
                                <br/>
                                {" " + toTextualDescription(incomingData.current.wind_deg) + " "}
                            </Paper>
                        </Grid>
                        <Grid item>
                            <Paper elevation = {4} style = {paperstyles}>
                                <SunglassesIcon size = {37}/>
                                <h2>{incomingData.current.uvi}</h2>
                                <h4>UV</h4>
                            </Paper>
                        </Grid>
                    </Grid>
            </Box>
            <Box
                component="div"
                display="flex"
                mx={0}
                mt={0}
                pt={0}
                pb={0}
            >
                <Card num="1" data = {incomingData} />
                <Card num="2" data = {incomingData}/>
                <Card num="3" data = {incomingData}/>
                <Card num="4" data = {incomingData}/>
                <Card num="5" data = {incomingData}/>
            </Box>
        </div>
    )

}

export default Container