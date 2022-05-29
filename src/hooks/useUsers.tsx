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
interface userData {
    startRating: number;
    endRating: number;
    name: string;
    picURL: string;
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
    const [contests, setContests] = useState<
        Record<string, boolean> | undefined
    >(undefined);
    const [numProcessed, addNum] = useReducer((prev) => prev + 1, 0);
    useEffect(() => console.log(numProcessed), [numProcessed]);
    const getUsers = async () => {
        const res = await fetchData("blogEntry.comments", {
            blogEntryId: 98729,
        });
        if (!res.length) {
            return (await firebaseClient.getData("savedCommenters")) as Record<
                string,
                number
            >;
        }
        const user_map: Record<string, number> = {};
        res.forEach((val) => {
            val.commentatorHandle = val.commentatorHandle.replaceAll(".", "|");
            user_map[val.commentatorHandle] = Math.min(
                user_map[val.commentatorHandle] || Infinity,
                val.creationTimeSeconds
            );
        });
        return user_map;
    };
    const getHandleRatingChange = async (handle: string, startTime: number) => {
        const promises = [];
        console.log(await (firebaseClient.getData("")))
        for (const [contest, exists] of Object.entries(contests || {})) {
            if (!exists) continue;
            promises.push(
                firebaseClient.getData(`contestData/${contest}/${handle}`)
            );
        }
        let ratingChanges = (await Promise.all(promises)) as RatingChange[];

        ratingChanges = ratingChanges.filter(
            (item) => item && item.ratingUpdateTime >= startTime
        );
        if (!ratingChanges.length) return;
        ratingChanges.sort((a, b) => a.ratingUpdateTime - b.ratingUpdateTime);
        addNum();
        return {
            handle: handle,
            old: ratingChanges[0].oldRating,
            new: ratingChanges[ratingChanges.length - 1].newRating,
        };
    };
    const getData = async () => {
        const userMap = await getUsers();
        // console.log(userMap);
        // console.log(contests);
        const promises = [];
        for (const [handle, startTime] of Object.entries(userMap)) {
            promises.push(getHandleRatingChange(handle, startTime));
        }
        console.log(await Promise.all(promises));
    };
    useEffect(() => {
        if (contests !== undefined) {
            getData();
        }
    }, [contests]);
    useEffect(() => {
        firebaseClient.getData("savedContests").then((res) => setContests(res));
    }, []);
};
export default useUsers;
