import { makeStyles, Typography } from "@material-ui/core"
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types'
import Box from '@material-ui/core/Box';
// import List from '@material-ui/core/List';
import React from "react"
import { FixedSizeList } from 'react-window'
import MapMarkerPathIcon from 'mdi-react/MapMarkerPathIcon'
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(10),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    button: {
        marginTop: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }
}));

//                <Typography style={{ color: "white", fontSize: "80%" }} component="h1" variant="h7">
//                    click on the info button to get the informations about an itinerary
//                </Typography>

function ItineraryList(props) {

    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs" style={{ paddingTop: 0 }}>

            <div className={classes.paper}>
                <MapMarkerPathIcon size={45} style={{ color: "white" }} />
                <Typography style={{ color: "white", marginBottom: "5px" }} component="h5" variant="h5">
                    YOUR ITINERARIES
                </Typography>
                <br />
            </div>

            <Box
                component="div"
                border={2}
                mx={0}
                mt={5}
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
                    {props.renderRow}
                </FixedSizeList>
            </Box>

            <div className={classes.button}>
                <Button
                    className="btn"
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                >
                    Add itinerary
                </Button>
            </div>


        </Container>

    )


}


export default ItineraryList