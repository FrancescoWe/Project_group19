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


}

export default Container