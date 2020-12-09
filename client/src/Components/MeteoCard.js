import { makeStyles, Typography } from "@material-ui/core"
import Container from '@material-ui/core/Container';
import React, { useState } from "react"
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import Divider from "@material-ui/core/Divider"
import ThermometerIcon from 'mdi-react/ThermometerIcon'
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from "@material-ui/core/IconButton"
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';


function MeteoCard(props) {

    const [clicked] = useState(props.item._id);

    function round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    // console.log(props.item.date);
    // console.log(props.item.date);
    const date = new Date(props.item.date*1000);

    // console.log(props.item._id)
    // console.log(props.item._id)

    function handleClickDel(event){
        // console.log(clicked)
        props.setClickedMeteoComp(clicked)
        props.handleClickDel();
    }

    return (
            <Grid item>
                <Box
                    mt="auto"
                    mr="auto"
                    mb="auto"
                    ml="auto"
                    width={250}
                    borderRadius={16}
                    boxShadow="20"
                    style={{
                        backgroundColor: "rgba(255,255,255,0.5)"
                    }}
                >
                    <Grid container direction="column" alignItems="center" justify="center" spacing={2}>
                        <Grid item>
                            <h2 style={{ color: "Black", fontSize: "30px" }}>{props.item.cityName}</h2>
                        </Grid>
                        <Grid item>
                            <h2 style={{ color: "Black", fontSize: "30px" }}>{date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear()}</h2>
                        </Grid>
                        <Divider orientation="horizontal" flexItem />
                        <Grid item>
                            <Grid container direction="row" alignItems="center" spacing={5}>
                                <Divider orientation="vertical" style={{ marginBottom: "5%", marginTop: "5%" }} flexItem />
                                <Grid item>
                                    <Grid container direction="column" alignItems="center" spacing={1}>
                                        <Grid item>
                                            <ThermometerIcon size={30} />
                                        </Grid>
                                        <Grid item >
                                            <p style={{ fontWeight: "bold", color: "#008fd6" }}>
                                                {round(props.item.temp_Min, 1) + "°"}
                                            </p>
                                            <p style={{ fontWeight: "bold", color: "rgba(140,0,0,0.8" }}>
                                                {round(props.item.temp_Max, 1) + "°"}
                                            </p>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Divider orientation="vertical" style={{ marginBottom: "5%", marginTop: "5%" }} flexItem />
                            </Grid>
                        </Grid>
                        <Grid item>
                            <div>
                                <IconButton
                                    onClick={handleClickDel}
                                >
                                    <DeleteIcon style={{ pointerEvents: "none" }} />
                                </IconButton>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
    )
}

export default MeteoCard