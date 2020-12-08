import React, { useState, useEffect } from "react"
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import Divider from "@material-ui/core/Divider"
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import OpacityIcon from '@material-ui/icons/Opacity'
import ThermometerIcon from 'mdi-react/ThermometerIcon'
import WeatherWindyIcon from 'mdi-react/WeatherWindyIcon'

function Card(props) {

    
    const [data, setData] = useState(props.data)
    const [index,setIndex] = useState(props.num)


    function handleClick(){
        console.log(data)
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
    //console.log(data);
    console.log(data[index].date);
    const date = new Date(data[index].date);


    return (
        <Box
            border={0}
            mt="auto"
            mr="auto"
            mb="auto"
            ml="auto"
            width={250}
            height={300}
            borderRadius={16}
            boxShadow="10"
            onClick={handleClick}
        >
            <Box
                component="div"
                width="100%"
                className="card__inner"
            >
                <Box
                    component="div"
                    className="card__face card__face--front"
                    style = {{
                        backgroundColor : "rgba(255,255,255,0.35)"
                    }}
                >
                    <Grid container direction = "column" alignItems = "center" spacing = {2}>
                        <Grid item>
                                <h3> {date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear()} </h3>
                            <img src={data[index].icon} id="imm_uno" alt="Immagine" className="image__icon" />
                            <h2>{data[index].main}</h2>
                        </Grid>
                        <Divider orientation="horizontal" flexItem/>
                        <Grid item>
                            <Grid container direction = "row" alignItems = "center" spacing = {3}>
                                <Grid item>
                                    <Grid container direction = "column" alignItems = "center" spacing = {1}>
                                        <Grid item>
                                            <ThermometerIcon size = {30}/>
                                            <h3>{data[index].temp + "°"}</h3>
                                        </Grid>
                                        <Grid item >
                                            <p style = {{fontWeight : "bold"}}>
                                                <ArrowDownwardIcon style = {{color: "blue", fontSize : "15px"}}/>
                                                {data[index].temp_Min}
                                                <br/>
                                                <ArrowUpwardIcon style = {{color: "red", fontSize : "15px"}}/>
                                                {data[index].temp_Min}
                                            </p>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Divider orientation="vertical" flexItem/>
                                <Grid item>
                                    <OpacityIcon style = {{ fontSize : "30px"}}/>
                                    <h3>{data[index].humidity + "%"}</h3>
                                </Grid>
                                <Divider orientation="vertical" flexItem/>
                                <Grid item>
                                    <Grid container direction = "column" alignItems = "center" spacing = {1} >
                                        <Grid item>
                                            <div>
                                                <WeatherWindyIcon size = {30} />
                                                <h3>{data[index].wind_speed}</h3>
                                                <h6>km/h</h6>
                                            </div>
                                        </Grid>
                                        <Grid item>
                                            {toTextualDescription(data[index].wind_deg)}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    )
}

export default Card