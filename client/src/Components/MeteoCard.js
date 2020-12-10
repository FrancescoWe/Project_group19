import React, { useState } from "react"
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import Divider from "@material-ui/core/Divider"
import IconButton from "@material-ui/core/IconButton"
import ThermometerIcon from 'mdi-react/ThermometerIcon'
import OpacityIcon from '@material-ui/icons/Opacity'
import WeatherWindyIcon from 'mdi-react/WeatherWindyIcon'
import DeleteIcon from 'mdi-react/DeleteIcon'


function MeteoCard(props) {

    const [clicked] = useState(props.item._id);

    function round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }


    function toTextualDescription(degree) {
        if (degree > 337.5)
            return 'N'
        if (degree > 292.5)
            return 'NW'
        if (degree > 247.5)
            return 'W'
        if (degree > 202.5)
            return 'SW'
        if (degree > 157.5)
            return 'S'
        if (degree > 122.5)
            return 'SE'
        if (degree > 67.5)
            return 'E'
        if (degree > 22.5)
            return 'NE'
        return 'N';
    }


    const date = new Date(props.item.date * 1000);


    function handleClickDel(event) {
        // console.log(clicked)
        props.setClickedMeteoComp(clicked)
        props.handleClickDel();
    }

    return (
        <Grid item>
            <Box
                mt="auto"
                mr="auto"
                mb="auto"
                ml="auto"
                width={250}
                borderRadius={16}
                boxShadow="20"
                style={{
                    backgroundColor: "rgba(255,255,255,0.5)"
                }}
            >
                <Grid 
                    container 
                    direction="column" 
                    alignItems="center" 
                    justify="center" 
                    spacing={1}
                >
                    <Grid item>
                        <h1 style={{ color: "Black", fontSize: "27px", marginBottom: "3px", textAlign: "center"}}> 
                            {props.item.cityName} 
                        </h1>
                        <h3 style={{ textAlign: "center", marginBottom: "6px" }}> 
                            {date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()} 
                        </h3>
                        <img 
                            src={"http://openweathermap.org/img/wn/" + props.item.icon + ".png"} 
                            style={{marginLeft:"auto", marginRight:"auto", display:"block"}}>
                        
                        </img>
                        <h2 style={{ color: "Black", fontSize: "25px", textAlign: "center" }}>
                            {props.item.main}
                        </h2>
                    </Grid>
                    <Divider orientation="horizontal" flexItem />
                    <Grid item>
                        <Grid 
                            container 
                            direction="row" 
                            alignItems="center" 
                            spacing={5}
                        >
                            <Grid item>
                                <Grid 
                                    container 
                                    direction="column" 
                                    alignItems="center" 
                                    spacing={1}
                                >
                                    <Grid item>
                                        <ThermometerIcon size={30} />
                                        <h3>{round(props.item.temp, 1) + "°"}</h3>
                                    </Grid>
                                    <Grid item >
                                        <p style={{ fontWeight: "bold", color: "#008fd6" }}>
                                            {round(props.item.temp_Min, 1) + "°"}
                                        </p>
                                        <p style={{ fontWeight: "bold", color: "rgba(140,0,0,0.8" }}>
                                            {round(props.item.temp_Max, 1) + "°"}
                                        </p>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Divider 
                                orientation="vertical" 
                                style={{ marginBottom: "5%", marginTop: "5%" }} 
                                flexItem 
                            />
                            <Grid item>
                                <OpacityIcon style={{ fontSize: "30px" }} />
                                <h3>{props.item.humidity + "%"}</h3>
                            </Grid>
                            <Divider 
                                orientation="vertical" 
                                style={{ marginBottom: "5%", marginTop: "5%" }} 
                                flexItem 
                            />
                            <Grid item>
                                <Grid 
                                    container 
                                    direction="column" 
                                    alignItems="center" 
                                    spacing={1} 
                                >
                                    <Grid item>
                                        <div>
                                            <WeatherWindyIcon size={30} />
                                            <h3>{round(props.item.wind_speed, 1)}</h3>
                                            <h6>km/h</h6>
                                        </div>
                                    </Grid>
                                    <Grid item>
                                        {toTextualDescription(props.item.wind_deg)}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <div style={{textAlign: "center"}}>
                        <IconButton
                            onClick={handleClickDel}
                        >
                            <DeleteIcon style={{ pointerEvents: "none" }} />
                        </IconButton>
                    </div>
                </Grid>
            </Box>
        </Grid>
    )
}

export default MeteoCard


