import { makeStyles, Typography } from "@material-ui/core"
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types'
import Box from '@material-ui/core/Box';
// import List from '@material-ui/core/List';
import React, { useEffect, useState } from "react"
import { FixedSizeList } from 'react-window'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ItineraryList from "./ItineraryList"

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

function ItineraryInfo(props) {

    const classes = useStyles();



    return (
        <h1>
            {props.click.map(item =>
                item.cityName + "\n"
            )}
        </h1>
    )
}

export default ItineraryInfo