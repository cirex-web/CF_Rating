import useViews from "../hooks/useViews";
import React from "react";

const InfoBox = () => {
    const {views} = useViews();
    return <div>
        Views: {views}
    </div>
};
export default InfoBox;
