import useUsers from "./hooks/useUsers";
import React from "react";
import Leaderboard from "./components/Leaderboard";
import useLastUpdate from "./hooks/useLastUpdate";
function App() {
    const { userData } = useUsers();
    const {timeString} = useLastUpdate();
    return (
        <>
            <h1>CF Leaderboard</h1>
            <h2>Last updated: {timeString} ago</h2>
            <Leaderboard userInfos={userData}></Leaderboard>
        </>
    );
}

export default App;
