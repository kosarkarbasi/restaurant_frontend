import React from "react";
import SandGlass from '../assets/gif/hourglass.gif'
import Image from "../components/image/Image";
import {Stack} from "@mui/material";

const OrderDetail = () => {
    return (
        <div>
            {/*<Timer  pageBgColor='white' id={1} duration={10} started={true} paused={false} />*/}
            <Image address={SandGlass} height='30%' width='30%'></Image>
            <Stack>

            </Stack>
        </div>
    )
}

export default OrderDetail;