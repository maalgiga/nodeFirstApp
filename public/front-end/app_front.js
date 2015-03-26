var Application = function(){
    this._geoEnabled = false;
    this._localStorage = false;
    this._secciones = new Array();
    this._reportForm = null;
    this._currentItem = null;
    // referencia circular a si mismo para
    // mantener el contexto de llamado
    // sin conflicto con el cambio
    // que hace jquery a la variable this
    var _self = this;

    this.init = function(){
      this.checkgeoData();
      this.checkLocalStorage();
      this._reportForm = $("[data-field]");
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
            _self._secciones = data;
            for(var i =0 ; i<data.length;i++){
              var seccion = data[i];
              htmlstr += '<li><a href="#pag2" data_id="'+i+'">Edificio: '+seccion.Edificio+' Aula: '+seccion.Aula+'<p>'+seccion.NombreCurso+'</p></a></li>';
            }
          }
          $("#pag1_lstScn").html(htmlstr)
            .listview()
            .find("a")
            .click(function(e){
              var itemIndex = parseInt($(this).attr("data_id")),
                  item = _self.loadSeccionByIndex(itemIndex);
              _self.setItem(item);
            });
        },
        "json"
      ).fail(function(xrh, failStr, error){
        console.log(error);
      });
    }

    this.setItem = function(item){
      if(item && _self._reportForm){

        $.each(_self._reportForm, function(index,fieldObj){
          switch(fieldObj.id){
              case "Lns":
              case "Mrt":
              case "Mrc":
              case "Jvs":
              case "Vrn":
              case "Sbd":
                  fieldObj.style.fontWeight = (item[fieldObj.id] == 1)? "800":"400";
                  break;

              default:
                $(fieldObj).html(item[fieldObj.id]);
          }
        });
        _self._currentItem = item;
      }
    }
    this.loadSeccionByIndex = function(index){
      if( index < _self._secciones.length && index >= 0){
        return _self._secciones[index];
      }
      return null;
    }
}

var app = new Application();

$("#pag1").on("pagecreate", function(e){
    app.init();
    app.loadSecciones();
})
