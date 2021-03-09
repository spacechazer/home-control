import React, { useEffect, useRef, useState } from "react";
import iro from "@jaames/iro";

const IroColorPicker = (props: any) => {
    const [didMount, setDidMount] = useState<boolean>(false);
    const el = useRef<any>();

    useEffect(() => {
        if (!didMount) {
            setDidMount(true);
        }
        if (el && el.current && !didMount) {
            // create a new iro color picker and pass component props to it
            const colorPicker = iro.ColorPicker(el.current, {
                layout: [
                    {
                        component: iro.ui.Wheel,
                    },
                ],
                ...props,
            });
            // call onColorChange prop whenever the color changes
            colorPicker.on("color:change", (color: any) => {
                if (props.onColorChange) props.onColorChange(color);
            });
        }
    }, [el, props, didMount]);

    return (
        <React.Fragment>
            <div ref={el}></div>
        </React.Fragment>
    );
};
export default IroColorPicker;
