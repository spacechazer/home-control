import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Slider as MuiSlider } from "@material-ui/core/";

const size = 16;

const IOSSlider = withStyles((theme) => ({
    root: {
        display: "flex",
        alignItems: "center",
        color: theme.palette.primary.main,
        height: size,
        padding: 0,
        pointerEvents: "none",
        boxSizing: "inherit",
        borderRadius: 0,
        paddingRight: size,
    },
    rail: {
        background: theme.palette.grey[700],
        height: "50%",
        marginRight: 0,
        borderRadius: `${size}px`,
    },
    thumb: {
        position: "relative",
        pointerEvents: "all",
        height: size,
        width: size,
        backgroundColor: "white",
        margin: 0,
    },
    active: {},
    track: {
        height: "50%",
        borderRadius: `${size}px`,
        paddingRight: 0,
        paddingLeft: 0,
        boxSizing: "content-box",
        marginLeft: 0,
    },
    valueLabel: {
        left: "calc(-50% - 0px)",
    },
}))(MuiSlider);

const Slider = (props: any) => {
    const {
        className,
        classes,
        sendHueRequest,
        step = 1,
        min,
        lightId,
        lightValue,
        setUpdate,
    } = props;
    const [value, setValue] = useState<number>(0);

    useEffect(() => {
        setValue(Math.round((lightValue.state.bri / 254) * 100));
    }, [lightValue]);

    return (
        <IOSSlider
            className={className}
            classes={classes}
            onChange={(e, newValue: any) => {
                setValue(newValue);
                setUpdate(true);
            }}
            onChangeCommitted={(e, newValue: any) => {
                setUpdate(false);
                sendHueRequest(lightId, {
                    bri: Math.round((newValue / 100) * 254),
                });
            }}
            onTouchCancel={(e) => {
                setUpdate(false);
            }}
            min={min}
            onClick={(e: React.ChangeEvent<{}>) => {
                e.stopPropagation();
            }}
            step={step}
            value={value}
            valueLabelDisplay="auto"
        />
    );
};

export default Slider;
