import { FirebaseApp, initializeApp } from "firebase/app";
import {
    Database,
    get,
    getDatabase,
    ref,
    runTransaction,
} from "firebase/database";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import React from "react";
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
interface firebaseContextData {
    database: Database | undefined;
    getData: (path: string) => Promise<unknown>;
}
const FirebaseContext = createContext<firebaseContextData>({
    database: undefined,
    getData: (x) => {
        return new Promise((re) => re);
    },
});

const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
    const [database, setDatabase] = useState<Database>();
    useEffect(() => { 
        const app = initializeApp(firebaseConfig);
        const database = getDatabase(app);
        setDatabase(database);
        runTransaction(ref(database, "views"), (viewCount) => viewCount + 1);
    }, []);

    const getData = async (path: string) => {
        if (!database) return {};
        return (await get(ref(database, path))).val() || {};
    };

    return (
        <FirebaseContext.Provider value={{ database, getData }}>
            {children}
        </FirebaseContext.Provider>
    );
};

export { FirebaseContext, FirebaseProvider };
