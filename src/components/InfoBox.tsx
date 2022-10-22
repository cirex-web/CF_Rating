import useViews from "../hooks/useViews";
import React, { useEffect, useState } from "react";
import styles from "../styles/infoBox.module.css";
import useLastUpdate from "../hooks/useLastUpdate";
import Box from "./Box";
import { User } from "../hooks/useUsers";
import css from "../styles/infoBox.module.css";
const InfoBox = ({ userData: currentUser }: { userData?: User }) => {
  const { views } = useViews();
  const timeString = useLastUpdate();
  const [previousUser, setPreviousUser] = useState<User>();
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    console.log("ch");
    return () => {
      console.log(refreshKey);
      setPreviousUser(currentUser);
      setRefreshKey(refreshKey + 1);
    };
  }, [currentUser]);
  // console.log(refreshKey)
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
      {currentUser && (
        <Box padding={0}>
          <div
            className={css.imageExitContainer}
            key={currentUser.handle+"P"}
          >
            <img src={previousUser?.titlePhoto} className={css.userImage} />
          </div>
          <div className={css.imageEnterContainer} key={currentUser.handle}>
            <img src={currentUser.titlePhoto} className={css.userImage} />
          </div>
        </Box>
      )}
    </div>
  );
};
export default InfoBox;
// TODO: have there be another box below that shows individual stats when hovered
// TODO: historgram?
