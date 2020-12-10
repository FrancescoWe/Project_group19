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
import Toolbar from '@material-ui/core/Toolbar'
import AddIcon from '@material-ui/icons/Add';
import CssTextField from "./CssTextField"
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import 'date-fns';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(6),
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
    button: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    cssLabel: {
        color: "black"
    },

    cssOutlinedInput: {
        '&$cssFocused $notchedOutline': {
            borderColor: `${theme.palette.primary.main} !important`,
        }
    },

    notchedOutline: {
        borderWidth: '1px',
        borderColor: 'black !important'
    },

    multilineColor: {
        color: "black"
    },
}));



function ItineraryInfo(props) {

    const classes = useStyles();

    const [incomingMeteos, setIncomingMeteos] = useState(props.clickedItinMeteos);
    const [openPopUp, setOpenPopUp] = useState(false);
    const [open, setOpen] = useState(false);
    const [clickedMeteoComp, setClickedMeteoComp] = useState("");
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [selectedDate, setSelectedDate] = React.useState(new Date(''));
    const [toUnix, setToUnix] = useState(new Date(''));

    
    
    
    // console.log(props.clickedItinMeteos)
    // console.log(incomingMeteos);
    
    
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
    
    
    function handleCancelAdd() {
        setOpen(false)
    }
    
    function handleClickAdd() {
        setOpen(true);
    }
    
    function handleChange(event) {
        setName(event.target.value);
    }
    
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    
    async function handleDone() {
        setLoading(true);
        addStageFetch();
        setOpen(false);
    }
    
//    console.log(props.user)
//    console.log(selectedDate);
//    console.log(toUnix);
    
    async function addStageFetch(){
        setToUnix(new Date(selectedDate).getTime()/1000)
        const unixDate=new Date(selectedDate).getTime()/1000
        await fetch('/meteoComponents' , {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                "itinerary_id": props.clickedItinId,
                "user_id": props.user,
                "cityName": name,
                "date": unixDate,
            })
        }).then(resp => resp.json())
        .then(function (data) {
            console.log(data)
            if(data.error != null){
                window.alert(data.error);
                console.log("ERROR");
            }
        })
        .catch(error => {
            window.alert(error);
            console.error(error);
        })
        
        setName("");

        await fetch('/meteoComponents/' + props.user + "&" + props.clickedItinId, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'GET'
        }).then((resp) => resp.json())
        .then(function (data) {
            if(data.error != null){
                window.alert(data.error);
                console.log("ERROR");
            } else {
                //(console.log(data)
                setIncomingMeteos(data);
                setLoading(false);
            }
        })
        .catch(error => {
            window.alert(error)
            console.error(error)
        })
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
            <Toolbar style={{ minHeight: "40px", marginTop: "5px" }}>
                <Link to={"/itinerary"} style={{ textDecoration: 'none' }}>
                    <Button
                        className="btn"
                        variant="contained"
                        size="small"
                        startIcon={<KeyboardBackspaceIcon />}
                    >
                        Back
                    </Button>
                </Link>
            </Toolbar>
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
                    <Button
                        className="btn"
                        variant="contained"
                        size="medium"
                        startIcon={<AddIcon />}
                        onClick={handleClickAdd}
                    >
                        ADD STAGE
                    </Button>
                    <br />
                </div>

                {loading ?
                    <div className={classes.root}>
                        <CircularProgress style={{ color: "white" }} />
                    </div> :
                    renderCards()
                }

            </Container>

            <Dialog open={openPopUp} onClose={handleCancelDel} aria-labelledby="form-dialog-title">
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

            <Dialog open={open} onClose={handleCancelAdd} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">ADD A NEW STAGE</DialogTitle>
                <DialogContent>
                    <DialogContentText style={{ color: "black" }}>
                        Insert the name of the city
                    </DialogContentText>
                    <CssTextField
                        autoFocus
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        label="City"
                        variant="outlined"
                        value={name}
                        onChange={handleChange}
                        name="cityName"
                        InputProps={{
                            className: classes.multilineColor,
                            classes: {
                                root: classes.cssOutlinedInput,
                                notchedOutline: classes.notchedOutline
                            }

                        }}
                        InputLabelProps={{
                            classes: {
                                root: classes.cssLabel,
                            },
                        }}
                    />
                    <DialogContentText style={{ color: "black", marginTop:"10px", marginBottom: "0px" }}>
                        Pick a date
                    </DialogContentText>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label=""
                            value={selectedDate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            style={{color: "black"}}
                        />
                    </MuiPickersUtilsProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelAdd} style={{ color: "red" }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDone}
                        variant="outlined"
                        style={{ color: "black", borderColor: "black" }}
                    >
                        <p>Done</p>
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}

export default ItineraryInfo