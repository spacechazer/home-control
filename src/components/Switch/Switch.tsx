import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Switch as MuiSwitch } from "@material-ui/core";

const AntSwitch = withStyles((theme) => ({
    root: {
        width: 48,
        height: 28,
        padding: 0,
        display: "flex",
    },
    switchBase: {
        padding: 2,
        color: theme.palette.common.white,
        "&$checked": {
            transform: "translateX(20px)",
            color: theme.palette.common.white,
            "& + $track": {
                opacity: 1,
                backgroundColor: theme.palette.secondary.main,
                borderColor: theme.palette.secondary.main,
            },
        },
    },
    thumb: {
        width: 24,
        height: 24,
        boxShadow: "none",
    },
    track: {
        border: `1px solid ${theme.palette.grey[700]}`,
        borderRadius: 28 / 2,
        opacity: 1,
        backgroundColor: theme.palette.grey[700],
    },
    checked: {},
}))(MuiSwitch);

const Switch = (props: any) => {
    return <AntSwitch {...props} />;
};

export default Switch;
