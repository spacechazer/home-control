import React from "react";
import {
    Drawer as MuiDrawer,
    Container,
    Grid,
    ListItem,
    Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    drawerPaper: {
        background: theme.palette.primary.dark,
        color: "currentColor",
        padding: theme.spacing(0, 0, 4),
    },
    container: {
        background: "inherit",
    },
}));

const Drawer = (props: any) => {
    const { open, onClose, children, keepMounted = false } = props;
    const classes = useStyles();

    return (
        <MuiDrawer
            open={open}
            onClose={onClose}
            classes={{ paper: classes.drawerPaper }}
            anchor="bottom"
            keepMounted={keepMounted}
        >
            <Container maxWidth="lg" className={classes.container}>
                {children}
                <ListItem>
                    <Grid container justify="center">
                        <Grid item>
                            <Button
                                color="primary"
                                onClick={onClose}
                                variant="outlined"
                                disableElevation
                            >
                                Sluit
                            </Button>
                        </Grid>
                    </Grid>
                </ListItem>
            </Container>
        </MuiDrawer>
    );
};

export default Drawer;
