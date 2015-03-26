var express = require('express');
var router = express.Router();

function api_router(db){
  /* TODO: Ruta para obtener el tocken de autorizacion */
  router.get('/getTocken',function(req,res,next){
      res.status(200).json({tocken:"whenthecatgoesouthtemicepartyallnight"});
    });
  // Ruta para extraer las aulas con clases en la hora y fecha del sistema
  router.get('/getSecciones', function(req, res, next){
    var secciones = db.collection("secciones");
    var date = new Date(), hour = date.getHours(), day = date.getDay();
    var query = {"Inicio":{"$gte": hour},
                 "Final" :{"$lte":hour + 1},
                 "$or":[{"Lns":(day==1)?1:false},
                        {"Mrt":(day==2)?1:false},
                        {"Mrc":(day==3)?1:false},
                        {"Jvs":(day==4)?1:false},
                        {"Vrn":(day==5)?1:false},
                        {"Sbd":(day==6)?1:false}
                       ]
                };

    //console.log(query);
    secciones.find(query).sort({"Aula":1}).toArray(function(err, docs){
      if(err) throw err;
      res.status(200).json(docs);
    })
  });
  return router;
}
module.exports = api_router;
