import { onValue, ref, runTransaction } from "firebase/database";
import { useContext, useEffect, useState } from "react";
import { FirebaseContext } from "../context/FirebaseContext";
const useViews = () => {
    const [views, setViews] = useState<number>(0);
    const { database } = useContext(FirebaseContext);

    useEffect(() => {
        if (!database) return;
        onValue(ref(database, "views"), (snapshot) => {
            setViews(snapshot.val());
        });
    }, [database]);

    return { views };
};
export default useViews;
