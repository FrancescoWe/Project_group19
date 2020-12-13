import { makeStyles, Typography } from "@material-ui/core"
// import List from "@material-ui/core/List"
import React, { useEffect, useState } from "react"
import ItineraryList from "./ItineraryList"
import Slide from '@material-ui/core/Slide';


// TRANSITION
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

// STYLE
const useStyles = makeStyles((theme) => ({

}));

function Itinerary(props) {
    
    // const [itinData, setItinData] = useState([]);
    // const [done, setDone] = useState(false);
    // const [open, setOpen] = useState(false);
    // const [clickedItinId, setClickedItinId] = useState("");
    // const [clickedItinName, setClickedItinName] = useState("");
    // const [clickedItinMeteos, setClickedItinMeteos] = useState([]);

    // const [loading, setLoading] = useState(false);
    
    const classes = useStyles();

    console.log("test user id : " + props.user)

    return (
        <div>
            <ItineraryList 
                user={props.user} 
                setClickedItinId={props.setClickedItinId} 
                setClickedItinName={props.setClickedItinName} 
                setClickedItinMeteos={props.setClickedItinMeteos}

                clickedItinMeteos={props.clickedItinMeteos} 
                clickedItinName={props.clickedItinName}
                clickedItinId={props.clickedItinId}
            />
        </div>

    )
}

export default Itinerary