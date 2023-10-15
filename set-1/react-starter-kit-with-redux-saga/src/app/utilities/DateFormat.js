export function convertDate(inputFormat) {
    const monthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUNE",
      "JULY",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    // function pad(s) {
    //   return s;
    // }
    var d = new Date(inputFormat);
  return [d.getDate(), monthNames[d.getMonth()], d.getFullYear()].join(
      " "
    );
  }