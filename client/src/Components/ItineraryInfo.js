import { makeStyles, Typography } from "@material-ui/core"
import Container from '@material-ui/core/Container';
import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import { Link } from "react-router-dom"
import MeteoCard from "./MeteoCard"
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';




const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    root: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
        alignItems: "center",
        justifyContent: "center"
    },
}));


function ItineraryInfo(props) {

    const classes = useStyles();
    const [incomingMeteos, setIncomingMeteos] = useState(props.clickedItinMeteos);
    const [openPopUp, setOpenPopUp] = useState(false);
    const [clickedMeteoComp, setClickedMeteoComp] = useState("");
    const [loading, setLoading] = useState(false);

    // console.log(props.clickedItinMeteos)
    console.log(incomingMeteos);

    function handleCancel() {
        setOpenPopUp(false);
    }

    function handleCancelDel() {
        setOpenPopUp(false);
    }

    function handleClickDel(event) {
        setOpenPopUp(true);
        console.log(clickedMeteoComp);
    }

    async function handleDelete() {
        // console.log(props.clickedItinId)
        // console.log(clickedMeteoComp)
        setLoading(true);
        await fetch('/meteoComponents', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'DELETE',
            body: JSON.stringify({
                "user_id": props.user,
                "itinerary_id": props.clickedItinId,
                "meteo_id": clickedMeteoComp
            })
        }).then((resp) => resp.json())
            .then(function (data) {
                console.log(data)
            })
            .catch(error => console.error(error));
        setOpenPopUp(false);

        await fetch('/meteoComponents/' + props.user + "&" + props.clickedItinId, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'GET'
        }).then((resp) => resp.json())
            .then(function (data) {
                //(console.log(data)
                setIncomingMeteos(data);
                setLoading(false);
                // setItinData(data);
            })
            .catch(error => console.error(error))

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
                        handleClickDel={handleClickDel}
                        setClickedMeteoComp={setClickedMeteoComp}
                    />
                ))}
            </Grid>
        )

    }

    return (
        <div>
            <Link to={"/itinerary"} style={{ textDecoration: 'none' }}>
                <Button
                    className="btn"
                    variant="contained"
                    size="small"
                    startIcon={<KeyboardBackspaceIcon />}
                    style={{
                        marginTop: "0.5%",
                        marginLeft: "0.5%",
                        width: "5%",
                        height: "1%"
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

                {loading ?
                    <div className={classes.root}>
                        <CircularProgress style={{ color: "white" }} />
                    </div> :
                    renderCards()
                }

            </Container>

            <Dialog open={openPopUp} onClose={handleCancel} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">DELETE STAGE</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDel} style={{ color: "black" }}>
                        Cancel
                    </Button>

                    <div>
                        <Button
                            onClick={handleDelete}
                            variant="contained"
                            style={{ color: "black", borderColor: "black", background: "red" }}
                        >
                            <p>YES</p>
                        </Button>
                    </div>

                </DialogActions>
            </Dialog>

        </div>
    )
}

export default ItineraryInfo