export default (time: string) => {
  if (!time || time.length === 0) return "00";
  else if (time.length === 1) return "0" + time;
  else return time;
};
