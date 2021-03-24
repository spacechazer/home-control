import React, { useEffect, useRef, useState } from "react";
import { Slider } from "../Slider";
import { makeStyles } from "@material-ui/core/styles";
import {
    Typography,
    Grid,
    Button,
    ListSubheader,
    ButtonGroup,
    ListItem,
} from "@material-ui/core";
import { Drawer } from "../Drawer";
import { BsFillLightningFill } from "react-icons/bs";
import { MdInvertColors, MdInfoOutline } from "react-icons/md";
import { IoIosPower } from "react-icons/io";
import classNames from "classnames";
import red from "@material-ui/core/colors/red";
import ColorConverter from "cie-rgb-color-converter";
import ColorPicker from "./ColorPicker";
import { DeviceCard } from "../DeviceCard";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "space-between",
    },
    lightHeader: {
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "space-between",
        margin: theme.spacing(0, 0, 0.5),
    },
    lightHeading: {
        hyphens: "auto",
        lineHeight: 1.25,
        alignSelf: "center",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    controllerActions: {
        margin: theme.spacing(1, 0, 0),
    },
    disabledLight: {
        opacity: 0.3,
        "& $thumb": {
            pointerEvents: "none",
        },
    },
    thumb: {},
    colorIcon: {
        width: "1.25rem",
        height: "1.25rem",
        color: theme.palette.primary.main,
    },
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
    valueLabel: {
        fontSize: "inherit",
    },
}));

type LightProps = {
    id: number;
    light: any;
    sendHueRequest: any;
    setIsUpdating: any;
};

const HueController = (props: LightProps) => {
    const classes = useStyles();
    const { id, light, sendHueRequest, setIsUpdating } = props;

    const [showColorDialog, setShowColorDialog] = useState<boolean>(false);
    const [showInfoDialog, setShowInfoDialog] = useState<boolean>(false);
    const [color, setColor] = useState();

    const toggleColorDialog = (event: any) => {
        event.stopPropagation();
        setShowColorDialog((prevState) => !prevState);
    };

    const toggleInfoDialog = (event: any) => {
        event.stopPropagation();
        setShowInfoDialog((prevState) => !prevState);
    };

    const timeout = useRef<any>();
    const sendColorRequest = (e: any) => {
        const convertedColors = ColorConverter.rgbToXy(e.red, e.green, e.blue);
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
            sendHueRequest(id, {
                xy: [convertedColors.x, convertedColors.y],
            });
            return () => clearTimeout(timeout.current);
        }, 100);
    };

    const formatDate = (date: any) => {
        return new Date(date).toLocaleDateString();
    };

    useEffect(() => {
        setIsUpdating(showColorDialog);
    }, [showColorDialog, setIsUpdating]);

    useEffect(() => {
        if (light.state.bri && light.state.xy) {
            const convertedColors = ColorConverter.xyBriToRgb(
                light.state.xy[0],
                light.state.xy[1],
                light.state.bri
            );
            setColor(convertedColors);
        }
    }, [light]);

    return (
        <Grid
            item
            xs={6}
            sm={4}
            md={3}
            key={light.uniqueid}
            className={classes.root}
        >
            <DeviceCard>
                <div className={classes.lightHeader}>
                    <Typography
                        className={classNames(classes.lightHeading, {
                            [classes.disabledLight]:
                                !light.state.on || !light.state.reachable,
                        })}
                    >
                        {light.name}
                    </Typography>
                </div>
                {!light.state.reachable ? (
                    <Typography component="div" className={classes.unreachable}>
                        <BsFillLightningFill />
                        Niet bereikbaar
                    </Typography>
                ) : (
                    <Slider
                        lightId={id}
                        lightValue={light}
                        min={1}
                        sendHueRequest={sendHueRequest}
                        setUpdate={setIsUpdating}
                        className={classNames({
                            [classes.disabledLight]: light.state.on === false,
                        })}
                        classes={{
                            thumb: classes.thumb,
                            valueLabel: classes.valueLabel,
                        }}
                    />
                )}
                <ButtonGroup className={classes.controllerActions}>
                    {light.state.reachable && (
                        <Button
                            color="primary"
                            size="small"
                            onClick={() =>
                                light.state.reachable &&
                                sendHueRequest(id, {
                                    on: light.state.on === false ? true : false,
                                })
                            }
                        >
                            <IoIosPower className={classes.colorIcon} />
                        </Button>
                    )}
                    {light.type === "Color light" && (
                        <Button
                            color="primary"
                            size="small"
                            onClick={toggleColorDialog}
                        >
                            <MdInvertColors className={classes.colorIcon} />
                        </Button>
                    )}
                    <Button
                        color="primary"
                        size="small"
                        onClick={toggleInfoDialog}
                    >
                        <MdInfoOutline className={classes.colorIcon} />
                    </Button>
                </ButtonGroup>
            </DeviceCard>

            {color && (
                <ColorPicker
                    color={color}
                    open={showColorDialog}
                    onClose={toggleColorDialog}
                    light={light}
                    sendColorRequest={sendColorRequest}
                />
            )}

            <Drawer open={showInfoDialog} onClose={toggleInfoDialog}>
                <ListSubheader color="primary" disableGutters>
                    {light.name}
                </ListSubheader>
                {light.productname && (
                    <ListItem disableGutters>
                        <Grid container>
                            <Grid item xs={5}>
                                Producttype
                            </Grid>{" "}
                            <Grid item xs={7}>
                                {light.productname}
                            </Grid>
                        </Grid>
                    </ListItem>
                )}
                {light.manufacturername && (
                    <ListItem disableGutters>
                        <Grid container>
                            <Grid item xs={5}>
                                Fabrikant
                            </Grid>{" "}
                            <Grid item xs={7}>
                                {light.manufacturername}
                            </Grid>
                        </Grid>
                    </ListItem>
                )}
                {light.capabilities.certified && (
                    <ListItem disableGutters>
                        <Grid container>
                            <Grid item xs={5}>
                                Gecertificeerd
                            </Grid>{" "}
                            <Grid item xs={7}>
                                {light.capabilities.certified ? "Ja" : "Nee"}
                            </Grid>
                        </Grid>
                    </ListItem>
                )}
                {light.modelid && (
                    <ListItem disableGutters>
                        <Grid container>
                            <Grid item xs={5}>
                                Model ID
                            </Grid>{" "}
                            <Grid item xs={7}>
                                {light.modelid}
                            </Grid>
                        </Grid>
                    </ListItem>
                )}
                {light.swversion && (
                    <ListItem disableGutters>
                        <Grid container>
                            <Grid item xs={5}>
                                Firmware
                            </Grid>{" "}
                            <Grid item xs={7}>
                                {light.swversion}
                            </Grid>
                        </Grid>
                    </ListItem>
                )}
                {light.swupdate.state && (
                    <ListItem disableGutters>
                        <Grid container>
                            <Grid item xs={5}>
                                Updates
                            </Grid>{" "}
                            <Grid item xs={7}>
                                {light.swupdate.state === "noupdates"
                                    ? "Geen updates"
                                    : "Update beschikbaar"}
                            </Grid>
                        </Grid>
                    </ListItem>
                )}
                {light.swupdate.lastinstall && (
                    <ListItem disableGutters>
                        <Grid container>
                            <Grid item xs={5}>
                                Update datum
                            </Grid>{" "}
                            <Grid item xs={7}>
                                {formatDate(light.swupdate.lastinstall)}
                            </Grid>
                        </Grid>
                    </ListItem>
                )}
            </Drawer>
        </Grid>
    );
};

export default HueController;
