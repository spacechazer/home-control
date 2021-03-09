import React from "react";
import { Grid, ListSubheader, ListItem } from "@material-ui/core";
import IroColorPicker from "../IroColorPicker/IroColorPicker";
import { Drawer } from "../Drawer";

const ColorPicker = (props: any) => {
    const { open, onClose, light, color, sendColorRequest } = props;

    return (
        <Drawer open={open} onClose={onClose} keepMounted>
            <ListSubheader color="primary" disableGutters>
                {light.name}
            </ListSubheader>
            <ListItem disableGutters>
                <Grid container justify="center">
                    <Grid item>
                        <IroColorPicker
                            color={color}
                            onColorChange={sendColorRequest}
                            wheelLightness={false}
                        />
                    </Grid>
                </Grid>
            </ListItem>
        </Drawer>
    );
};

export default ColorPicker;
