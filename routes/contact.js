var express    = require("express"),
    nodemailer = require("nodemailer"),
    router     = express.Router();

// =============CONTACT ROUTES==========
router.get("/contact", function(req, res){
   res.render("contact"); 
});

router.post("/contact", function(req, res){
    var subject= req.body.subject;
    var email = req.body.email;
    var output = `
     <h1> Tienes una nueva consulta:</h1>
     <br>
     <h3>Detalles del contacto</h3>
     <ul>
        <li>Nombre: ${req.body.name} </li>
        <li>Email:  ${req.body.email} </li>
    </ul>
    <h3>Mensaje</h3>
    <p> ${req.body.message}</p>
     </ul>
    `;
    
   

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
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
        to:   "eduardoczm@gmail.com",
        replyTo: email, // list of receivers
        subject: subject, // Subject line
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            req.flash("error", "There was an error submiting your form, please contact us directly at eduardoczm@gmail.com or try again");
            console.log(error);
            return res.redirect("contact");
        } else {
       
       req.flash("success", "Message sent successfully, we will get back to you as soon as possible");
       return res.redirect("contact");
        
        }
    });
});
});
    
module.exports = router;
