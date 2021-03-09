import React, { useEffect, useState } from "react";
import { Container, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SonyBravia } from "../src/components/SonyBravia";
import { PhilipsHue } from "./components/PhilipsHue";
import api from "./api.json";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "flex-end",
        overflow: "hidden",
        padding: theme.spacing(2, 2, 8),
        boxSizing: "border-box",
    },
    disabledLight: {
        opacity: 0.3,
    },
}));

function App() {
    const classes = useStyles();

    const greet = () => {
        const currentDate = new Date();
        return currentDate.getHours() > 17
            ? "Goedenavond"
            : currentDate.getHours() < 6
            ? "Goedenacht"
            : currentDate.getHours() < 12
            ? "Goedemorgen"
            : "Goedenmiddag";
    };

    const [timeGreeting, setTimeGreeting] = useState<any>(greet);

    useEffect(() => {
        const checkCurrentTime = setInterval(() => {
            setTimeGreeting(greet);
        }, 1000);
        return () => clearInterval(checkCurrentTime);
    }, [timeGreeting]);

    return (
        <Container maxWidth="lg" className={classes.root}>
            <Grid container justify="center" spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h2">{timeGreeting}</Typography>
                </Grid>
                {api.sonybravia && (
                    <Grid item xs={12}>
                        <SonyBravia />
                    </Grid>
                )}
                {api.philipshue && (
                    <Grid item xs={12}>
                        <PhilipsHue />
                    </Grid>
                )}
            </Grid>
        </Container>
    );
}

export default App;
