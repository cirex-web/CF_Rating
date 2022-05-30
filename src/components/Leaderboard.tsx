import React from "react";
import { User } from "../hooks/useUsers";
import UserRow from "./UserRow";
const styles: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
};
const Leaderboard = ({ userInfos }: { userInfos: User[] | undefined }) => {
    return (
        <div>
            {userInfos ? (
                userInfos.map((userData, i) => (
                    <UserRow userData={userData} key={i} i={i} />
                ))
            ) : (
                <h2>Loading...</h2>
            )}
        </div>
    );
};

export default Leaderboard;
