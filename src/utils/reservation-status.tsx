import { IconType } from "../paca-ui/src/stories/atoms/icon/Icon";
import ReservationStatusObject from "../paca-ui/src/stories/utils/objects/ReservationStatus";

const statusDict = [
    {nameShow: "No seteado", name: "unset"},
    {nameShow: "Pendiente", name: "pending"},
    {nameShow: "Rechazada", name: "rejected"},
    {nameShow: "Aceptada", name: "accepted"},
    {nameShow: "Retirada", name: "retired"},
    {nameShow: "En curso", name: "started"},
    {nameShow: "Cerrada", name: "closed"},
];

export function getReservationStatusObject(statusNumber: number ): ReservationStatusObject {
    const icon = statusDict[statusNumber].name + "-status"
    const iconCasted = icon as IconType;
    return {
        number: statusNumber,
        name: statusDict[statusNumber].name,
        nameShow: statusDict[statusNumber].nameShow,
        icon: iconCasted,
    };
}