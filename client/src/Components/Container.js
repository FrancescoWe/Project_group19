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
import CurrentCard from "./CurrentCard"


function Container(props) {

    //console.log(props.dataToPass)

    const [incomingData, setData] = useState(props.dataToPass);
    const [incomingSecondData, setSecondData] = useState(props.dataToPassTwo)

    const paperstyles = {
        backgroundColor : "rgba(255,255,255,0.45)",
        margin : "auto"
    }

    const textStyle = {
        color : "white"
    }

    return (
        <div>
            <Typography variant = "h5" style={{color : "white" , marginTop : "1%"}}>
                    Current
            </Typography>
            <Divider style = {{background : "rgba(255,255,255,0.15)", marginLeft : "30%", marginRight: "30%", marginBottom : "0.5%"}}/> 
            
            <CurrentCard incomingData = {incomingData} />
            
            <Typography variant = "h5" style={{color : "white", marginTop : "1%"}}>
                Forecast
            </Typography>
            <Divider style = {{background : "rgba(255,255,255,0.15)", marginLeft : "13%", marginRight: "13%", marginBottom : "0.5%"}}/>

            <Box
                component="div"
                display="flex"
                mx={0}
                mt={0}
                pt={0}
                pb={0}
            >
                <Card num="0" data = {incomingSecondData} />
                <Card num="1" data = {incomingSecondData}/>
                <Card num="2" data = {incomingSecondData}/>
                <Card num="3" data = {incomingSecondData}/>
                <Card num="4" data = {incomingSecondData}/>
            </Box>
        </div>
    )

    /*

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
    */


}

export default Container