import useUsers from "./hooks/useUsers";
import React from "react";
import Leaderboard from "./components/Leaderboard";
function App() {
    const { userData } = useUsers();

    return (
        <>
            <h1>CF Leaderboard</h1>
            <Leaderboard userInfos={userData}></Leaderboard>
        </>
    );
}

export default App;
