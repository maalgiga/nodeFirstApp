var Application = function(){
    this._geoEnabled = false;
    this._localStorage = false;
    this._secciones = new Array();
    this._reportForm = null;
    this._currentItem = null;
    this._currentHour = 0; // Permite controlar el cambio de hora asi recargar la lista
    this._tocken = false;
    this._months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    // referencia circular a si mismo para
    // mantener el contexto de llamado
    // sin conflicto con el cambio
    // que hace jquery a la variable this
    var _self = this;

    this.init = function(){
      this.checkgeoData();
      this.checkLocalStorage();
      this._reportForm = $("[data-field]");
      // en Jquery no existe un metodo para .put o .delete
      // asi que extenderemos jquery para que tenga estos
      // metodos de ayuda.

      $.put = function(url, data, handler, type){
          return $.ajax(url,{
            "data":data,
            "dataType":type,
            "method":"PUT"
          }).done(handler);
      }
      $.delete = function(url, data, handler, type){
          //to implement
          return $.ajax(url,{
            "data":data,
            "dataType":type,
            "method":"DELETE"
          }).done(handler);
        }
    }


    //funciones para verificar compatibilidad de HTML5 API
    this.checkgeoData = function(){
      this._geoEnabled = navigator.geolocation && true;
    }

    this.checkLocalStorage = function(){
      this._localStorage = (typeof(Storage) !== "undefined");
    }

    //Manejadores del Tocken de acceso a la aplicación
    this.checkTocken = function(){
      var Tocken = _self.getTocken();
      if(Tocken){
        if(new Date(Tocken.expires) <= new Date()){
          _self.invalidateTocken();
          return false;
        }
      }else{
        _self.invalidateTocken();
        return false;
      }
      return Tocken.hashdata;
    }

    this.getTocken = function(){
      if(!_self._tocken){
        if(_self._localStorage && localStorage.tocken){
          _self._tocken = JSON.parse(localStorage.tocken);
            return _self._tocken;
        }
      }else{
        return _self._tocken;
      }

      return false
    }

    this.invalidateTocken = function(){
      _self._tocken = false;
      if(_self._localStorage && localStorage.tocken){
          localStorage.removeItem("tocken");
      }

    }

    //helpers
    this.redirectTo = function(pageid, options){
      var defaults = {"reverse":false,
                      "changeHash":false};
      $.extend(defaults, options);
      $( ":mobile-pagecontainer" ).pagecontainer( "change", "#"+pageid , defaults );
    }

    this.getApiDS = function(){
        return {"tocken": _self.checkTocken()};
    }

    //Api Consumers
    this.getTockenApi = function(){
      var ds = _self.getApiDS();
      ds.user = $("#UserName").val();
      ds.pinsec = $("#pinnumber").val(); //cambiar esto por el de un metodo de seguridad

      $.post("/api/getTocken",
        ds,
        function(data,successStr,xrh){
          _self._tocken = data;
          if(_self._localStorage){
            localStorage.setItem('tocken',JSON.stringify(data));
            _self.redirectTo("pag1",{"changeHash":true});
          }
        },
        "json"
      ).fail(function(xrh,failstr, error){
        console.log(error);
      });
    }

    this.loadSecciones = function(refresh){
      $.get(
        "/api/getSecciones",
        {},
        function(data, successStr, xrh){
          //console.log(data);
          _self._currentHour = new Date().getHours();
          var htmlstr = "";
          if(Array.isArray(data)){
            _self._secciones = data;
            for(var i =0 ; i<data.length;i++){
              var seccion = data[i];
              htmlstr += '<li><a href="#pag2" data_id="'+i+'">Edificio: '+seccion.Edificio+' Aula: '+seccion.Aula+'<p>'+seccion.NombreCurso+'</p>';
              if(seccion.NumeroReportes){
                htmlstr += '<span class="ui-li-count">' + seccion.NumeroReportes +'</span>';
              }
              htmlstr += '</a></li>';
            }
          }
          $("#pag1_lstScn").html(htmlstr)
            .listview((refresh)?"refresh":null)
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
        if(item.Reportes){
          var rptHtml = "";
          for(var i=0 ; i<item.Reportes.length; i++ ){
            var fecha = new Date(item.Reportes[i].FechaReporte);
            rptHtml += '<li data-icon="alert"><a href>'+ fecha.getDate() + ' / ' + _self._months[fecha.getMonth()] + ' / ' + fecha.getFullYear() +'</a></li>';
          }
          if(rptHtml!=""){
            rptHtml = '<li data-role="list-divider">Reportes</li>' + rptHtml;
            $("#lstReporte").html(rptHtml).listview((_self._currentItem)?"refresh":null);
          }
        }else{
          $("#lstReporte").html("");
        }
        _self._currentItem = item;
      }
    }

    this.loadSeccionByIndex = function(index){
      if( index < _self._secciones.length && index >= 0){
        return _self._secciones[index];
      }
      return null;
    }

    this.createReport = function(){
        var _id = _self._currentItem._id;
        $.put("/api/createReport/" + _id,
            {},
            function(data,successStr,xrh){
              alert("Reporte Creado");
              _self.redirectTo("pag1",{"changeHash":true, "reverse":true});
            },
            "json")
            .fail(function(xrh,failStr,error){
              alert("Error al Generar el Reporte.\n Vuelva a Intentar mas tarde.")
            });
    }
}

var app = new Application();
app.init();

$("#init").on("pagecreate", function(e){
    if(app.checkTocken()){
      $("#btnlogin").hide();
      setTimeout(function(){
        app.redirectTo("pag1",{"changeHash":true});
      }, 500);
    }
  });

$("#pag1").on("pagecreate", function(e){
    if(!app.checkTocken()){
      app.redirectTo("init");
    }
    app.loadSecciones();
    //Estableciendo al evento click del boton de crear reporte
    //La funcion que crea el reporte con la método PUT html
    $("#btnReportar").on("vclick", function(e){
      app.createReport();
    });
  }).on( "pagebeforeshow", function( e, ui ) {
    //Para recargar el listview
    if($(this).attr("data-loaded")=="1"){
      var hourComp = new Date().getHours();
      if(hourComp!= app._currentHour){
        app.loadSecciones(true);
      }
    }else{
      $(this).attr("data-loaded","1");
    }

});

$("#pag2").on("pagecreate", function(e){
  if(!app.checkTocken()){
    app.redirectTo("init");
  }
}).on("pagebeforeshow",function(e,ui){
  if(!app._currentItem){
    e.preventDefault();
    app.redirectTo("pag1",{"changeHash":true});
  }
});

$("#login").on("pagecreate", function(e){
  $("#btnlogon").on("vclick", function(e){
    app.getTockenApi();
  });
});
