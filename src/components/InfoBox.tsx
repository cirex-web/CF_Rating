import useViews from "../hooks/useViews";
import React from "react";
import styles from "../styles/infoBox.module.css";
import useLastUpdate from "../hooks/useLastUpdate";
import Box from "./Box";
import { User } from "../hooks/useUsers";

const InfoBox = ({ userData }: { userData?: User }) => {
  const { views } = useViews();
  const timeString = useLastUpdate();
  return (
    <div
      style={{
        width: 250,
        position: "sticky",
        top: "30px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <Box>
        <h2>
          <b>Views:</b> {views}
        </h2>
        <h2>
          <b>Last updated:</b> {timeString} ago
        </h2>
      </Box>
      {userData && (
        <Box style={{ padding: 0 }}>
          <img
            src={userData.titlePhoto}
            style={{ width: "100%", verticalAlign: "bottom" }}
          />
        </Box>
      )}
    </div>
  );
};
export default InfoBox;
// TODO: have there be another box below that shows individual stats when hovered
