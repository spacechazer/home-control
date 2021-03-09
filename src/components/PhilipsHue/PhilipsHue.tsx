import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Typography,
    Grid,
    MenuItem,
    IconButton,
    Menu,
    ListItem,
    ListSubheader,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import HueController from "./HueController";
import { SwitchDrawer } from "../SwitchDrawer";
import { Drawer } from "../Drawer";
import { VscSettingsGear } from "react-icons/vsc";
import { TiLightbulb } from "react-icons/ti";
import api from "../../api.json";

const useStyles = makeStyles((theme) => ({
    deviceTitle: {
        margin: theme.spacing(0, 0, 0.5),
        alignItems: "center",
        justifyContent: "space-between",
    },
    drawerPaper: {
        background: theme.palette.primary.dark,
        color: "currentColor",
        padding: theme.spacing(0, 0, 4),
    },
    groupPaper: {
        background:
            "linear-gradient(180deg, rgba(255,255,255,0.1) 25%, rgba(100,100,100,0.1) 100%)",
        padding: theme.spacing(1, 2),
        color: "currentColor",
        //border: "1px solid #151515",
    },
    menuPaper: {
        background: "#222",
        color: "white",
    },
    bulbIcon: {
        display: "block",
        color: theme.palette.primary.main,
        width: "1.25rem",
        height: "1.25rem",
    },
    alignEnd: {
        marginLeft: "auto",
    },
}));

const authorization = api.philipshue.authorization;
const ipAddress = api.philipshue.ipAddress;

const PhilipsHue = () => {
    const classes = useStyles();

    const [selectedGroup, setSelectedGroup] = useState<number>(1);
    const [philipsHueLights, setPhilipsHueLights] = useState<any>();
    const [philipsHueGroups, setPhilipsHueGroups] = useState<any>();
    const [didMount, setDidMount] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [anyLightOn, setAnyLightOn] = useState<boolean>(false);
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [bridgeInfoOpen, setBridgeInfoOpen] = useState(false);
    const [bridgeInfo, setBridgeInfo] = useState<any>(null);
    const [userInfoOpen, setUserInfoOpen] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);
    const settingButton = useRef<any>(null);

    const formatDate = (date: any) => {
        return new Date(date).toLocaleString();
    };

    const sendHueRequest = (lightId: number, postData: any) => {
        // eslint-disable-next-line eqeqeq
        if (lightId == 6 || lightId == 21) {
            Promise.all([
                fetch(
                    `http://${ipAddress}/api/${authorization}/lights/${6}/state`,
                    {
                        method: "PUT",

                        body: JSON.stringify(postData),
                    }
                ),
                fetch(
                    `http://${ipAddress}/api/${authorization}/lights/${21}/state`,
                    {
                        method: "PUT",
                        body: JSON.stringify(postData),
                    }
                ),
            ]).then(() => getPhilipsHueLights());
        } else {
            fetch(
                `http://${ipAddress}/api/${authorization}/lights/${lightId}/state`,
                {
                    method: "PUT",
                    body: JSON.stringify(postData),
                }
            ).then(() => getPhilipsHueLights());
        }
    };

    const toggleDrawer = () => setDrawerOpen((prevState) => !prevState);
    const toggleSettingsMenu = () => setSettingsOpen((prevState) => !prevState);
    const toggleUserInfo = () => setUserInfoOpen((prevState) => !prevState);
    const toggleBridgeInfo = () => setBridgeInfoOpen((prevState) => !prevState);

    const groupChange = (event: any, newValue: any) => {
        setSelectedGroup(newValue);
        toggleDrawer();
    };

    const getBridgeInfo = () => {
        fetch(`http://${ipAddress}/api/${authorization}/config`, {
            method: "GET",
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setBridgeInfo(data);
            })
            .catch((error) => {
                console.warn("fetchError", error);
            });
    };

    const getHueGroups = useCallback(
        (lights: any) => {
            fetch(`http://${ipAddress}/api/${authorization}/groups`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    setPhilipsHueGroups({
                        0: {
                            name: "Alle lampen",
                            ...(lights && {
                                lights: Object.keys(lights),
                                action: {
                                    on: anyLightOn ? false : true,
                                },
                                state: {
                                    any_on: anyLightOn,
                                },
                            }),
                        },
                        ...data,
                    });
                })
                .catch((error) => {
                    console.warn("fetchError", error);
                });
        },
        [anyLightOn]
    );

    const getPhilipsHueLights = useCallback(() => {
        fetch(`http://${ipAddress}/api/${authorization}/lights`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setPhilipsHueLights(data);
                getHueGroups(data);
            })
            .catch((error) => {
                console.warn("fetchError", error);
            });
    }, [getHueGroups]);

    const toggleGroup = useCallback(() => {
        let postData = {
            on: !philipsHueGroups[selectedGroup].state.any_on,
        };
        fetch(
            `http://${ipAddress}/api/${authorization}/groups/${selectedGroup}/action`,
            {
                method: "PUT",
                body: JSON.stringify(postData),
            }
        ).then(() => getPhilipsHueLights());
    }, [philipsHueGroups, getPhilipsHueLights, selectedGroup]);

    // Mount
    useEffect(() => {
        if (!didMount) {
            getPhilipsHueLights();
            getBridgeInfo();
            setDidMount(true);
        }

        if (!isUpdating) {
            const refetch = setInterval(() => {
                getPhilipsHueLights();
                getBridgeInfo();
            }, 1000 * 10);
            return () => clearInterval(refetch);
        }
    }, [didMount, isUpdating, getPhilipsHueLights]);

    // Determine if any light on
    useEffect(() => {
        setAnyLightOn(false);
        philipsHueGroups &&
            philipsHueGroups[0] &&
            !philipsHueGroups[0].error &&
            philipsHueGroups[selectedGroup].lights.map((groupLight: any) => {
                return (
                    philipsHueLights &&
                    Object.entries(philipsHueLights).map(
                        ([key, value]: any) =>
                            key === groupLight &&
                            value.state.on &&
                            value.state.reachable &&
                            setAnyLightOn(true)
                    )
                );
            });
    }, [philipsHueLights, philipsHueGroups, selectedGroup]);

    // Set bridge info
    useEffect(() => {
        bridgeInfo &&
            bridgeInfo[0] &&
            !bridgeInfo[0].error &&
            setUserInfo(Object.values(bridgeInfo.whitelist));
    }, [bridgeInfo]);

    return (
        <React.Fragment>
            <Grid
                container
                justify="space-between"
                className={classes.deviceTitle}
            >
                <Grid item xs={12}>
                    <Grid container justify="space-between" alignItems="center">
                        <Grid item>
                            <Typography component="div" variant="h3">
                                Philips Hue
                            </Typography>
                        </Grid>
                        <Grid item>
                            <IconButton
                                onClick={toggleSettingsMenu}
                                ref={settingButton}
                                color="primary"
                            >
                                <VscSettingsGear />
                            </IconButton>
                            <Menu
                                open={settingsOpen}
                                onClose={toggleSettingsMenu}
                                PaperProps={{
                                    className: classes.menuPaper,
                                }}
                                getContentAnchorEl={null}
                                anchorEl={settingButton.current}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                            >
                                <MenuItem
                                    onClick={() => {
                                        toggleBridgeInfo();
                                        toggleSettingsMenu();
                                    }}
                                >
                                    Bridge status
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        toggleUserInfo();
                                        toggleSettingsMenu();
                                    }}
                                >
                                    Gebruikers
                                </MenuItem>
                            </Menu>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    {philipsHueGroups &&
                    philipsHueGroups[0] &&
                    philipsHueGroups[0].error ? (
                        <SwitchDrawer
                            label={philipsHueGroups[0].error.description}
                            startIcon={
                                <TiLightbulb className={classes.bulbIcon} />
                            }
                        />
                    ) : (
                        philipsHueGroups && (
                            <SwitchDrawer
                                open={drawerOpen}
                                onClose={toggleDrawer}
                                drawerLabel="Groepen"
                                label={philipsHueGroups[selectedGroup].name}
                                checked={anyLightOn}
                                onChange={toggleGroup}
                                startIcon={
                                    <TiLightbulb className={classes.bulbIcon} />
                                }
                                onClick={toggleDrawer}
                            >
                                {Object.entries(philipsHueGroups).map(
                                    ([key, value]: any) => (
                                        <MenuItem
                                            key={key}
                                            onClick={(event) =>
                                                groupChange(event, key)
                                            }
                                        >
                                            {value.name}
                                        </MenuItem>
                                    )
                                )}
                            </SwitchDrawer>
                        )
                    )}
                </Grid>

                {philipsHueGroups &&
                    philipsHueGroups[0] &&
                    !philipsHueGroups[0].error &&
                    philipsHueGroups[selectedGroup].lights.map(
                        (groupLightId: any) =>
                            philipsHueLights &&
                            Object.entries(philipsHueLights).map(
                                ([lightId, value]: any) =>
                                    lightId === groupLightId && (
                                        <HueController
                                            key={lightId}
                                            id={lightId}
                                            light={value}
                                            setIsUpdating={setIsUpdating}
                                            sendHueRequest={sendHueRequest}
                                        />
                                    )
                            )
                    )}
            </Grid>

            {bridgeInfo && (
                <Drawer open={bridgeInfoOpen} onClose={toggleBridgeInfo}>
                    <ListSubheader color="primary" disableGutters>
                        Bridge status
                    </ListSubheader>
                    {bridgeInfo[0] && bridgeInfo[0].error ? (
                        <ListItem disableGutters>
                            <Grid container>
                                <Grid item xs={12}>
                                    {bridgeInfo[0].error.description}
                                </Grid>
                            </Grid>
                        </ListItem>
                    ) : (
                        <React.Fragment>
                            <ListItem disableGutters>
                                <Grid container>
                                    <Grid item xs={5}>
                                        Naam
                                    </Grid>
                                    <Grid item xs={7}>
                                        {bridgeInfo.name}
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem disableGutters>
                                <Grid container>
                                    <Grid item xs={5}>
                                        Zigbee kanaal
                                    </Grid>
                                    <Grid item xs={7}>
                                        {bridgeInfo.zigbeechannel}
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem disableGutters>
                                <Grid container>
                                    <Grid item xs={5}>
                                        API Versie
                                    </Grid>
                                    <Grid item xs={7}>
                                        {bridgeInfo.apiversion}
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem disableGutters>
                                <Grid container>
                                    <Grid item xs={5}>
                                        IP-Adres
                                    </Grid>
                                    <Grid item xs={7}>
                                        {bridgeInfo.ipaddress}
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem disableGutters>
                                <Grid container>
                                    <Grid item xs={5}>
                                        Gateway
                                    </Grid>
                                    <Grid item xs={7}>
                                        {bridgeInfo.gateway}
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem disableGutters>
                                <Grid container>
                                    <Grid item xs={5}>
                                        MAC-adres
                                    </Grid>
                                    <Grid item xs={7}>
                                        {bridgeInfo.mac}
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem disableGutters>
                                <Grid container>
                                    <Grid item xs={5}>
                                        Updates
                                    </Grid>
                                    <Grid item xs={7}>
                                        {bridgeInfo.swupdate2.state ===
                                        "noupdates"
                                            ? "Geen updates"
                                            : "Updates beschikbaar"}
                                    </Grid>
                                </Grid>
                            </ListItem>
                        </React.Fragment>
                    )}
                </Drawer>
            )}

            {userInfo && (
                <Drawer open={userInfoOpen} onClose={toggleUserInfo}>
                    <ListSubheader color="primary" disableGutters>
                        Bridge gebruikers
                    </ListSubheader>
                    {userInfo.map((data: any) => (
                        <ListItem key={data.name} disableGutters>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item xs={12} md={6}>
                                            <strong>{data.name}</strong>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            Laatst gebruikt:{" "}
                                            {formatDate(data["last use date"])}
                                            <br />
                                            Aanmaakdatum:{" "}
                                            {formatDate(data["create date"])}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </ListItem>
                    ))}
                </Drawer>
            )}
        </React.Fragment>
    );
};

export default PhilipsHue;
