import { User } from "../hooks/useUsers";
import React from "react";
import css from "../styles/userRow.module.css";
export const colorMappings = {
    "legendary grandmaster": "user-legendary",
    "international grandmaster": "user-legendary",
    grandmaster: "user-red",
    "international master": "user-orange",
    master: "user-orange",
    "candidate master": "user-violet",
    expert: "user-blue",
    specialist: "user-cyan",
    pupil: "user-green",
    newbie: "user-gray",
    unrated: "",
};
const UserRow = ({ userData }: { userData: User }) => {
    const delta = userData.rating - userData.pastRating;

    return (
        <div className={css.row}>
                <img className={css.avatar} src={userData.avatar} />
            <div className={css.user}>
                <a
                    className={colorMappings[userData.rank]}
                    href={`https://codeforces.com/profile/${userData.handle}`}
                >
                    {userData.handle}
                </a>
            </div>
            <div
                style={{
                    color: delta > 0 ? "green" : delta < 0 ? "red" : "gray",
                }}
            >
                {(delta > 0 ? "+" : "") + delta}
            </div>
        </div>
    );
};
export default UserRow;
