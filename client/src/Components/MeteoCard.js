import { makeStyles, Typography } from "@material-ui/core"
import Container from '@material-ui/core/Container';
import React, { useState } from "react"
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import Divider from "@material-ui/core/Divider"
import ThermometerIcon from 'mdi-react/ThermometerIcon'


function MeteoCard(props) {

    function round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }
    
    return (
        <Grid item>
            <Box
                mt="auto"
                mr="auto"
                mb="auto"
                ml="auto"
                width={250}
                height={215}
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
                        <h2 style={{ color: "Black", fontSize: "30px" }}>{props.item.date}</h2>
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
                </Grid>
            </Box>
        </Grid>
    )
}

export default MeteoCard