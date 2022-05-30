import { FirebaseApp, initializeApp } from "firebase/app";
import { Database, get, getDatabase, ref } from "firebase/database";
import { useEffect, useState } from "react";

const firebaseConfig = {
    apiKey: "AIzaSyAKnhJvp7Zb0BHBkFIYzyjWwUnd4G4kmPs",
    authDomain: "cfleaderboard.firebaseapp.com",
    databaseURL: "https://cfleaderboard-default-rtdb.firebaseio.com",
    projectId: "cfleaderboard",
    storageBucket: "cfleaderboard.appspot.com",
    messagingSenderId: "808247267896",
    appId: "1:808247267896:web:9bef79b7f63209f5034ccd",
    measurementId: "G-3EB2DSH6PT",
};

const useFirebase = () => {
    const [app, setApp] = useState<FirebaseApp>();
    const [database, setDatabase] = useState<Database>();

    useEffect(() => {
        setApp(initializeApp(firebaseConfig));
        setDatabase(getDatabase(app));
    }, []);

    const getData = async (path: string) => {
        if (!database) return {};
        return (await get(ref(database, path))).val() || {};
    };
    return { database, getData };
};
export default useFirebase;
