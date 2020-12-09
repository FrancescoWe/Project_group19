import { makeStyles, Typography } from "@material-ui/core"
import Container from '@material-ui/core/Container';
import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import {Link} from "react-router-dom"
import MeteoCard from "./MeteoCard"
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';




const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }
}));


function ItineraryInfo(props) {

    const classes = useStyles();
    const [incomingMeteos] = useState(props.clickedItinMeteos);
    const[openPopUp, setOpenPopUp] = useState(false);
    const [clickedMeteoComp, setClickedMeteoComp] = useState("");

    // console.log(props.clickedItinMeteos)
    console.log(incomingMeteos);

    function handleCancel(){
        setOpenPopUp(false);
    }

    function handleClickDel(event){
        console.log(event.target)
        setClickedMeteoComp(event.target.id)
    }

    async function handleDelete(){

        console.log(props.item._id);
        await fetch('/itineraries', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'DELETE', 
            body: JSON.stringify({
                "user_id": props.user,
                "itinerary_id": props.item._id
            })
        }).then((resp) => resp.json())
        .then(function (data) {
            console.log(data)
        })
        .catch(error => console.error(error));
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
                {incomingMeteos.map(item => (
                    <MeteoCard 
                        key={item._id} 
                        item={item} 
                        handleDelete={handleDelete} 
                        handleClickDel={handleClickDel} 
                    />
                ))}
            </Grid>
        )

    }


    return (
        <div>
            <Link to={"/itinerary"} style={{ textDecoration: 'none'}}>
            <Button
                className="btn"
                variant="contained"
                size="small"
                startIcon={<KeyboardBackspaceIcon />}
                style={{marginTop: "0.5%", 
                    marginLeft:"0.5%", 
                    width: "5%", 
                    height:"1%"
                }}
            >
                Back
            </Button>
            </Link>
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

                {renderCards()}

            </Container>
        </div>
    )
}

export default ItineraryInfo