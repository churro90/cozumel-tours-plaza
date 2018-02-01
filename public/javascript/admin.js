   //Get entire table
    var table = document.getElementById("data");
    
    //Get <td> with class date from table
    
    var reservas = table.querySelectorAll("tr.reserva");
    
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
       defaultDate: 0,
       dateFormat: "DD MM dd, yy"
     /*  minDate: datePlusTwo //Permite setear la fecha minima en 2 días más */
    }
    );

    //Get input 

$("#datepicker").on("change", function(){
    var filterValue = document.getElementById("datepicker").value;
 
    
    //loop through td-date list
    
    for(var i=0; i < reservas.length; i++){
        var date = reservas[i].getElementsByClassName("date")[0];
        //If matched
        if(date.innerHTML === filterValue){
              reservas[i].style.display = "";
        } else {
              reservas[i].style.display = "none";
        }
    }
   /* for(var i=0; i< reservas.length; i++){
        var date = reservas[i].getElementsByClassName("date")[0];
        if()
    }*/
});

$("#eliminar").on("click", function(){
   $("#datepicker").val("");
   for(var i=0; i<reservas.length; i++){
       reservas[i].style.display = "";
   }
});