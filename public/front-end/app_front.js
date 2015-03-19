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
}

var app = new Application();

$("#pag1").on("pagecreate", function(e){
    app.init();
    console.log("geocheck",app._geoEnabled);
    console.log("localcheck", app._localStorage);
})
