import useUsers from "./hooks/useUsers";
import React, { useEffect } from "react";
import Leaderboard from "./components/Leaderboard";
import useLastUpdate from "./hooks/useLastUpdate";
import Timer from "./components/Timer";
import css from "./styles/app.module.css";
import InfoBox from "./components/InfoBox";
function App() {
  const { userData } = useUsers();
  return (
    <>
      <h1>CF Leaderboard</h1>
      <Timer />
      <div className={css.content}>
        <Leaderboard userInfos={userData}></Leaderboard>
        <InfoBox />
      </div>
    </>
  );
}

export default App;
