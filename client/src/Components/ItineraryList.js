import { makeStyles, Typography } from "@material-ui/core"
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types'
import Box from '@material-ui/core/Box';
// import List from '@material-ui/core/List';
import React, { useEffect, useState } from "react"
import { FixedSizeList } from 'react-window'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MapMarkerPathIcon from 'mdi-react/MapMarkerPathIcon'

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    root: {
        width: '100%',
        height: 400,
        maxWidth: 300
    },
    listSection: {
        backgroundColor: 'inherit',
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0,
    },
}));

function ItineraryList(props) {
    
    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs" style={{ paddingTop: 0 }}>

            <div className={classes.paper}>
                <MapMarkerPathIcon size = {52} style = {{color:"white"}}/>
                <Typography style={{ color: "white", marginBottom: "5px"}} component="h1" variant="h5">
                    YOUR ITINERARIES
                </Typography>
                <br/>
                <Typography style={{ color: "white", fontSize: "80%" }} component="h1" variant="h7">
                    click on one itinerary to get its informations
                </Typography>
            </div>

            <Box
                component="div"
                border={2}
                mx={0}
                mt={7}
                pt={1}
                pb={1}
                boxShadow={10}
                style={{ textAlign: "center", borderColor: "rgba(0,0,0,0.3)", color: "white", background: "rgba(0,0,0,0.2)" }}
            >

                <FixedSizeList
                    height={400}
                    width={300}
                    itemSize={600}
                    itemCount={1}
                    style={{ position: "relative", margin: "auto" }}
                >
                    {props.renderrow}
                </FixedSizeList>

            </Box>



        </Container>

    )


}


export default ItineraryList