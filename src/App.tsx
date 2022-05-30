import useUsers from "./hooks/useUsers";
import React from "react";
import Leaderboard from "./components/Leaderboard";
import useLastUpdate from "./hooks/useLastUpdate";
import Timer from "./components/Timer";
function App() {
    const { userData } = useUsers();
    return (
        <>
            <h1>CF Leaderboard</h1>
            <Timer />
            <Leaderboard userInfos={userData}></Leaderboard>
        </>
    );
}

export default App;
