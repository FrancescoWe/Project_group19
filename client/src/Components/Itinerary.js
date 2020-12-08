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
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import InformationOutlineIcon from "mdi-react/InformationOutlineIcon"

// TRANSITION
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

// STYLE
const useStyles = makeStyles((theme) => ({

}));

function Itinerary(props) {
    
    const [itinData, setItinData] = useState([]);
    const [open, setOpen] = useState(false);
    const [clickedItinId, setClickedItinId] = useState("");
    const [clickedItinName, setClickedItinName] = useState("");
    const [clickedItinMeteos, setClickedItinMeteos] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const classes = useStyles();
    
    const handleClose = () => {
        setOpen(false);
    };
    
    useEffect(() => {
        fetching();
        console.log("The signed-in user's id: " + props.user);
        // renderRow()
    }, [])
    
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


    // FUNZIONE PER IL CLICK DELL'INFO BUTTON
    async function handleClickOpen(event) {

        setClickedItinId(event.target.id);
        setClickedItinName(event.target.getAttribute("name"))

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

    // FUNZIONE PER IL CLICK DEL DELETE BUTTON
    async function handleDelete(){

    }

    // FUNZIONE PER RENDERIZZARE LE RIGE DELLA LISTA
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
                            style={{ color: "white" }}
                            style={{ background: "linear-gradient(to right, #ffffff,#5c5c5c)" }}
                        >
                            <ListItemText style={{ pointerEvents: "none", color: "black" }} >
                                <h2> {item.name} </h2>
                            </ListItemText>

                            <div
                                onClick={handleClickOpen}
                                id={item._id}
                                name={item.name}
                            >
                                <IconButton style={{ pointerEvents: "none"} }>
                                    <InformationOutlineIcon style={{ pointerEvents: "none"}} />
                                </IconButton>
                            </div>

                            <div
                                onClick={handleDelete}
                                id={item._id}
                            >
                                <IconButton variant="outlined">
                                    <DeleteIcon />
                                </IconButton>
                            </div>

                        </ListItem>
                    </div>
                ))}
            </div>
        )
    }



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
                    {"INFO ABOUT THE ITINERARY '" + clickedItinName + "'"}
                </DialogTitle>

                <DialogContent>
                    <DialogContentText component="span" id="alert-dialog-slide-description">
                        <ItineraryInfo click={clickedItinMeteos}/>
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button variant="contained" onClick={handleClose} style={{ color: "white", backgroundColor: "black" , borderColor: "black" }}>
                        OK
                    </Button>
                </DialogActions>

            </Dialog>
        </div>

    )
}

export default Itinerary