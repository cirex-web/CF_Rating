import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import axios from "axios";

// Const admin = require("firebase-admin");
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
    ratingUpdateTimeSeconds: number;
    oldRating: number;
    newRating: number;
}
interface Comment {
    commentatorHandle: string;
    creationTimeSeconds: number;
}
interface CFApiTypes {
    "blogEntry.comments": Comment[];
    "contest.list": ContestData[];
    "contest.ratingChanges": RatingChange[];
    "user.rating": RatingChange[];
}

interface ParsedRatingChange {
    newRating: number;
    oldRating: number;
    ratingUpdateTime: number;
}

admin.initializeApp();
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
        console.log(requestUrl);
        try {
            const response = (await stallPromise(axios(requestUrl), 2000))
                .data as CFResponse<CFApiTypes[T]>;
            if (response.status === "FAILED") {
                functions.logger.error(`fetch for ${requestUrl} failed!`);
                return [];
            }

            return response.result;
        } catch {
            return [];
        }
    },
    wait = (ms: number) => new Promise((re) => setTimeout(re, ms)),
    stallPromise = async <T>(promise: Promise<T>, ms: number) =>
        (await Promise.all([promise, wait(ms)]))[0],
    cleanHandle = (handle: string) => handle.replaceAll(".", "|"),
    _updateContests = async (all: boolean) => {
        // Resp.send(await admin.database().ref().remove());
        const alreadySavedContests =
                (await admin.database().ref("savedContests").get()).val() || {},
            earliestStartTime = 1641406054,
            allContests = await fetchData("contest.list"),
            promises: Promise<void>[] = [];
        console.log(allContests);
        let updatedContests = 0;
        for (const { id, startTimeSeconds } of allContests) {
            if (startTimeSeconds && startTimeSeconds >= earliestStartTime) {
                if (alreadySavedContests[id] === undefined || all) {
                    const ratingChanges = await fetchData(
                        "contest.ratingChanges",
                        { contestId: id }
                    );
                    if (ratingChanges.length > 0) {
                        const ratingChangesParsed: Record<
                            string,
                            ParsedRatingChange
                        > = {};
                        for (const change of ratingChanges) {
                            ratingChangesParsed[cleanHandle(change.handle)] = {
                                newRating: change.newRating,
                                oldRating: change.oldRating,
                                ratingUpdateTime:
                                    change.ratingUpdateTimeSeconds,
                            };
                        }
                        promises.push(
                            admin
                                .database()
                                .ref(`contestData/${id}`)
                                .set(ratingChangesParsed)
                        );
                        console.log(`contest ${id} succeeded!`);
                        updatedContests++;
                    } else {
                        console.log(`failed for contest ${id}`);
                    }
                    promises.push(
                        admin
                            .database()
                            .ref(`savedContests/${id}`)
                            .set(
                                alreadySavedContests[id] ||
                                    ratingChanges.length > 0
                            )
                    );
                }
            }
        }

        const userData = await fetchData("blogEntry.comments", {
                blogEntryId: 98729,
            }),
            userMap: { [user: string]: number } = {};
        if (userData.length > 0) {
            userData.forEach((val) => {
                userMap[cleanHandle(val.commentatorHandle)] = Math.min(
                    userMap[val.commentatorHandle] || Infinity,
                    val.creationTimeSeconds
                );
            });
            promises.push(admin.database().ref("savedCommenters").set(userMap));
        }
        promises.push(
            admin
                .database()
                .ref("lastUpdated")
                .set(+new Date())
        );
        await Promise.all(promises);
        // Resp.send(user_map);
        return updatedContests;
    },
    updateUsers = async () => {
        let commenters = await fetchData("blogEntry.comments", {
            blogEntryId: 98729,
        });
        commenters = commenters
            .sort((a, b) => {
                const v1 = a.commentatorHandle,
                    v2 = b.commentatorHandle;
                return v1 == v2 ? 0 : v1 > v2 ? 1 : -1;
            })
            .filter(function (item, i, ar) {
                return (
                    !i || item.commentatorHandle != ar[i - 1].commentatorHandle
                );
            });

        const existingData =
            (await admin.database().ref("users").get()).val() || {};

        // console.log(commenters);

        const promises = [];
        for (const comment of commenters) {
            if (
                existingData[cleanHandle(comment.commentatorHandle)] !== undefined &&
                new Date().valueOf() - comment.creationTimeSeconds * 1000 >
                    50 * 24 * 60 * 60 * 1000
            ) {
                console.log("skipped " + comment.commentatorHandle);
                continue;
            }
            const ratingChanges = await fetchData("user.rating", {
                handle: comment.commentatorHandle,
            });
            if (ratingChanges.length === 0) continue;
            ratingChanges.sort(
                (a, b) => a.ratingUpdateTimeSeconds - b.ratingUpdateTimeSeconds
            );

            let i = 0;
            while (
                i < ratingChanges.length &&
                ratingChanges[i].ratingUpdateTimeSeconds <
                    comment.creationTimeSeconds
            )
                i++;
            let prevRating = 0;
            if (i === ratingChanges.length) {
                prevRating = ratingChanges[i - 1].newRating;
            } else {
                prevRating = ratingChanges[i].oldRating;
            }

            promises.push(
                admin
                    .database()
                    .ref(`users/${cleanHandle(comment.commentatorHandle)}`)
                    .set(prevRating)
            );
        }
        await Promise.all(promises);
    },
    updateContests = functions
        .runWith({
            maxInstances: 1,
            timeoutSeconds: 540,
        })
        .https.onRequest(async (req, resp) => {
            const updatedContests = await _updateContests(false);
            resp.send({ updatedContests });
        });

exports.updateUsers = functions.https.onRequest(async (req, resp) => {
    await updateUsers();
    resp.send("OK :D");
});
exports.update = updateContests;
exports.updateAll = functions
    .runWith({ timeoutSeconds: 540 })
    .pubsub.schedule("every 30 minutes")
    .onRun(async (context) => {
        await _updateContests(true);
        return null;
    });
