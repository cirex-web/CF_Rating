import useUsers from "./hooks/useUsers";
import React, { useEffect, useState } from "react";
import Leaderboard from "./components/Leaderboard";
import useLastUpdate from "./hooks/useLastUpdate";
import css from "./styles/app.module.css";
import InfoBox from "./components/InfoBox";
function App() {
  const { userData } = useUsers();
  const [currentUser, setCurrentUser] = useState(0);

  return (
    <>
      <h1>CF Leaderboard</h1>
      <div className={css.content}>
        <Leaderboard
          userInfos={userData}
          setCurrentUser={setCurrentUser}
        ></Leaderboard>
        <InfoBox userData={userData?.[currentUser]} />
      </div>
    </>
  );
}

export default App;
