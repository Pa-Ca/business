import styleVariables from "../paca-ui/src/stories/assets/scss/variables.module.scss";

export const statusDict = [
    {name: "Pendiente", color: styleVariables.pendingStatus},
    {name: "Aceptada", color: styleVariables.acceptedStatus},
    {name: "Rechazada", color: styleVariables.rejectedStatus},
    {name: "Cerrada", color: styleVariables.closedStatus},
];