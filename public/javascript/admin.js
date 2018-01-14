var dateToday = new Date();




function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

var datePlusTwo = addDays(dateToday, 2);

/*setear el datepicker 2 dias hacia adelante*/
$("#datepicker").datepicker(
    {
       changeMonth: true,
       changeYear: true,
       defaultDate: +2,
       dateFormat: "DD MM d, yy",
       minDate: datePlusTwo
      
    }
    );
    

