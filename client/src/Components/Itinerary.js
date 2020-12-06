import { makeStyles, Typography } from "@material-ui/core"
import Container from '@material-ui/core/Container';
import React, { useEffect, useState } from "react"

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }
}));

function Itinerary(props) {

    const classes = useStyles();

    const [itinData, setItinData] = useState({})

    async function fetching() {
        await fetch('/itineraries/' + props.user, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'GET'
        }).then((resp) => resp.json())
            .then(function (data) {
                console.log(data)
            })
            .catch(error => console.error(error))

    }

    useEffect(() => {
        fetching();
    }, [])


    return (
        <Container component="main" maxWidth="xs" style={{ paddingTop: 70 }}>
            <div className={classes.paper}>
                <Typography style={{ color: "white" }} component="h1" variant="h5">
                    I TUOI ITINERARI
                </Typography>
            </div>

            <div>{ }</div>



        </Container>
    )
}
export default Itinerary