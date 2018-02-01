var express      = require("express"),
    passport     = require("passport"),
  /*  middleware = require("./middleware"),*/
    moment       = require("moment"),
    Reservation  = require("../models/reservation"),
    User         = require("../models/user"),
    Chofer       = require("../models/chofer"),
    Vehiculo     = require("../models/vehiculo"),
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
   res.render("admin/reservaciones-confirmadas"); 
});

//=======================RUTAS PARA CHOFERES======================================
router.get("/choferes", function(req, res){
    Chofer.find().exec(function(err, allChofers){
        if(err){
            console.log(err);
        } else {
               res.render("admin/choferes", {choferes: allChofers}); 
        }
    })

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
    })
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
 
    
    
module.exports = router;*/