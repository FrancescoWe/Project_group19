import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button"
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from "./Container"
import CssTextField from "./CssTextField"
import InputAdornment from '@material-ui/core/InputAdornment'
import React, { useState } from "react"
import Search from "@material-ui/icons/Search"

// STYLING

const useStyles = makeStyles((theme) => ({
    cssLabel: {
        color: "white"
    },

    cssOutlinedInput: {
        '&$cssFocused $notchedOutline': {
            borderColor: `${theme.palette.primary.main} !important`,
        }
    },

    notchedOutline: {
        borderWidth: '1px',
        borderColor: 'grey !important'
    },

    multilineColor: {
        color: "white"
    },

}));


function Form(props) {

    const classes = useStyles();

    const styles = {
        width: 700,
        marginTop: 35
    }

    const [research, setResearch] = useState("")
    const [researchBefore, setResearchBefore] = useState("")
    const [data, setData] = useState(Object)
    const [dataTwo, setSecondData] = useState(Object)
    const [loading, setLoading] = useState(false)
    const [buttonClicked, setButtonClicked] = useState(false)

    async function handleClick() {
        if (research.localeCompare("") != 0 && research.localeCompare(researchBefore) != 0) {
            setResearchBefore(research)
            setLoading(true)
            setButtonClicked(true)

            const searchUrl = "./meteos/" + research;

            await fetch(searchUrl)
                .then(response => response.json())
                .then(response => {
                    var array = new Array();
                    var jsonCurrent={
                        icon: "http://openweathermap.org/img/wn/" + response.current.weather[0].icon + "@2x.png",
                        temp_Max: response.daily[0].temp.max,
                        temp_Min: response.daily[0].temp.min,
                        date: response.current.dt * 1000,
                        cityName: response.timezone,
                        temp: response.current.temp,
                        humidity: response.current.humidity,
                        wind_speed: response.current.wind_speed,
                        deg: response.current.wind_deg,
                        main: response.current.weather[0].main,
                        feels_like: response.current.feels_like,
                        uvi: response.current.uvi
                    }

                    for(var i=1; i<6; i++){
                        var jsonToPass={
                            icon: "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + "@2x.png",
                            temp_Max: response.daily[i].temp.max,
                            temp_Min: response.daily[i].temp.min,
                            date: response.daily[i].dt * 1000,
                            cityName: response.timezone,
                            temp: response.daily[i].temp.day,
                            humidity: response.daily[i].humidity,
                            wind_speed: response.daily[i].wind_speed,
                            deg: response.daily[i].wind_deg,
                            main: response.daily[i].weather[0].main
                        }
                        array.push(jsonToPass);
                    }
                    setData(jsonCurrent)
                    setSecondData(array)
                    setLoading(false)
                });
        }
    }

    function handleChange(event) {
        var { value } = event.target
        setResearch(value)
    }

    return (
        <div>
            {/*<h2 class="title">Cerca Località: </h2>*/}
            <br />
            <form className="search__part">
                <CssTextField
                    style={styles}
                    id="outlined-basic"
                    label="Search City"
                    placeholder="London, New York, Tokyo ..."
                    variant="outlined"
                    name="research"
                    onChange={handleChange}
                    value={research}
                    InputProps={{
                        className: classes.multilineColor,
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search style={{color: "white"}} onClick={handleClick} />
                            </InputAdornment>
                        ),
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

                {/*<input name="research" type="text" id="searchbar" value={this.state.research} onChange={this.handleChange} class="form-control" placeholder="London, New York, Tokyo..." />*/}
                <br />
                <br />

                <div style = {{position : "relative"}}>
                    <Button
                        className="btn"
                        variant="contained"
                        onClick={handleClick}
                        size="large"
                        startIcon={<Search />}
                        disabled={loading}
                    >
                        Search
                    </Button>
                    {loading && <CircularProgress size={24} style={{
                        color: "white",
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: -12,
                        marginLeft: -12,
                    }} />}
                </div>


                {(!loading && buttonClicked) ?
                            <Container dataToPass = {data}
                                dataToPassTwo = {dataTwo}
                            />
                        :
                            null
                }

                {/*<button type="button" class="btn" id="forecast" onClick={this.handleClick}><i class="fa fa-search"></i> Search </button>*/}
            </form>
            <br />
        </div>
    )
}


export default Form