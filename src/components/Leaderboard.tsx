import React from "react";
import { User } from "../hooks/useUsers";
import Box from "./Box";
import UserRow from "./UserRow";
const styles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};
const Leaderboard = ({
  userInfos,
  setCurrentUser,
}: {
  userInfos: User[] | undefined;
  setCurrentUser: (i: number) => void;
}) => {
  return (
    <div style={{ flexGrow: 1 }}>
      <Box style={{ padding: 0 }}>
        {userInfos ? (
          userInfos.map((userData, i) => {
            new Image().src = userData.titlePhoto; //Preloading
            return (
              <UserRow
                userData={userData}
                i={i}
                hover={() => setCurrentUser(i)}
                key={i}
              />
            );
          })
        ) : (
          <h2 style={{marginLeft:"10px"}}>Loading...</h2>
        )}
      </Box>
    </div>
  );
};

export default React.memo(Leaderboard);
