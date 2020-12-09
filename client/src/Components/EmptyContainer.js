// INUTILIZZATO 

import React from "react"
import Card from "./Card"
import Box from "@material-ui/core/Box"

function EmptyContainer(props) {
    return (
        <Box
            component="div"
            display="flex"
            mx={3}
            mt={10}
            pt={5}
            pb={5}
        >
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />

        </Box>
    )
}

export default EmptyContainer