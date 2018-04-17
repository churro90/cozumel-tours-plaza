

var express               = require("express"),
    router                = express.Router(),
    Country               = require("../models/countries"),
    Reservation           = require("../models/reservation"),
    DisableDateCar        = require("../models/disableDateCar"),
    DisableDateVan        = require("../models/disableDateVan"),
    DisableDateXVan       = require("../models/disableDateXVan"),
    DisableDateLargerVan  = require("../models/disableDateLargerVan"),
    nodemailer            = require("nodemailer"),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose");
   



//==================BOOKING ROUTES================

router.get("/booking", function(req, res) {
    Country.find({}, function(err, Countries){
        if(err) { 
            console.log(err);
        } else {
      DisableDateCar.find({}, function(err, carDates){
       DisableDateVan.find({}, function(err, vanDates){
           DisableDateXVan.find({}, function(err, xVanDates){
               DisableDateLargerVan.find({}, function(err, largerVanDates){
              if(err){
            console.log(err);
        } else {
            var disableDateCar  = [];
            var disableDateVan  = [];
            var disableDateXVan = [];
            var disableDateLargerVan = [];
            carDates.forEach(function(date){ 
             disableDateCar.push(date.date); 
              }); 
            vanDates.forEach(function(date){ 
             disableDateVan.push(date.date); 
              }); 
            xVanDates.forEach(function(date){ 
             disableDateXVan.push(date.date); 
              }); 
            largerVanDates.forEach(function(date){ 
             disableDateLargerVan.push(date.date); 
              }); 
       
            res.render("booking", 
            {countries: Countries, 
            disableDateCar: disableDateCar,
            disableDateVan: disableDateVan,
            disableDateXVan:disableDateXVan,
            disableDateLargerVan:disableDateLargerVan
            });
        }
       });
   
    }); }); });
    
      }});
    
});

router.get("/payment", function(req, res) {
   var info = req.session.localVar;
   res.render("payment", {info: info}); 
});

router.post("/booking", function(req, res) {
      var output = `
     <h1> Tienes una nueva solicitud de reserva:</h1>
     <br>
     <h3>Detalles</h3>
     <ul>
        <li>Nombre: ${req.body.firstName} ${req.body.lastName} </li>
        <li>Email:  ${req.body.email} </li>
        <li>Fecha:  ${req.body.date} </li>
        <li>Hora:   ${req.body.startTime} </li>
        <li>Hotel or ship:  ${req.body.arrival} </li>
        <li>Crucero/Hotel:  ${req.body.hotelOrCruise} </li>
        <li>Tipo de servicio:  ${req.body.vehicle} </li>
        <li>Numero de personas:  ${req.body.people} </li>
        <li>Pais:  ${req.body.country} </li>
        <li>Celular:  ${req.body.areaCode}${req.body.cellphone}  </li>
        <li>Comentarios:  ${req.body.info} </li>
        <li>Requerimientos:  ${req.body.requirements} </li>
        <li>Item adicionales:  ${req.body.babySeat} </li>
    </ul>
    `;
    
    var subject = req.body.firstName + " " + req.body.lastName + " " + req.body.date + " NR";
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
    
    console.log(newReservation);
     nodemailer.createTestAccount((err, account) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "booking.toursplaza@gmail.com", // generated ethereal user
            pass: "mc17856904k" // generated ethereal password
        },
        tls:{
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: "booking.toursplaza@gmail.com", // sender address
        to:   "eduardoczm@gmail.com",  //"martin.carrascof@gmail.com", 
        replyTo: req.body.email,// list of receivers
        subject: subject, // Subject line
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            req.flash("error", "There was an error submiting your reservation, please contact us directly at eduardoczm@gmail.com or try again");
            return res.redirect("booking");
        }
            else {
        
        req.flash("success", "Your reservation was succesfully submited");
        req.session.localVar = req.body
        return res.redirect("payment");
            }
    });
}); 
       }
       
    });
        
  
    
 
});

router.get("/thanks", function(req, res) {
   var info = req.session.localVar;
   res.render("thanks", {info: info}); 
});

module.exports = router;
