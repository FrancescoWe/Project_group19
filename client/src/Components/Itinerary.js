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
import { Redirect } from "react-router-dom";

// TRANSITION
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

// STYLE
const useStyles = makeStyles((theme) => ({

}));

function Itinerary(props) {
    
    const [itinData, setItinData] = useState([]);
    const [done, setDone] = useState(false);
    // const [open, setOpen] = useState(false);
    // const [clickedItinId, setClickedItinId] = useState("");
    // const [clickedItinName, setClickedItinName] = useState("");
    // const [clickedItinMeteos, setClickedItinMeteos] = useState([]);

    // const [loading, setLoading] = useState(false);
    
    const classes = useStyles();
    
    
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
    
    
//    const handleClose = () => {
//        setOpen(false);
//    };

    // FUNZIONE PER IL CLICK DELL'INFO BUTTON
    async function handleClickOpen(event) {

        props.setClickedItinId(event.target.id);
        props.setClickedItinName(event.target.getAttribute("name"))

        await fetch('/meteoComponents/' + props.user + "&" + event.target.id, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'GET'
        }).then((resp) => resp.json())
            .then(function (data) {
                //(console.log(data)
                props.setClickedItinMeteos(data);
                // setItinData(data);
            })
            .catch(error => console.error(error))

        // setOpen(true);
        setDone(true);


    };

    // FUNZIONE PER IL CLICK DEL DELETE BUTTON
    async function handleDelete(){

    }

    // FUNZIONE PER RENDERIZZARE LE RIGE DELLA LISTA
    function renderRow() {

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
            {done ? <Redirect to={"/myitinerary"} /> : 
                <ItineraryList renderRow={renderRow} />}
        </div>

    )
}

export default Itinerary