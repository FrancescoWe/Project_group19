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
    const [incomingSecondData, setSecondData] = useState(props.dataToPassTwo)

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

    function round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }


    return (
        <div>
            <Typography variant = "h5" style={{color : "white" , marginTop : "1%"}}>
                    Current
            </Typography>
            <Divider style = {{background : "rgba(255,255,255,0.15)", marginLeft : "30%", marginRight: "30%", marginBottom : "0.5%"}}/> 

            <Box
                mt="auto"
                mr="auto"
                mb="auto"
                ml="auto"
                width={350}
                height={280}
                borderRadius={16}
                boxShadow="20"
                style = {{
                    backgroundColor : "rgba(255,255,255,0.5)"
                }}
            >
                <Grid container direction="column" justify= "center" alignItems = "center">
                    <Grid item style = {{padding : 0}}>
                        <img src={incomingData.icon} />
                        <h2 style = {{color : "Black", fontSize : "30px"}}>{incomingData.main}</h2>
                    </Grid>
                    <Grid item>
                        <Grid container direction = "row" justify = "center" alignItems = "center" spacing = {6} style = {{marginTop : 0}}>
                            <Grid item>
                                <Grid item >
                                    <Grid container direction = "column" alignItems = "center" spacing = {1}>
                                        <Grid item>
                                            <ThermometerIcon size = {30}/>
                                            <h3>{round(incomingData.temp,1) + "°"}</h3>
                                        </Grid>
                                        <Grid item >
                                                <p style = {{fontWeight : "bold", color:"#008fd6"}}>
                                                    {round(incomingData.temp_Min,1) + "°"}
                                                </p>
                                                <p style = {{fontWeight : "bold", color:"#b30000"}}>
                                                    {round(incomingData.temp_Max,1) + "°"}
                                                </p>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Divider orientation="vertical" style = {{marginBottom : "5%", marginTop: "5%"}} flexItem/>
                            <Grid item>
                                <OpacityIcon style = {{ fontSize : "30px"}}/>
                                <h3>{incomingData.humidity + "%"}</h3>
                            </Grid>
                            <Divider orientation="vertical" style = {{marginBottom : "5%", marginTop: "5%"}} flexItem/>
                            <Grid item>
                                <Grid container direction = "column" alignItems = "center" spacing = {1} >
                                    <Grid item>
                                            <WeatherWindyIcon size = {30} />
                                            <h3>{round(incomingData.wind_speed,1)}</h3>
                                            <h6>km/h</h6>
                                    </Grid>
                                    <Grid item>
                                        {toTextualDescription(incomingData.wind_deg)}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Divider orientation="vertical" style = {{marginBottom : "5%", marginTop: "5%"}} flexItem/>
                            <Grid item>
                                <SunglassesIcon size = {30} />
                                <br/>
                                <h3>{incomingData.uvi}</h3>
                                <p style={{fontWeight : "bold"}}>UV</p>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

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