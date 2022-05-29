import { User } from "../hooks/useUsers";
import React from "react";
import css from "../styles/userRow.module.css";
const UserRow = ({ userData }: { userData: User }) => {
    const delta = userData.rating - userData.pastRating;
    return (
        <div className={css.row}>
            <div className={css.user}>
                <a href={`https://codeforces.com/profile/${userData.handle}`}>
                    {userData.handle}
                </a>
            </div>
            {(delta > 0 ? "+" : "") + delta}
        </div>
    );
};
export default UserRow;
