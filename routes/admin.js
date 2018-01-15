var express      = require("express"),
    passport     = require("passport"),
  /*  middleware = require("./middleware"),*/
    moment       = require("moment"),
    Reservation  = require("../models/reservation"),
    User         = require("../models/user"),
    router       = express.Router();

router.use(express.static(__dirname + "/public"));

//=========ADMIN ROUTES==============


/*router.get("/", function(req, res){  // add in the get route middleware.isLoggedIn, just using it for production 
    
    Reservation.find().sort({date: 1}).exec(function(err, allReservations){
       if(err){
           console.log(err);
       } 
        else {
            res.render("admin/tp-admin", {reservations: allReservations, moment: moment});
        }
    });
    
});

router.get("/choferes", function(req, res){
   res.render("admin/choferes"); 
});

router.get("/vehiculos", function(req, res) {
   res.render("admin/vehiculos"); 
});


//================RESERVATION DETAILS==============================
router.get("/:id", function(req, res) {
   Reservation.findById(req.params.id).exec(function(err, foundReservation){
       if(err) {
           console.log(err);
       } else {
           res.render("admin/reservation-details", {reservation: foundReservation, moment: moment});
       }
   }) ;
});

//==============EDIT RESERVATION ======================================

router.get("/:id/edit", function(req, res) {
   Reservation.findById(req.params.id, function(err, foundReservation){
     res.render("admin/edit", {reservation: foundReservation, moment: moment});  
   });
});

router.put("/:id", function(req, res){
    //find and update the correct campground
    
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

*/

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