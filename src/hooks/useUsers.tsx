import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import useFirebase from "./useFirebase";

interface Comment {
    id: number;
    creationTimeSeconds: number;
    commentatorHandle: string;
    locale: string;
    text: string;
    rating: number;
}
export interface User {
    handle: string;
    rating: number;
    titlePhoto: string;
    avatar: string;
    pastRating: number; //added on later
}
interface CFResponse<resultT> {
    status: "OK" | "FAILED";
    result: resultT;
}
interface ContestData {
    id: number;
    startTimeSeconds?: number;
}
interface RatingChange {
    handle: string;
    ratingUpdateTime: number;
    oldRating: number;
    newRating: number;
}

interface CFApiTypes {
    "blogEntry.comments": Comment[];
    "contest.list": ContestData[];
    "user.info": User[];
}

const fetchData = async <T extends keyof CFApiTypes>(
    method: T,
    data?: Record<string, unknown>
) => {
    let requestUrl = `https://codeforces.com/api/${method}`;
    if (data && Object.keys(data).length > 0) {
        requestUrl += "?";
        for (const [key, val] of Object.entries(data)) {
            requestUrl += `${key}=${val}&`;
        }
        requestUrl = requestUrl.slice(0, requestUrl.length - 1);
    }
    try {
        const response = (await axios(requestUrl)).data as CFResponse<
            CFApiTypes[T]
        >;
        if (response.status === "FAILED") {
            return [];
        }

        return response.result;
    } catch {
        return [];
    }
};

const useUsers = () => {
    const firebaseClient = useFirebase();
    const [userData, setUserData] = useState<User[] | undefined>(undefined);
    const getData = async () => {
        const userInitialRatings = await firebaseClient.getData("users");
        const userInfos = await fetchData("user.info", {
            handles: Object.keys(userInitialRatings)
                .map((val) => val.replaceAll("|", "."))
                .join(";"),
        });
        for (const user of userInfos) {
            if (user.rating === undefined) user.rating = -Infinity; //some users have apparently gotten such a low rating that they broke the CF api
            user.pastRating =
                userInitialRatings[user.handle.replaceAll(".", "|")];
        }
        userInfos?.sort(
            (a, b) => (b.rating - b.pastRating) - (a.rating - a.pastRating)
        );
        setUserData([...userInfos]);
    };
    useEffect(() => {
        getData();
    }, []);
    return { userData };
};
export default useUsers;
