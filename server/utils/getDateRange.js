function formatDate(date) {
  return date.toISOString().split("T")[0];
}
export  function getDateRange(option){

const now = new Date();
const DaysAgo = new Date();
DaysAgo.setDate(now.getDate() - option);

const fromdate = `${formatDate(DaysAgo)} 09:15`;
const todate = `${formatDate(now)} 15:30`;

console.log(fromdate,todate,"in getdaterange")

return {fromdate,todate}
}