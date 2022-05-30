import React from "react";
import useLastUpdate from "../hooks/useLastUpdate";
const Timer = () => {
    const { timeString } = useLastUpdate();
    return <h2>Last Updated: {timeString} ago</h2>;
};
export default Timer;
