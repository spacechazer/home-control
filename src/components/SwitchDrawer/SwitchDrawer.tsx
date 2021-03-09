import React, { useEffect } from "react";
import {
    Grid,
    Switch,
    Drawer,
    ListSubheader,
    CircularProgress,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { BiSortDown } from "react-icons/bi";
import { DeviceCard } from "../DeviceCard";

const useStyles = makeStyles((theme) => ({
    deviceTitle: {
        margin: theme.spacing(0, 0, 2),
        alignItems: "center",
    },
    drawerPaper: {
        background: theme.palette.primary.dark,
        color: "currentColor",
        padding: theme.spacing(0, 0, 4),
    },
    drawerItem: {
        borderBottom: `1px solid ${theme.palette.secondary.dark}`,
        "&:last-child": {
            borderBottom: 0,
        },
    },
    groupIcon: {
        display: "block",
        color: theme.palette.primary.main,
        width: "1.25rem",
        height: "1.25rem",
    },
    alignEnd: {
        marginLeft: "auto",
    },
    loader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "58px",
        height: "38px",
    },
}));

const SwitchDrawer = (props: any) => {
    const {
        label,
        drawerLabel,
        open,
        onClick,
        onClose,
        onChange,
        children,
        checked,
        loading,
        startIcon,
    } = props;
    const classes = useStyles();

    useEffect(() => {}, [loading]);

    return (
        <React.Fragment>
            <DeviceCard onClick={onClick}>
                <Grid
                    container
                    alignItems="center"
                    spacing={2}
                    justify="space-between"
                >
                    <Grid item>
                        {startIcon ? (
                            startIcon
                        ) : (
                            <BiSortDown
                                color="primary"
                                className={classes.groupIcon}
                            />
                        )}
                    </Grid>
                    <Grid item>
                        <Typography>{label}</Typography>
                    </Grid>
                    <Grid item className={classes.alignEnd}>
                        {loading ? (
                            <div className={classes.loader}>
                                <CircularProgress size={20} />
                            </div>
                        ) : (
                            <Switch
                                color="primary"
                                onChange={onChange}
                                onClick={(e) => e.stopPropagation()}
                                checked={checked}
                            />
                        )}
                    </Grid>
                </Grid>
            </DeviceCard>
            {!loading && (
                <Drawer
                    open={open}
                    onClose={onClose}
                    anchor="bottom"
                    classes={{ paper: classes.drawerPaper }}
                >
                    {drawerLabel && (
                        <ListSubheader color="primary">
                            {drawerLabel}
                        </ListSubheader>
                    )}
                    {children && children}
                </Drawer>
            )}
        </React.Fragment>
    );
};

export default SwitchDrawer;
