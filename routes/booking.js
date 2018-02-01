

var express     = require("express"),
    router      = express.Router(),
    Country     = require("../models/countries"),
    Reservation = require("../models/reservation"),
    nodemailer  = require("nodemailer"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");
   



//==================BOOKING ROUTES================

router.get("/booking", function(req, res) {
    Country.find({}, function(err, Countries){
        if(err){
            console.log(err);
        } 
        else {
            res.render("booking", {countries: Countries});
        }
    })
    
});

router.get("/payment", function(req, res) {
   res.render("payment"); 
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
            user: process.env.GMAIL_ACCOUNT, // generated ethereal user
            pass: process.env.GMAIL_PASSWORD // generated ethereal password
        },
        tls:{
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: process.env.GMAIL_ACCOUNT, // sender address
        to:  "martin.carrascof@gmail.com",//process.env.RECEIVER,
        replyTo: req.body.email,// list of receivers
        subject: subject, // Subject line
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            req.flash("error", "There was an error submiting your reservation, please contact us directly at eduardoczm@gmail.com or try again");
            return res.redirect("booking");
        }
            else {
        
        return res.render("payment", {"success":"Your reservation was succesfully submited",
           info: req.body }
        );
            }
    });
}); 
       }
       
    });
        
  
    
 
});


module.exports = router;
