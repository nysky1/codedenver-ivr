exports.chooseDayFile = function chooseDayFile() {
    let fileName;
    let today = new Date();

    switch(today.getDay()) {
      case 1:
        fileName = 'monday.wav';
        break;
      case 2:
        fileName = 'tue.wav';
        break;
      case 3:
        fileName = 'wed.wav';
        break;
      case 4:
        fileName = 'thur.wav';
        break;
      case 5:
        fileName = 'fri.wav';
        break;
      default:
        fileName = 'error.wav';
    }
    return fileName;
};
function padZero(hours) {
  if (hours<10) {return '0' + hours};
  return hours;
}
exports.convertHourToUTC = function convertHourToUTC(today,mdtHours) {
  //Must be current date b/c of daylight savings adjustment, can't hardcode -6 or -7
  let now = new Date(today.getFullYear().toString() + '-' + (today.getMonth()+1) + '-' + (today.getDate()) + ' ' + padZero(mdtHours) + ':00:00 GMT')
  let utc =  now.getHours();
  return utc;
}
exports.convertHoursTo24Hour = function convertHoursTo24Hour(hour){
  if (hour < 24) {return hour} else {return hour-24};
}