import { onValue, ref } from "firebase/database";
import { useContext } from "react";
import { useEffect, useState } from "react";
import { FirebaseContext } from "../context/FirebaseContext";

function millisecondsToStr(milliseconds: number) {
  function numberEnding(number: number) {
    return number > 1 ? "s" : "";
  }

  let temp = Math.floor(milliseconds / 1000);
  const years = Math.floor(temp / 31536000);
  if (years) {
    return "some time";
  }
  //TODO: Months! Maybe weeks?
  const days = Math.floor((temp %= 31536000) / 86400);
  if (days) {
    return days + " day" + numberEnding(days);
  }
  const hours = Math.floor((temp %= 86400) / 3600);
  if (hours) {
    return hours + " hour" + numberEnding(hours);
  }
  const minutes = Math.floor((temp %= 3600) / 60);
  if (minutes) {
    return minutes + " minute" + numberEnding(minutes);
  }
  const seconds = temp % 60;
  if (seconds) {
    return seconds + " second" + numberEnding(seconds);
  }
  return "less than a second"; //'just now' //or other string you like;
}
const useLastUpdate = () => {
  const [timeUpdated, setTimeUpdated] = useState(0);
  const [timeString, setTimeString] = useState("some time");
  const [iteration, setIteration] = useState(0);

  const { database } = useContext(FirebaseContext);
  useEffect(() => {
    if(!database){
      console.log("whaa");
      return;
    }
    onValue(ref(database, "lastUpdated"), (snapshot) => {
      setTimeUpdated(snapshot.val());
    });
  }, [database]);
  useEffect(() => {
    const id = setTimeout(() => {
      setTimeString(millisecondsToStr(new Date().getTime() - timeUpdated));
      setIteration(iteration + 1);
    }, 300);
    return () => clearTimeout(id);
  }, [iteration, timeUpdated]);
  return { timeString };
};
export default useLastUpdate;
