var express               = require("express"),
    passport              = require("passport"),
  /*  middleware = require("./middleware"),*/
    moment                = require("moment"),
    mongoose              = require("mongoose"),
    Country               = require("../models/countries"),
    Reservation           = require("../models/reservation"),
    ConfirmedReservation  = require("../models/confirmed-reservation"),
    User                  = require("../models/user"),
    Chofer                = require("../models/chofer"),
    Vehiculo              = require("../models/vehiculo"),
    pdf                   = require("pdfkit"),
    blobStream            = require("blob-stream"),
    fs                    = require("fs"),
    path                  = require("path"),
    router                = express.Router();
    


router.use(express.static(__dirname + "/public"));

//=========ADMIN ROUTES==============


router.get("/", function(req, res){  // add in the get route middleware.isLoggedIn, just using it for production 
    
    Reservation.find().sort({date: 1}).exec(function(err, allReservations){
       if(err){
           console.log(err);
       } 
        else {
            res.render("admin/tp-admin", {reservations: allReservations, moment: moment});
        }
    });
    
});

router.get("/agregar-reserva", function(req, res) {
      Country.find({}, function(err, Countries){
        if(err){
            console.log(err);
        } 
        else {
              res.render("admin/agregar-reserva", {countries: Countries});
        }
    });

});

router.post("/agregar-reserva", function(req, res){
    var firstName     = req.body.firstName,
        lastName      = req.body.lastName,
        email         = req.body.email,
        date          = req.body.date,
        startTime     = req.body.startTime,
        arrival       = req.body.arrival,
        hotelOrCruise = req.body.hotelOrCruise,
        vehicle       = req.body.vehicle,
        people        = req.body.people,
        country       = req.body.country,
        areaCode      = req.body.areaCode,
        cellphone     = req.body.cellphone,
        info          = req.body.info,
        requirements  = req.body.requirements,
        babySeat      = req.body.babySeat,
        estado        = "Por confirmar";
        
   var newReservation = { firstName: firstName, lastName: lastName, email: email, date: date, startTime: startTime,
                           arrival: arrival, hotelOrCruise: hotelOrCruise, vehicle: vehicle, people: people, 
                           country: country, areaCode: areaCode, cellphone: cellphone, info: info, 
                           requirements: requirements, babySeat: babySeat, estado: estado};
    Reservation.create(newReservation, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
           req.flash("success", "Reserva agregada con exito");
           return res.redirect("/tp-admin");
       }
    
    });
});

//=====================CANCELAR RESERVA===================================
router.delete("/:id", function(req, res){
    Reservation.findByIdAndRemove(req.params.id, function(err){
       if(err) {
           req.flash("error", "Hubo un error cancelando la reserva, porfavor contacta al administrador");
           res.redirect("/tp-admin");
       } 
       else {
           req.flash("success", "Reserva cancelada satisfactoriamente");
           res.redirect("/tp-admin");
       }
    });
});

router.get("/reservaciones-confirmadas", function(req, res) {
   ConfirmedReservation.find().sort({date: 1}).exec(function(err, allConfirmedReservations){
       if(err){
           console.log(err);
       } 
        else {
            res.render("admin/reservaciones-confirmadas", {confirmedReservations: allConfirmedReservations, moment: moment});
        }
    });
    
   
});

router.get("/reservaciones-confirmadas/:id/edit", function(req, res) {
   ConfirmedReservation.findById(req.params.id, function(err, foundReservation) {
    if(err) {
        console.log(err);
    }  else {
      res.render("admin/editar-reserva-confirmada", {confirmedReservation: foundReservation, moment:moment});  
    }
   });
    
});

router.put("/reservaciones-confirmadas/:id", function(req, res) {
   ConfirmedReservation.findByIdAndUpdate(req.params.id, req.body.confirmedReservation, function(err, updatedReservation){
       if(err) {
           console.log(err);
       } else {
           req.flash("success", "Reserva editada con éxito")
           res.redirect("/tp-admin/reservaciones-confirmadas");
       }
   });
});

router.delete("/reservaciones-confirmadas/:id", function(req, res) {
    ConfirmedReservation.findByIdAndRemove(req.params.id, function(err) {
       if(err) {
           console.log(err);
       } else {
           req.flash("success", "Reserva cancelada con éxito");
           res.redirect("/tp-admin/reservaciones-confirmadas");
       }
    });
});

router.get("/reservaciones-confirmadas/hoja-cliente/:name-:id", function(req, res) {
   ConfirmedReservation.findById(req.params.id, function(err, foundReservation){
       if(err){
           console.log(err);
       } else {
      
           
           var doc = new pdf;
           var stream = doc.pipe(blobStream());
           if(foundReservation.vehicle === "Car"){
               var charge = "107.00";
               var hourly = "25.00";
               var advance = "62.00";
           } else if(foundReservation.vehicle === "Regular Van") {
               var charge = "195.00";
               var hourly = "40.00";
               var advance = "100.00";
           } else if(foundReservation.vehicle === "xVan") {
               var charge = "220.00";
               var hourly = "45.00";
               var advance = "100.00";
           } else if(foundReservation.vechile ==="Larger Van"){
               var charge = "300.00";
               var hourly = "50.00";
               var advance = "100.00";
           }
           var confirmation = `PLEASE PRINT OUT OR BRING A COPY ON YOUR ANDROID, IPHONE, SMARTPHONE OR TABLET OF THIS CONFIRMATION`;
           var confirmationNumber = `CONFIRMATION NUMBER:${req.params.id.slice(-7).toUpperCase()}`;
           var title              = `Hello ${foundReservation.name},`
           
           if(foundReservation.salida === "International Pier") {
           var body               = `You are confirmed for a tour of Cozumel by Taxi (${foundReservation.vehicle}) on ${moment(foundReservation.date).format("dddd MMMM DD, YYYY")} starting at ${foundReservation.startTime} ship time

You are (MOST LIKELY!) docking at ${foundReservation.salida.toUpperCase()}; ${foundReservation.chofer} will be at the head of the taxi line, so look for a man with a sign with your name, wearing a yellow cap!

You are 99% for sure docking at the aforementioned ${foundReservation.salida}, but stuff happens so...

If you dock at PUNTA LANGOSTA PIER (downtown), ${foundReservation.chofer} will be waiting for you at the head of the taxi line in front of the Sr. Frogs bar/restaurant, which is directly across the street from the pier.

As you leave the pier, you will be obliged to take an escalator up to the 2nd floor of the mall (so the store owners get foot traffic). You have to make your way back to the ground floor again, but it's a small mall, you won't get lost. There is another taxi line at the back of the mall, but just ignore it ${foundReservation.chofer} is waiting for you in front of Sr. Frogs!

If you dock at Carnival's PUERTA MAYA PIER, ${foundReservation.chofer} is not allowed a sign there; he'll be at the head of the taxi line as you leave the pier shopping area.

Payment is due in cash (USD Dollars, Euros or Pesos) at the end of your tour, ${foundReservation.chofer} accepts cash only as he has no way of verifying a credit card

REMINDER: There is a USD $${charge}, 3 hour minimum charge for the tour + USD $${hourly} per each additional hour for the Tour... We received by PayPal the amount of USD $${advance} as an advance deposit and will be deducted from the balance at the end of the tour

Thanks... ${foundReservation.chofer} and Eduardo / My Cell in Cozumel 987-119-6398

IMPORTANT
For our tour services, we request a permit for your pick up at the pier from the Taxi union authority, so we cannot allow any more people in the vehicle than the ones the tour was reserved for (even if there's room in the vehicle for more). We cannot add more people in the vehicle without previous 48 hrs approval, as it is very possible that taxi union delegate at the pier will not allow them to board the vehicle for the tour.

We can refund the deposit in full with a written request by email, with at least two week notice. Within two weeks - 48 hours, a 50% refund will be given. All refunds will be effective 7 days after request. No refunds will be given if you cancel within 48 hours or for no-shows. Full refunds will be given in the event that your cruise ship does not make port.`
           } else if (foundReservation.salida === "Puerta Maya Pier") {
               var body = `You are confirmed for a tour of Cozumel by Taxi (${foundReservation.vehicle}) on ${moment(foundReservation.date).format("dddd MMMM DD, YYYY")} starting at ${foundReservation.startTime} ship time

You are (MOST LIKELY!) docking at ${foundReservation.salida.toUpperCase()}; ${foundReservation.chofer} will be at the head of the taxi line, so look for a man with a sign with your name, wearing a yellow cap!

    You are 99% for sure docking at the aforementioned ${foundReservation.salida.toUpperCase()}, but stuff happens so...
    
If you dock at Royal Caribbean's INTERNATIONAL PIER, Leo will be at the head of the taxi line with a sign with your name.

If you dock at PUNTA LANGOSTA PIER (downtown), ${foundReservation.chofer} will be waiting for you at the head of the taxi line in front of the Sr. Frogs bar/restaurant, which is directly across the street from the pier.

As you leave the pier, you will be obliged to take an escalator up to the 2nd floor of the mall (so the store owners get foot traffic). You have to make your way back to the ground floor again, but it's a small mall, you won't get lost. There is another taxi line at the back of the mall, but just ignore it ${foundReservation.chofer} is waiting for you in front of Sr. Frogs!


Payment is due in cash (USD Dollars, Euros or Pesos) at the end of your tour, ${foundReservation.chofer} accepts cash only as he has no way of verifying a credit card

REMINDER: There is a USD $${charge}, 3 hour minimum charge for the tour + USD $${hourly} per each additional hour for the Tour... We received by PayPal the amount of USD $${advance} as an advance deposit and will be deducted from the balance at the end of the tour

Thanks... ${foundReservation.chofer} and Eduardo / My Cell in Cozumel 987-119-6398

IMPORTANT

For our tour services, we request a permit for your pick up at the pier from the Taxi union authority, so we cannot allow any more people in the vehicle than the ones the tour was reserved for (even if there's room in the vehicle for more). We cannot add more people in the vehicle without previous 48 hrs approval, as it is very possible that taxi union delegate at the pier will not allow them to board the vehicle for the tour.

We can refund the deposit in full with a written request by email, with at least two week notice. Within two weeks - 48 hours, a 50% refund will be given. All refunds will be effective 7 days after request. No refunds will be given if you cancel within 48 hours or for no-shows. Full refunds will be given in the event that your cruise ship does not make port.`;
           } else if(foundReservation.salida === "Punta Langosta (DOWNTOWN)") {
                              var body = `You are confirmed for a tour of Cozumel by Taxi (${foundReservation.vehicle}) on ${moment(foundReservation.date).format("dddd MMMM DD, YYYY")} starting at ${foundReservation.startTime} ship time

You are (MOST LIKELY!) docking at ${foundReservation.salida.toUpperCase()}; ${foundReservation.chofer} will be waiting for you holding a sign with your name, wearing a yellow cap at the head of the taxi line in front of the Sr. Frogs bar/restaurant, which is directly across the street from the pier.
As you leave the pier, you will be obliged to take an escalator up to the 2nd floor of the mall (so the store owners get foot traffic). You have to make your way back to the ground floor again, but it's a small mall, you won't get lost. There is another taxi line at the back of the mall, but just ignore it ${foundReservation.chofer} is waiting for you in front of Sr. Frogs!

    You are 99% for sure docking at the aforementioned ${foundReservation.salida.toUpperCase()}, but stuff happens so...
    
If you dock at Royal Caribbean's INTERNATIONAL PIER, Leo will be at the head of the taxi line with a sign with your name.

If you dock at PUNTA LANGOSTA PIER (downtown), ${foundReservation.chofer} will be waiting for you at the head of the taxi line in front of the Sr. Frogs bar/restaurant, which is directly across the street from the pier.

Payment is due in cash (USD Dollars, Euros or Pesos) at the end of your tour, ${foundReservation.chofer} accepts cash only as he has no way of verifying a credit card

REMINDER: There is a USD $${charge}, 3 hour minimum charge for the tour + USD $${hourly} per each additional hour for the Tour... We received by PayPal the amount of USD $${advance} as an advance deposit and will be deducted from the balance at the end of the tour

Thanks... ${foundReservation.chofer} and Eduardo / My Cell in Cozumel 987-119-6398

IMPORTANT

For our tour services, we request a permit for your pick up at the pier from the Taxi union authority, so we cannot allow any more people in the vehicle than the ones the tour was reserved for (even if there's room in the vehicle for more). We cannot add more people in the vehicle without previous 48 hrs approval, as it is very possible that taxi union delegate at the pier will not allow them to board the vehicle for the tour.

We can refund the deposit in full with a written request by email, with at least two week notice. Within two weeks - 48 hours, a 50% refund will be given. All refunds will be effective 7 days after request. No refunds will be given if you cancel within 48 hours or for no-shows. Full refunds will be given in the event that your cruise ship does not make port.`;
           } else if (foundReservation.salida.slice(0,5) === "Hotel") {
                  var body = `You are confirmed for a tour of Cozumel by Taxi (${foundReservation.vehicle}) on ${moment(foundReservation.date).format("dddd MMMM DD, YYYY")} starting at ${foundReservation.startTime} Local Cozumel Time

${foundReservation.chofer} will meet you at ${foundReservation.salida} entrance main Lobby, he will be wearing a yellow cap.

Payment is due in cash (USD Dollars, Euros or Pesos) at the end of your tour, ${foundReservation.chofer} accepts cash only as he has no way of verifying a credit card

REMINDER: There is a USD $${charge}, 3 hour minimum charge for the tour + USD $${hourly} per each additional hour for the Tour... We received by PayPal the amount of USD $${advance} as an advance deposit and will be deducted from the balance at the end of the tour

Thanks... ${foundReservation.chofer} and Eduardo / My Cell in Cozumel 987-119-6398

IMPORTANT

For our tour services, we request a permit for your pick up at the pier from the Taxi union authority, so we cannot allow any more people in the vehicle than the ones the tour was reserved for (even if there's room in the vehicle for more). We cannot add more people in the vehicle without previous 48 hrs approval, as it is very possible that taxi union delegate at the pier will not allow them to board the vehicle for the tour.

We can refund the deposit in full with a written request by email, with at least two week notice. Within two weeks - 48 hours, a 50% refund will be given. All refunds will be effective 7 days after request. No refunds will be given if you cancel within 48 hours or for no-shows. Full refunds will be given in the event that your cruise ship does not make port.`;
               
           } else if (foundReservation.salida.slice(0,5) === "Ferry") {
                var body = `You are confirmed for a tour of Cozumel by Taxi (${foundReservation.vehicle}) on ${moment(foundReservation.date).format("dddd MMMM DD, YYYY")} starting at ${foundReservation.startTime} Local Cozumel Time
                
You will have to take the ${foundReservation.horarioFerry} ${foundReservation.salida}

${foundReservation.chofer} will meet you at the ferry pier under the swallow birds statue, so look for a man with a sign with your name wearing a yellow cap.

Payment is due in cash (USD Dollars, Euros or Pesos) at the end of your tour, ${foundReservation.chofer} accepts cash only as he has no way of verifying a credit card

REMINDER: There is a USD $${charge}, 3 hour minimum charge for the tour + USD $${hourly} per each additional hour for the Tour... We received by PayPal the amount of USD $${advance} as an advance deposit and will be deducted from the balance at the end of the tour

Thanks... ${foundReservation.chofer} and Eduardo / My Cell in Cozumel 987-119-6398

IMPORTANT

For our tour services, we request a permit for your pick up at the pier from the Taxi union authority, so we cannot allow any more people in the vehicle than the ones the tour was reserved for (even if there's room in the vehicle for more). We cannot add more people in the vehicle without previous 48 hrs approval, as it is very possible that taxi union delegate at the pier will not allow them to board the vehicle for the tour.

We can refund the deposit in full with a written request by email, with at least two week notice. Within two weeks - 48 hours, a 50% refund will be given. All refunds will be effective 7 days after request. No refunds will be given if you cancel within 48 hours or for no-shows. Full refunds will be given in the event that your cruise ship does not make port.`;
               
           }
        if(foundReservation.arrival === "Cruise") {
           doc.pipe(fs.createWriteStream(`public/hoja-cliente/${foundReservation.name}-${req.params.id.slice(-7).toUpperCase()}.pdf`));
   
              doc.image("public/assets/logo/logo.PNG",15,15, {
                  fit: [231,287],
                  scale: 0.65,
                  align: "left"
              })
               .font('Times-Roman', 10)
               .moveDown()
               .fillColor("red")
               .text(confirmation, 200, 50 , {
                 width: 300,
                 align: 'justify',
                 height: 300
               })
               .text(confirmationNumber, 200, 85)
               .fillColor("black")
               ;
               doc.font("Times-Roman", 15)
               .text(title, 60, 160)
               .fillColor("black");
               doc.font("Times-Roman", 12)
               .text(body.slice(0, body.indexOf("MOST")-1), 60, 180, {
                   continued: true,
                   align: "justify"
               })
               .fillColor("red")
               .text(body.slice(body.indexOf("MOST")-1,body.indexOf("MOST")+13),{
                   continued: true,
                   align: "justify"
               })
               .fillColor("black")
               .text(body.slice(body.indexOf("docking") - 1, body.indexOf("yellow cap")-1),{
                   continued: true,
                   align: "justify"
               })
               .fillColor("red")
               .text(body.slice(body.indexOf("yellow cap")-1,body.indexOf("yellow cap")+11),{
                    align: "justify",
                    continued: true
               });
               
               doc.fillColor("black")
               .text(body.slice(body.indexOf("yellow cap")+11, body.indexOf("There is a USD")-1),{
                   align: "justify"
                        })
               .fillColor("red")
               .text(body.slice(body.indexOf("There is a USD"),body.indexOf("end of the tour")+15),{
                   continued: true,
                   align: "justify"
               })
               .fillColor("black")
               .text(body.slice(body.indexOf("end of the tour")+15, body.indexOf("IMPORTANT")),{
                   align: "justify"
               })
               .fillColor("red")
               .text(body.slice(body.indexOf("IMPORTANT"), body.indexOf("IMPORTANT")+9),{
                   continued: true,
                   align: "justify"
               })
               .fillColor("black")
               .text(body.slice(body.indexOf("IMPORTANT")+9)
               );
               
            // end and display the document in the iframe to the right
           
            
            doc.end();
            res.contentType("application/pdf");
            doc.pipe(res);
            
            
        }  else if (foundReservation.arrival === "Hotel" || foundReservation.arrival === "Playa del Carmen") {
               doc.pipe(fs.createWriteStream(`public/hoja-cliente/${foundReservation.name}-${req.params.id.slice(-7).toUpperCase()}.pdf`));
   
              doc.image("public/assets/logo/logo.PNG",15,15, {
                  fit: [231,287],
                  scale: 0.65,
                  align: "left"
              })
               .font('Times-Roman', 10)
               .moveDown()
               .fillColor("red")
               .text(confirmation, 200, 50 , {
                 width: 300,
                 align: 'justify',
                 height: 300
               })
               .text(confirmationNumber, 200, 85)
               .fillColor("black")
               ;
               doc.font("Times-Roman", 15)
               .text(title, 60, 160)
               .fillColor("black");
               doc.font("Times-Roman", 12)
               .text(body.slice(0, body.indexOf("yellow cap")-1), 60, 180, {
                   continued: true,
                   align: "justify"
               })
               .fillColor("red")
               .text(body.slice(body.indexOf("yellow cap")-1,body.indexOf("yellow cap")+11),{
                    align: "justify",
                    continued: true
               });
               
               doc.fillColor("black")
               .text(body.slice(body.indexOf("yellow cap")+11, body.indexOf("There is a USD")-1),{
                   align: "justify"
                        })
               .fillColor("red")
               .text(body.slice(body.indexOf("There is a USD"),body.indexOf("end of the tour")+15),{
                   continued: true,
                   align: "justify"
               })
               .fillColor("black")
               .text(body.slice(body.indexOf("end of the tour")+15, body.indexOf("IMPORTANT")),{
                   align: "justify"
               })
               .fillColor("red")
               .text(body.slice(body.indexOf("IMPORTANT"), body.indexOf("IMPORTANT")+9),{
                   continued: true,
                   align: "justify"
               })
               .fillColor("black")
               .text(body.slice(body.indexOf("IMPORTANT")+9)
               );
               
            // end and display the document in the iframe to the right
           
            
            doc.end();
            
            res.contentType("application/pdf");
            doc.pipe(res);
        }        
          
       /*     var filePath = path.join(__dirname, `../public/pdf-files/${foundReservation.name}-${req.params.id}.pdf`);
           
           fs.ReadStream(filePath, function(err, data){
               if(err) {
                   console.log(err);
                   console.log(__dirname);
               } else {
              res.contentType("application/pdf");
              res.send(data); 
              console.log(filePath);
               }
           });*/
          
       }
   });
});

router.get("/reservaciones-confirmadas/hoja-chofer/:chofer-:id", function(req, res) {
    ConfirmedReservation.findById(req.params.id, function(err, foundReservation){
        if(err) {
            console.log(err);
        } else {
             var doc2 = new pdf;
                if(foundReservation.vehicle === "Car"){
               var charge = "107.00";
               var hourly = "25.00";
               var advance = "62.00";
           } else if(foundReservation.vehicle === "Regular Van") {
               var charge = "195.00";
               var hourly = "40.00";
               var advance = "100.00";
           } else if(foundReservation.vehicle === "xVan") {
               var charge = "220.00";
               var hourly = "45.00";
               var advance = "100.00";
           } else if(foundReservation.vechile ==="Larger Van"){
               var charge = "300.00";
               var hourly = "50.00";
               var advance = "100.00";
           }
           var body = `
Nombres:  ${foundReservation.name}
                   
Cel   ${foundReservation.celular}
                   
Fecha del servicio: ${moment(foundReservation.date).format("dddd MMMM DD, YYYY")}
                   
Tipo de servicio: ${foundReservation.vehicle}
                   
Pasajeros: ${foundReservation.people}
               
Hora de salida: ${foundReservation.startTime}
                   
Nombre del barco/hotel: ${foundReservation.salida}
                   
Deposito enviado:  $${advance}
               
Driver:  ${foundReservation.chofer}
                   
Comentarios: $${charge} + $${hourly} / son de ${foundReservation.country} / ${foundReservation.info}


           `
        var quality =   `
Excellent                Good              Medium               Not good                Very Bad 

Excelente                Bueno             Regular              Nada bueno              Pesimo 


Nombre/name ___________________________________________

Firma/sign  _____________________________________________

Fecha/date  _____________________________________________
        `
        var footer = `
Please do not forget to take all your belongings with you
Por favor, no se olvide de llevar todas sus pertenencias
        `
           doc2.pipe(fs.createWriteStream(`public/hoja-chofer/${foundReservation.chofer}-${req.params.id.slice(-7).toUpperCase()}.pdf`));
   
              doc2.image("public/assets/logo/logo.PNG",15,15, {
                  fit: [231,287],
                  scale: 0.65,
                  align: "left"
              })
               .font("Times-Roman", 15)
               .text("RESERVACION", 350, 75, {
                 width: 300,
                 align: 'justify',
                 height: 300
               });
               doc2.font("Times-Roman", 15)
               .text(body, 60, 160, {
                   align: "justify",
                   continued: true
               })
               .font("Times-Roman", 11)
               .text("How was your service? Como estuvo el servicio?",{
               
                   align: "left"
               })
               .text(quality, {
                   continued: true,
                   align: "justify"
               })
               .font("Times-Roman", 18)
               .text(footer)
              
              doc2.end();
              res.contentType("application/pdf");
              doc2.pipe(res);
           
             
        }
    });
});



router.get("/reservaciones-ejecutadas", function(req, res) {
     ConfirmedReservation.find().sort({date: 1}).exec(function(err, allConfirmedReservations){
       if(err){
           console.log(err);
       } 
        else {
            res.render("admin/reservaciones-ejecutadas", {confirmedReservations: allConfirmedReservations, moment: moment});
        }
    });
    
   
});

router.put("/ejecutar-reserva/:id", function(req, res) {
    ConfirmedReservation.findByIdAndUpdate(req.params.id, {$set: {estado: "Ejecutada"}}, function(err, raw){
        if(err) {
            console.log(err);
        } else {
         /*  req.flash("success", "Reserva ejecutada con exito");  */ 
           req.flash("success", "Reserva ejecutada con exito");
           res.redirect("/tp-admin/reservaciones-ejecutadas");
        }
    });
  
});
   
//=======================RUTAS PARA CHOFERES======================================
router.get("/choferes", function(req, res){
    Chofer.find().exec(function(err, allChofers){
        if(err){
            console.log(err);
        } else {
               res.render("admin/choferes", {choferes: allChofers}); 
        }
    });

});


router.get("/choferes/agregar", function(req, res) {
   res.render("admin/agregar-chofer"); 
});

router.post("/choferes", function(req, res){
    var newChofer = {
        nombre:     req.body.nombre,
        apellido:   req.body.apellido,
        email:      req.body.email
    }
    Chofer.create(newChofer, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
    
            req.flash("success", "Chofer agregado satisfactoriamente");
            res.redirect("/tp-admin/choferes");
        }
    });
});

router.get("/choferes/:id/edit", function(req, res) {
    Chofer.findById(req.params.id, function(err, foundChofer){
       if(err){
           console.log(err);
       } else {
           res.render("admin/edit-chofer", {chofer: foundChofer});
       }
    });
});

router.put("/choferes/:id", function(req, res) {
   Chofer.findByIdAndUpdate(req.params.id, req.body.chofer, function(err, updatedChofer){
     if(err){
         console.log(err);
     }  else{
            req.flash("success", "Chofer succesfully edited");
            res.redirect("/tp-admin/choferes");
     }
   });
});

router.delete("/choferes/:id", function(req, res){
   Chofer.findByIdAndRemove(req.params.id, function(err){
      if(err){
          console.log(err);
      } else {
            req.flash("success", "Chofer eliminado satisfactoriamente");
            res.redirect("/tp-admin/choferes");
      }
   });  
});


//=========================RUTAS PARA VEHICULOS=======================

router.get("/vehiculos", function(req, res) {
    Vehiculo.find().exec(function(err, allVehiculos){
      if(err){
          console.log(err);
      }  else {
             res.render("admin/vehiculos", {vehiculos: allVehiculos}); 
      }
    });  

});

router.get("/vehiculos/:id/edit", function(req, res){
   Vehiculo.findById(req.params.id, function(err, foundVehiculo){
       if(err){
           console.log(err);
       } else {
           res.render("admin/editar-vehiculo", {vehiculo: foundVehiculo});
       }
   }); 
});



//================RESERVATION DETAILS==============================
router.get("/:id", function(req, res) {
   Reservation.findById(req.params.id).exec(function(err, foundReservation){
      Chofer.find().sort({nombre: 1}).exec(function(err, allChofers){ 
       if(err) {
           console.log(err);
       } else {
           res.render("admin/reservation-details", {reservation: foundReservation, moment: moment, choferes: allChofers});
       }
   })}) ;
});

router.post("/:id", function(req, res) {
    var id            = req.body.id,
        name          = req.body.name,
        email         = req.body.email,
        date          = req.body.date,
        startTime     = req.body.startTime,
        arrival       = req.body.arrival,
        hotelOrCruise = req.body.hotelOrCruise,
        vehicle       = req.body.vehicle,
        people        = req.body.people,
        country       = req.body.country,
        celular       = req.body.celular,
        info          = req.body.info,
        requirements  = req.body.requirements,
        babySeat      = req.body.babySeat,
        chofer        = req.body.chofer,
        salida        = req.body.salida,
        horarioFerry  = req.body.horarioFerry,
        estado        = "Confirmada";
        
   var newConfirmedReservation = { id: id, name: name , email: email, date: date, startTime: startTime,
                           arrival: arrival, hotelOrCruise: hotelOrCruise, vehicle: vehicle, people: people, 
                           country: country, celular: celular , info: info,requirements: requirements, 
                           babySeat: babySeat, chofer: chofer, salida: salida, estado: estado, horarioFerry: horarioFerry};
    ConfirmedReservation.create(newConfirmedReservation, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
           Reservation.findByIdAndRemove(req.params.id,function(err){
               if(err){
                   console.log(err);
               } else {
                     req.flash("success", "Reserva confirmada con exito");
                     return res.redirect("/tp-admin/reservaciones-confirmadas");
               }
           });
         
       }
    
    });
});

//==============EDIT RESERVATION ======================================

router.get("/:id/edit", function(req, res) {
   Reservation.findById(req.params.id, function(err, foundReservation){
     res.render("admin/edit", {reservation: foundReservation, moment: moment});  
   });
});

router.put("/:id", function(req, res){
    //find and update the correct reservation
    
    Reservation.findByIdAndUpdate(req.params.id, req.body.reservation, function(err, updatedReservation){
       if(err){
           req.flash("error", "There was an error editing the reservation, please check the form and submit again");
           res.redirect("tp-admin/:id/edit");
       } else {
           req.flash("success", "Reservation succesfully edited");
           res.redirect("/tp-admin/" + req.params.id);
       }
    });
    //redirect show page
});



/* ============SE USO PARA CREAR 2 USUARIOS Y LUEGO DESHABILITAR===========

router.get("/register", function(req, res) {
   res.render("register"); 
});

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
   User.register(newUser , req.body.password, function(err, user){
      if(err) {
          req.flash("error", err.message);
          return res.redirect("/register");
          
      } 
      passport.authenticate("local")(req, res, function(){
          req.flash("success", "Welcome to YelpCamp " + user.username);
         res.redirect("/campgrounds"); 
      });
   });
});*/
 
    
    
module.exports = router;