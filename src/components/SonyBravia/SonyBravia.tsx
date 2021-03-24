import React, { useState, useEffect, useCallback, useRef } from "react";
import { Grid, Typography, Button, MenuItem } from "@material-ui/core";
import { MdInput } from "react-icons/md";
import { IoVolumeMute, IoVolumeHigh, IoVolumeLow } from "react-icons/io5";
import { makeStyles } from "@material-ui/core/styles";
import { SwitchDrawer } from "../SwitchDrawer";
import api from "../../api.json";

const useStyles = makeStyles((theme) => ({
    controlIcon: {
        width: "2rem",
        height: "auto",
    },
    paper: {
        position: "relative",
        color: "currentColor",
        padding: theme.spacing(2),
        background: "#111",
        display: "flex",
        justifyContent: "center",
    },
    deviceTitle: {
        display: "flex",
        flexFlow: "column wrap",
        margin: theme.spacing(0, 0, 2),
    },
    deviceIcon: {
        margin: theme.spacing(0, 2, 0, 0),
    },
    inputIcon: {
        display: "block",
        color: theme.palette.primary.main,
        width: "1.25rem",
        height: "1.25rem",
    },
    button: {
        // minWidth: 0,
        width: "100%",
        // margin: theme.spacing(0, 0.25),
        padding: theme.spacing(1, 0.5),
        border: 0,
        background: "#151515",
        "&:hover": {
            border: `none`,
            background: "#151515",
        },
    },
    buttonActive: {
        background: theme.palette.primary.main,
    },
}));

const SonyBravia = (props: any) => {
    const classes = useStyles();
    const [tvPowerStatus, setTvPowerStatus] = useState<string>("");
    const [connections, setConnections] = useState<any>([]);
    const [currentInput, setCurrentInput] = useState<string>("");
    const [currentInputTitle, setCurrentInputTitle] = useState<string>("");
    const [volume, setVolume] = useState<number>(0);
    const [mute, setMute] = useState<boolean | string>("unknown");
    const [showInputsDrawer, setShowInputsDrawer] = useState<boolean>(false);
    const pressInterval = useRef<any>(null);
    const timeout = useRef<any>(null);

    const sendTVRequest = useCallback((endpoint: string, postData: any) => {
        let method = postData.method;
        fetch(`http://${api.sonybravia.ipAddress}/sony/${endpoint}`, {
            mode: "cors",
            method: "POST",
            headers: {
                "X-Auth-PSK": api.sonybravia.authorization,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.result && data.result[0]) {
                    let { status, source, uri } = data.result[0];
                    if (status) {
                        setTvPowerStatus(status);
                    }
                    if (source) {
                        setCurrentInput(uri);
                    }
                    if (Array.isArray(data.result[0])) {
                        data.result[0].map((result: any) => {
                            if (result.target === "speaker") {
                                setMute(result.mute);
                                setVolume(result.volume);
                            }
                            if (method === "getCurrentExternalInputsStatus") {
                                setConnections(data.result[0]);
                            }
                            return result;
                        });
                    }
                }
            })
            .catch((error) => {
                return setTvPowerStatus("offline");
            });
    }, []);

    const getPowerStatus = useCallback(() => {
        sendTVRequest("system", {
            method: "getPowerStatus",
            params: [],
            id: 1,
            version: "1.0",
        });
    }, [sendTVRequest]);

    const getVolumeInformation = useCallback(() => {
        sendTVRequest("audio", {
            method: "getVolumeInformation",
            id: 1,
            params: ["volume"],
            version: "1.0",
        });
    }, [sendTVRequest]);

    // useEffect(() => {
    //     console.log("vol", volume);
    //     getVolumeInformation();
    // }, [volume, getVolumeInformation]);

    const getPlayingContentInfo = useCallback(() => {
        sendTVRequest("avContent", {
            method: "getPlayingContentInfo",
            id: 1,
            params: [],
            version: "1.0",
        });
    }, [sendTVRequest]);

    const getCurrentExternalInputsStatus = useCallback(() => {
        sendTVRequest("avContent", {
            method: "getCurrentExternalInputsStatus",
            id: 1,
            params: [],
            version: "1.0",
        });
    }, [sendTVRequest]);

    const toggleTvPower = () => {
        sendTVRequest("system", {
            method: "setPowerStatus",
            params: [{ status: tvPowerStatus === "active" ? false : true }],
            id: 1,
            version: "1.0",
        });
    };

    const setAudioVolume = (value: string | number) => {
        sendTVRequest("audio", {
            method: "setAudioVolume",
            id: 1,
            params: [
                {
                    volume: value.toString(),
                    target: "speaker",
                },
            ],
            version: "1.0",
        });
        getVolumeInformation();
    };

    const volumeUp = () => setAudioVolume("+1");
    const volumeDown = () => setAudioVolume("-1");
    const muteAudio = () => setMute((prevState) => !prevState);

    const toggleInputsDrawer = () =>
        setShowInputsDrawer((prevState) => !prevState);

    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const longPress = (e: any, direction?: string, release?: boolean) => {
        clearTimeout(timeout.current);
        if (release) {
            clearInterval(pressInterval.current);
            return;
        }
        timeout.current = setTimeout(() => {
            pressInterval.current = setInterval(() => {
                direction && direction === "up" ? volumeUp() : volumeDown();
                return () => clearInterval(pressInterval.current);
            }, 100);
        }, 500);
    };

    const setPlayContent = (uri: string) => {
        sendTVRequest("avContent", {
            method: "setPlayContent",
            id: 101,
            params: [{ uri: uri }],
            version: "1.0",
        });
    };

    useEffect(() => getPowerStatus(), [getPowerStatus]);

    useEffect(() => {
        if (tvPowerStatus === "active") {
            getVolumeInformation();
            getPlayingContentInfo();
            getCurrentExternalInputsStatus();
        }

        const refetch = setInterval(() => {
            getPowerStatus();
            if (tvPowerStatus === "active") {
                getVolumeInformation();
                getPlayingContentInfo();
                getCurrentExternalInputsStatus();
            }
        }, 1000 * 10);
        return () => clearInterval(refetch);
    }, [
        tvPowerStatus,
        getPowerStatus,
        getVolumeInformation,
        getPlayingContentInfo,
        getCurrentExternalInputsStatus,
    ]);

    useEffect(() => {
        connections &&
            connections.length &&
            currentInput &&
            connections.map(
                (connection: any) =>
                    connection.uri === currentInput &&
                    setCurrentInputTitle(connection.label || connection.title)
            );
    }, [connections, currentInput]);

    useEffect(() => {
        if (mute !== "unknown") {
            sendTVRequest("audio", {
                method: "setAudioMute",
                id: 601,
                params: [{ status: mute }],
                version: "1.0",
            });
        }
    }, [mute, sendTVRequest]);

    const sendWol = () => {
        fetch("/wol-tv")
            .then((res) => res.text())
            .then((done) => {
                console.log("done?", done);
                return done;
            });
    };

    return (
        <React.Fragment>
            <Typography
                component="div"
                variant="h3"
                className={classes.deviceTitle}
            >
                Sony Bravia
                {/* <Typography component="div" variant="body1">
                    Status: {tvPowerStatus}, Volume: {volume}
                </Typography> */}
            </Typography>

            {/* <Button onClick={sendWol} variant="contained">
                Send TV WOL!
            </Button> */}

            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <SwitchDrawer
                        label={
                            (currentInputTitle &&
                                tvPowerStatus === "active" &&
                                currentInputTitle) ||
                            (tvPowerStatus !== "active" &&
                                capitalizeFirstLetter(tvPowerStatus)) ||
                            "Verbinden"
                        }
                        startIcon={<MdInput className={classes.inputIcon} />}
                        drawerLabel="Invoer"
                        onClick={
                            tvPowerStatus === "active"
                                ? toggleInputsDrawer
                                : null
                        }
                        onClose={toggleInputsDrawer}
                        onChange={toggleTvPower}
                        open={showInputsDrawer}
                        checked={tvPowerStatus === "active"}
                        loading={tvPowerStatus === ""}
                    >
                        {connections &&
                            connections.map(
                                (connection: any, idx: number) =>
                                    connection.connection && (
                                        <MenuItem
                                            key={idx}
                                            onClick={() => {
                                                setPlayContent(connection.uri);
                                                toggleInputsDrawer();
                                            }}
                                        >
                                            {connection.label ||
                                                connection.title}
                                        </MenuItem>
                                    )
                            )}
                    </SwitchDrawer>
                </Grid>
                <Grid item xs={4}>
                    <Button
                        color="primary"
                        variant="outlined"
                        className={classes.button}
                        onClick={volumeDown}
                        onMouseDown={(e) => longPress(e, "down", false)}
                        onMouseUp={(e) => longPress(e, "down", true)}
                        onTouchStart={(e) => longPress(e, "down", false)}
                        onTouchEnd={(e) => longPress(e, "down", true)}
                    >
                        <IoVolumeLow className={classes.controlIcon} />
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <Button
                        color="primary"
                        onClick={muteAudio}
                        className={classes.button}
                        variant="outlined"
                    >
                        <IoVolumeMute className={classes.controlIcon} />
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <Button
                        color="primary"
                        onClick={volumeUp}
                        className={classes.button}
                        variant="outlined"
                        onMouseDown={(e) => longPress(e, "up", false)}
                        onMouseUp={(e) => longPress(e, "up", true)}
                        onTouchStart={(e) => longPress(e, "up", false)}
                        onTouchEnd={(e) => longPress(e, "up", true)}
                    >
                        <IoVolumeHigh className={classes.controlIcon} />
                    </Button>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default SonyBravia;
