var Application = function(){
    this._geoEnabled = false;
    this._localStorage = false;
    this.init = function(){
      this.checkgeoData();
      this.checkLocalStorage();

    }
    this.checkgeoData = function(){
      this._geoEnabled = navigator.geolocation && true;
    }
    this.checkLocalStorage = function(){
      this._localStorage = (typeof(Storage) !== "undefined");
    }
    this.loadSecciones = function(){
      $.get(
        "/api/getSecciones",
        {},
        function(data, successStr, xrh){
          //console.log(data);
          var htmlstr = "";
          if(Array.isArray(data)){
            for(var i =0 ; i<data.length;i++){
              var seccion = data[i];
              htmlstr += '<li><a href data_id="'+seccion._id+'">Edificio: '+seccion.Edificio+' Aula: '+seccion.Aula+'<p>'+seccion.NombreCurso+'</p></a></li>';
            }
          }
          $("#pag1_lstScn").html(htmlstr).listview();
        },
        "json"
      ).fail(function(xrh, failStr, error){
        console.log(error);
      });
    }
}

var app = new Application();

$("#pag1").on("pagecreate", function(e){
    app.init();
    console.log("geocheck",app._geoEnabled);
    console.log("localcheck", app._localStorage);
    app.loadSecciones();
})
