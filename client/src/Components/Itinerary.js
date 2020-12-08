import { makeStyles, Typography } from "@material-ui/core"
// import List from "@material-ui/core/List"
import React, { useEffect, useState } from "react"
import { FixedSizeList } from 'react-window'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ItineraryList from "./ItineraryList"
import ItineraryInfo from "./ItineraryInfo"
import Dialog from '@material-ui/core/Dialog';
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from '@material-ui/core/Button';
import MapMarkerPathIcon from 'mdi-react/MapMarkerPathIcon'
import {Link} from "react-router-dom"
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

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

function Itinerary(props) {

    const [itinData, setItinData] = useState([]);
    const [open, setOpen] = useState(false);
    // const [clicked, setClicked] = useState(false);
    const [clickedItinId, setClickedItinId] = useState("");
    const [clickedItinMeteos, setClickedItinMeteos] = useState([]);
    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    const handleClose = () => {
        setOpen(false);
    };


    async function handleClickOpen(event) {

        setClickedItinId(event.target.id);

        await fetch('/meteoComponents/' + props.user + "&" + event.target.id, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'GET'
        }).then((resp) => resp.json())
            .then(function (data) {
                console.log(data)
                setClickedItinMeteos(data);
                // setItinData(data);
            })
            .catch(error => console.error(error))

        setOpen(true);
    };

    /*
    function handleClickItin(event) {
        const { id } = event.target;
        console.log(id);
        // setClicked(true);
        // setClickedItinMeteos(id);
    }
    */

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
                setItinData(data);
            })
            .catch(error => console.error(error))

    }


    function renderRow() {
        // console.log("Rendering Rows...");
        // console.log("The array has " + itinData.length + " itineraries")
        // console.log(itinData);
        return (
            <div>
                {itinData.map(item => (
                    <div
                        key={item._id}
                        className="itineraryDiv"
                    >
                        <ListItem
                            button
                            style={{ color: "white" }}
                            onClick={handleClickOpen}
                            id={item._id}
                            name={item.name}
                            style={{ background: "linear-gradient(to right, #ffffff,#5c5c5c)" }}
                        >
                            <ListItemText style={{ pointerEvents: "none", color: "black" }} >
                                <h2> {item._id} </h2>
                            </ListItemText>
                        </ListItem>
                    </div>
                ))}
                <Link to={"/yourItinerary"/*"yourItinerary"*/} style={{ textDecoration: 'none'}}>
                                                 <Button variant="outlined" style={{color : "white"}} startIcon = {<MapMarkerPathIcon size = {18}/>}>
                                                        Your Itineraries
                                                 </Button>
                                          </Link>
            </div>
        )
    }


    useEffect(() => {
        fetching();
        console.log("The signed-in user's id: " + props.user);
        // renderRow()
    }, [])


    return (
        <div>
            <ItineraryList renderrow={renderRow} />
            <Dialog
                open={open}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                style={{ background: "rgba(255,255,255,0.2)" }}
            >
                <DialogTitle id="alert-dialog-slide-title">
                    {"INFO ABOUT THE ITINERARY: " + clickedItinId}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <ItineraryInfo click={clickedItinMeteos}/>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose} style={{ background: "red" }}>
                        Delete itinerary
                    </Button>
                    <Button variant="outlined" onClick={handleClose} style={{ color: "black", borderColor: "black" }}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>

    )
}

export default Itinerary