import { makeStyles, Typography } from "@material-ui/core"
import Container from '@material-ui/core/Container';
import React, { useState } from "react"
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import Divider from "@material-ui/core/Divider"
import ThermometerIcon from 'mdi-react/ThermometerIcon'
import MeteoCard from "./MeteoCard"



const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(10),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }
}));


function ItineraryInfo(props) {

    const classes = useStyles();
    const [incomingMeteos] = useState(props.clickedItinMeteos);

    // console.log(props.clickedItinMeteos)


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

    function renderCards() {
        return (
            <Grid 
                container 
                direction="row" 
                alignItems="center" 
                justify="center" 
                spacing={3}
            >
                {console.log(incomingMeteos)}
                {incomingMeteos.map(item => (
                    <MeteoCard item={item} />
                ))}
            </Grid>
        )

    }

    return (
        <Container
            display="flex"
            component="main"
            width="70%"
            style={{ paddingTop: 0 }}
        >
            <div className={classes.paper}>
                <Typography style={{ color: "white", marginBottom: "1.5%" }} component="h5" variant="h5">
                    STAGES OF THE ITINERARY "{props.clickedItinName}"
                </Typography>
                <br />
            </div>

            <div>
                {renderCards()}
            </div>

        </Container>
    )
}

export default ItineraryInfo