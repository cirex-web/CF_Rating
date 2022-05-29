import { initializeApp } from "firebase/app";
import { get, getDatabase, ref } from "firebase/database";

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
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const getData = async (path: string) => {
        return (await get(ref(database, path))).val();
    };
    const getImportantOccurences =async (handle:string)=>{
        return (await ref(database,"contestData").order)
    }
    return {getData}
};
export default useFirebase;
