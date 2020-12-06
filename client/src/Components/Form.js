// import { type } from "os";
import React, { useEffect, useState } from "react"
import Button from "@material-ui/core/button"
import TextField from "@material-ui/core/TextField"
import InputLabel from "@material-ui/core/InputLabel"
import InputAdornment from '@material-ui/core/InputAdornment'
import Search from "@material-ui/icons/Search"
import Container from "./Container"
import EmptyContainer from "./EmptyContainer"
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, withStyles } from '@material-ui/core/styles';

// STYLING
const CssTextField = withStyles ({
    root: {
      '& label.Mui-focused': {
        color: 'grey',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'grey',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'grey',
        },
      }
    },
  
})(TextField);

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


function Form() {

    const classes = useStyles();

    const styles = {
        width: 700,
        marginTop: 125
    }

    const [research, setResearch] = useState("")
    const [researchBefore, setResearchBefore] = useState("")
    const [data, setData] = useState(Object)
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
                    setData(response)
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

            <InputLabel></InputLabel>
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
                            <Container dataToPass = {data}/>
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