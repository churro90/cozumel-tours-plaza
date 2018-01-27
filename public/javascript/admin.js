
$('.confirm').click(function(e)
{
    if(confirm("Estás seguro?"))
    {
        alert('Reservacion cancelada');
    }
    else
    {
        e.preventDefault();
    }
});

$('.confirm-chofer').click(function(e)
{
    if(confirm("Estás seguro?"))
    {
        alert('Chofer eliminado');
    }
    else
    {
        e.preventDefault();
    }
});


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
       dateFormat: "DD MM d, yy"
     /*  minDate: datePlusTwo //Permite setear la fecha minima en 2 días más */
    }
    );

