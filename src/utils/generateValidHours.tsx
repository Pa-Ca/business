import {LocalTime} from "../objects/branch/BranchDTO";

export default (hourIn: LocalTime, hourOut: LocalTime) => {
    const [hourInHour, hourInMinute] = hourIn.split(":").map(Number);
    const [hourOutHour, hourOutMinute] = hourOut.split(":").map(Number);

    let currentHour = hourInHour;
    let currentMinute = hourInMinute;
    let endHour = hourOutHour;
    let endMinute = hourOutMinute;

    if (currentMinute > 30) {
        currentHour += 1;
        currentMinute = 0;
    } else if (currentMinute > 0) {
        currentMinute = 30;
    }
    if (currentHour == 24) currentHour = 0

    if (endMinute > 30) {
    endHour += 1;
    endMinute = 0;
    } else if (endMinute > 0) {
    endMinute = 30;
    }
    if (endHour == 24) endHour = 0;

    const result = [];

    while (currentHour != endHour || currentMinute != endMinute) {
        result.push(`${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}:00`);
        currentMinute += 30;
        if (currentMinute === 60) {
            currentHour += 1;
            currentMinute = 0;
        }
        if (currentHour === 24) currentHour = 0;
    }
    return result;
}