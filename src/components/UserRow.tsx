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
const UserRow = ({
  userData,
  i,
  hover,
}: {
  userData: User;
  i: number;
  hover: () => void;
}) => {
  const delta = userData.rating - userData.pastRating;
  return (
    <div className={css.row} onMouseEnter={hover}>
      <p className={css.rank}>{"#" + (i + 1)}</p>
      <p className={css.user}>
        <a
          className={colorMappings[userData.rank]}
          href={`https://codeforces.com/profile/${userData.handle}`}
        >
          {userData.handle}
        </a>
      </p>
      <p
        style={{
          color: delta > 0 ? "green" : delta < 0 ? "red" : "gray",
        }}
      >
        {(delta > 0 ? "+" : "") + delta}
      </p>
    </div>
  );
};
export default UserRow;
