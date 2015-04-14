// Ejemplo de como establecer una conexíon a MONGO DB
var mongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/uchMonitor";

mongoClient.connect(url,function(err, db){
    if(err){
      console.log("error");
    }else{
      console.log("hurra! Con Established!");
      console.log("Cargando documento Json con Usuarios");
      var jsonDocs = require("../resources/DatosUsuarios.json");
      console.log(jsonDocs.length);

      console.log("Obteniendo Coleccion secciones");
      var usuarios = db.collection("usuarios");

      usuarios.insert(jsonDocs,{w:1},function(err, records){
          console.log(records.length);
      });

    }
});
