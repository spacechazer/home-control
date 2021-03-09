import React from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import { Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    paper: {
        position: "relative",
        color: "currentColor",
        padding: theme.spacing(2),
        height: "100%",
        background: "#151515",
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "space-between",
        transition: "all .3s ease",
        //border: "1px solid #151515",
    },
    paperDisabled: {},
    unreachable: {
        display: "flex",
        alignItems: "center",
        fontSize: ".75rem",
        lineHeight: "1rem",
        color: red[500],

        "& svg": {
            margin: theme.spacing(0, 0.5, 0, 0),
        },
    },
}));

const DeviceCard = (props: any) => {
    const { disabled, children, onClick } = props;
    const classes = useStyles();

    return (
        <Paper
            onClick={onClick}
            className={classNames(classes.paper, {
                [classes.paperDisabled]: disabled,
            })}
        >
            {children && children}
        </Paper>
    );
};

export default DeviceCard;
