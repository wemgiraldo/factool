
/*
 ┌──────────────────────────────────────────────────────┐
 │█┌──────────────────────────────────────────────────┐█│
 │█│  hig.js                                          │█│
 │█│                                                  │█│
 │█│  Higeco JS Framework.                            │█│
 │█│  JavaScript and Node utilities.                  │█│
 │█└──────────────────────────────────────────────────┘█│
 └──────────────────────────────────────────────────────┘
*/ 

(function(){

  // --------------------------
  // 
  // INIT
  // 
  // --------------------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var self = this;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Our Global Object
  /**
   * @class GWC.HigJS
   * Higeco JS Framework.         
   * JavaScript and Node utilities.
   */
  HigJS = {};

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    exports.HigJS = HigJS;
  }

  /**
   * HigJS Library version
   * @property
   */
  HigJS.VERSION = '0.0.1';

  HigJS.init = function(){
    // Array Remove - By John Resig (MIT Licensed)
    Array.prototype.remove = function(from, to) {
      var rest = this.slice((to || from) + 1 || this.length);
      this.length = from < 0 ? this.length + from : from;
      return this.push.apply(this, rest);
    };
  };

  HigJS.init();

  // --------------------------
  // 
  // HigJS FUNCTIONS
  // 
  // --------------------------



  // --------------------------
  // String Functions
  // --------------------------
  /**
   * String Functions
   * @class GWC.HigJS.str
   */
  HigJS.str = {};
  /**
   * String library version.
   * @property
   */
  HigJS.str.VERSION = '0.0.1';
  /**
   * Aggiunger un 'Padding' a sinistra della stringa, per portarla alla lunghezza desiderata.
   * @extends GWC.HigJS.str
   * 
   * @param  {String}   str   Stringa da allungare.
   * @param  {Number}  len   Lunghezza desiderata della stringa.
   * @param  {String}   pad   Carattere di riempimento.
   * @return {String} Ritorna la stringa con il padding impostato.
   */
  HigJS.str.padLeft =  function( str, len, pad ){
    pad = (pad && pad[0]) || ' ';
    str = String(str);
    while( str.length < len ){ str = pad + str; }
    return str;
  };
  /**
   * Aggiunger un 'Padding' a destra della stringa, per portarla alla lunghezza desiderata.
   * @extends GWC.HigJS.str
   * 
   * @param  {String}   str   Stringa da allungare.
   * @param  {Number}  len   Lunghezza desiderata della stringa.
   * @param  {String}   pad   Carattere di riempimento.
   * @return {String} Ritorna la stringa con il padding impostato.
   */
  HigJS.str.padRight =  function( str, len, pad ){
    pad = (pad && pad[0]) || ' ';
    str = String(str);
    while( str.length < len ){ str += pad; }
    return str;
  };
  /**
   * Trasforma una stringa json in un oggetto javascript.
   * @extends GWC.HigJS.str
   * 
   * @param {String}  str Stringa da trasformare.
   * @return {Object} Oggetto js. In caso di errore null.
   */
  HigJS.str.toObj = function( str ){
    try{ return JSON.parse(str);  }
    catch(e){ return null; }
  };

  HigJS.str.toObj2 = function( str ){
    try{ return JSON.parse(str) || str;  }
    catch(e){ return str; }
  };

  /**
   * Converts a string to lowercase letters.
   * @extends GWC.HigJS.str
   * 
   * @param {String}  str String to conver.
   * @return {String} Converted string.
   */
  HigJS.str.toLowerCase = function(str){
    return str && typeof str == "string" ? str.toLowerCase() : "";
  };

  /**
   * Converts a string to uppercase letters.
   * @extends GWC.HigJS.str
   * 
   * @param {String}  str String to conver.
   * @return {String} Converted string.
   */
  HigJS.str.toUpperCase = function(str){
    return str && typeof str == "string" ? str.toUpperCase() : "";
  };

  /**
   * Check if the first string contain the second.
   * @extends GWC.HigJS.str
   * 
   * @param {String}  str1 Main string.
   * @param {String}  str2 String to check.
   * @return {Boolean} True if the first string contain the second, otherwise false.
  */
  HigJS.str.containString = function(str1, str2){
    if(!str1 || !str2 || str1 == null || str2 == null) return false;
    return HigJS.str.toLowerCase(str1).indexOf(str2) >= 0 ? true : false;
  };

  /**
   * Remove illegal characters from file name string.
   * @extends GWC.HigJS.str
   * 
   * @param {String}  fileName File name.
   * @return {String} File name without illegal characters.
  */
  HigJS.str.cleanFileName = function(fileName){
    return fileName.replace( /[(){}%&#$`'=@<>:"\/\\|?*]+/g, '' ).replace( / /g, '_' );
  };

  /**
   * Replace all characters whith "" except numbers and letters.
   * @extends GWC.HigJS.str
   * 
   * @param {String}  str String.
   * @return {String} String without illegal characters.
  */
  HigJS.str.cleanString = function( str ) {
    str = str.replace( /\t/ , "");
    str = str.replace( /\n/ , "");
    str = str.replace( /\r/ , "");
    str = str.replace( /\b/ , "");
    str = str.replace( /\f/ , "");
    return str.replace( /[^a-zA-Z0-9]+$/ , "");
  };

  /**
  * Data una stringa controlla che sia un indirizzo ip V4.
  * @extends GWC.HigJS.str
  * 
  * @param {String}       ipaddr          Indirizzo ip.
  * @return {Boolean} Ritorna true se è un indirizzo ip, altrimenti false.
  */
  HigJS.str.validateIPAddress = function(ipaddr) {
    if(!ipaddr) return false;
    //Remember, this function will validate only Class C IP.
    //change to other IP Classes as you need
    ipaddr = ipaddr.replace( /\s/g, "") //remove spaces for checking
    var re = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/; //regex. check for digits and in
                                          //all 4 quadrants of the IP
    if (re.test(ipaddr)) {
        //split into units with dots "."
        var parts = ipaddr.split(".");
        //if the first unit/quadrant of the IP is zero
        if (parseInt(parseFloat(parts[0])) == 0) {
            return false;
        }
        if( parts.length != 4)
          return false;
        //if the fourth unit/quadrant of the IP is zero
        // if (parseInt(parseFloat(parts[3])) == 0) {
        //     return false;
        // }
        //if any part is greater than 256
        for (var i=0; i<parts.length; i++) {
            if (parseInt(parseFloat(parts[i])) > 256){
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
  };

  HigJS.str.removeSpaces = function ( str ){
    if( !str ) return "";
    typeof str != "string" && str.toString && ( str = str.toString() );
    return str.replace(/\s+/g, '');
  }

  HigJS.str.checkPkgVersion = function( pkgVer1, pkgVer2, equal ){
    if( !pkgVer1 ) return true;
    if( !pkgVer2 ) return false;

    if( equal && pkgVer1 === pkgVer2 )
      return true;
    
    var gwcVer = pkgVer1.split("."), i,
      srvVer = pkgVer2.split(".");
    
    for( i = 0; i < 3; i++ ){
      if( parseInt(gwcVer[i]) < parseInt(srvVer[i]) )
        return true;
      else if( parseInt(gwcVer[i]) > parseInt(srvVer[i]) )
        return false;
    }    
    return false;
  }

  /**
  * Rimpiazza un carattere in una stringa.
  * @extends GWC.HigJS.str
  * 
  * @param {String}       str          Stringa.
  * @param {Number}       index        Posizione in cui sostituire il carattere.
  * @param {String}       character    Carattere da inserire nella stringa.
  * @return {String} Ritorna la stringa modificata.
  */
  HigJS.str.replaceAt = function(str, index, character) {
    return str.substr(0, index) + character + str.substr(index+character.length);
  };

  HigJS.str.substring = function( str, from, to ){
    return typeof str === "string" ? str.substring(from, to) : str;
  };

  // --------------------------
  // Objects Functions
  // --------------------------
  /**
   * Objects Functions
   * @class GWC.HigJS.obj
   */
  HigJS.obj = {};
  /**
   * Object library version.
   * @property
   */
  HigJS.obj.VERSION = '0.0.1';
  /**
   * Trasforma un oggetto javascript in una stringa json.
   * https://github.com/vkiryukhin/jsonfn
   * @extends GWC.HigJS.obj
   * 
   * @param {Object}  obj Oggetto javascript da trasformare.
   * @return {String} Oggetto convertito a stringa. In caso di errore stringa vuota.
   */
  HigJS.obj.toString = function(obj) {
    try { return JSON.stringify(obj); }
    catch(e){ return ""; }
  };

  /**
   * Clona un oggetto js.
   * @extends GWC.HigJS.obj
   * 
   * @param {Object}  source  Oggetto javascript da clonare.
   * @return {Object} Oggetto javascript clonato.
   */
  HigJS.obj.clone = function( obj, scope ){
    return HigJS.str.toObj( HigJS.obj.toString( obj ), scope );
  };
  /**
   * Elimina i null da un oggetto. Può essere specificato un livello massimo di ricorsione.
   * @extends GWC.HigJS.obj
   * 
   * @param {Object}  source  Oggetto javascript dal quale rimuovere i null.
   */
  HigJS.obj.removeNulls = function( obj, recursion ){
    for( var k in obj ){
      if( obj[ k ] === null ){ delete obj[ k ]; }
      else if( typeof obj[ k ] === 'object' ){
        recursion && HigJS.obj.removeNulls( obj[ k ], --recursion );
      }
    }
  };

  /**
  * Extends 2 objects and if rec is true removes null fields.
  * @extends GWC.HigJS.obj
  * 
  * @param {Object}   obj1  Javascript destination object.
  * @param {Object}   obj2  Javascript source object.
  * @param {Number}   rec   If set removes null fields recursively "rec" times.
  * @return {Object} Extended object.
  */
  HigJS.obj.extendAdv = function( obj1, obj2, rec ){
    rec && HigJS.obj.removeNulls( obj2, rec );
    return HigJS.obj.extend(true, {}, obj1, obj2);
  };

  /**
   * Extends 2 or more objects. Code from jQuery 2.1.3.
   * @extends GWC.HigJS.obj
   * 
   * @param {Object}  source  Oggetto javascript dal quale rimuovere i null.
   * @return {Object} Extended object.
   */
  HigJS.obj.extend = function() {
    var options, name, src, copy, copyIsArray, clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;

    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
      deep = target;

      // Skip the boolean and the target
      target = arguments[ i ] || {};
      i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && !HigJS.type.isFunction(target) ) {
      target = {};
    }

    // Extend jQuery itself if only one argument is passed
    if ( i === length ) {
      target = this;
      i--;
    }

    for ( ; i < length; i++ ) {
      // Only deal with non-null/undefined values
      if ( (options = arguments[ i ]) != null ) {
        // Extend the base object
        for ( name in options ) {
          src = target[ name ];
          copy = options[ name ];

          // Prevent never-ending loop
          if ( target === copy ) {
            continue;
          }

          // Recurse if we're merging plain objects or arrays
          // HigJS.type._sysIsObject DA NON SOSTITUIRE CON HigJS.type.isObject o HigJS.type.isPlainObj
          if ( deep && copy && ( HigJS.type._sysIsObject(copy) || (copyIsArray = HigJS.type.isArray(copy)) ) ) {
            if ( copyIsArray ) {
              copyIsArray = false;
              clone = src && HigJS.type.isArray(src) ? src : [];

            } else { // HigJS.type._sysIsObject DA NON SOSTITUIRE CON HigJS.type.isObject o HigJS.type.isPlainObj
              clone = src && HigJS.type._sysIsObject(src) ? src : {};
            }

            // Never move original objects, clone them
            target[ name ] = HigJS.obj.extend( deep, clone, copy );

          // Don't bring in undefined values
          } else if ( copy !== undefined ) {
            target[ name ] = copy;
          }
        }
      }
    }

    // Return the modified object
    return target;
  };

  /**
   * Ordina un oggetto javascritp. Funzione completamente inutile!!!
   * @extends GWC.HigJS.obj
   * @ignore
   * 
   * @param {Object}    obj  Oggetto javascript da ordinare.
   * @param {Function}  obj  (optional) Funzione che ordina.
   * @return {Object} Oggetto ordinato.
   */
  HigJS.obj.sort = function( obj, func ){
    var i, key, sortable = [], newObj = {};

    for( key in obj )
      sortable.push([key, obj[key]])

    if( func )
      sortable.sort( func );
    else
      sortable.sort(function(a, b) { return a[1] - b[1] });

    for( i = 0; i < sortable.length; i++ )
      newObj[ sortable[i][0] ] = sortable[i][1];
    return newObj;
  };

  /**
   * Returns the size of a object
   * @extends GWC.HigJS.obj
   * 
   * @param {Object}       opt             Object
   * @return {Number} Object size.
   */
  HigJS.obj.objectSize = function( obj ){
    var size = 0, key;
    for (key in obj) {
      if ( obj.hasOwnProperty(key)  && typeof obj[key] !== "function" ) 
        size++;
    }
    return size;
  };


  // --------------------------
  // Numeric Functions
  // --------------------------
  /**
   * Number Functions
   * @class GWC.HigJS.num
   */
  HigJS.num = {};
  /**
   * Number library version.
   * @property
   */
  HigJS.num.VERSION = '0.0.1';
  /**
   * Dato un input controlla che sia un numero.
   * 
   * REGEX: /^(\-|)([1-9]\d{0,2}(\.\d{3})*|([0-9]\d*))(\.\d{0,20})?$/
   * 
   *  - Testa primo carattere se numerico, + o - (segno)
   *  - il resto del numero è composto da cifre e un solo punto o virgola
   *
   * @extends GWC.HigJS.num
   * @param {Object}       opt             Oggetto di configurazione. oppure numero da testare
   * @param {Object}       [opt.val]       Se opt è un oggetto, qui metto il valore numerico da verificare
   * @return {Number|Boolean} Ritorna il numero (in formato stringa) con il punto (se decimale).
   */
  HigJS.num.isNum = function( opt ){
    if( typeof opt === 'undefined' || opt === null ){ return false; }  
    if( typeof opt === 'object' ){
      if( opt.val === null || typeof opt.val === "undefined"){ return false; }
      else{ val = opt.val; }
    }
    else{ val = opt; }
    
    if( val === false || val === true ){ return false; }
    if( typeof val !== "string" ){ val = val.toString() }

    val = val.replace(',','.').replace(/ /g,'');

    if( val === 0 || val === "0" ) return val;
    
    // var validNum = /^-?(\d+.?\d*)$|(\d*.?\d+)\g$/;
    var validNum = /^(\-|)([1-9]\d{0,2}(\.\d{3})*|([0-9]\d*))(\.\d{0,20})?$/;
    if( validNum.test(val) ){ return val; }
    
    return false;
  };
  /**
   * Verifica se il numero è un intero
   * @extends GWC.HigJS.num
   * 
   * @param  {Number}  n Valore da verificare se è un numero intero oppure no.
   * @return {Boolean}  true se il numero è un intero
   */
  HigJS.num.isInt = function( n ){ return n % 1 === 0; };

   /**
   * Genera una numero random.
   * @extends GWC.HigJS.num
   * 
   * @param {Object}      opt     Oggetto di configurazione.
   * @param {Number}      opt.max Valore massimo del numero random. Default 1000.
   * @return {Number} Numero casuale.
   */
  HigJS.num.genNum = function( opt ){
    !opt && ( opt = { max: 1000 } );
    return Math.floor(Math.random()*(opt.max+1));
  };

  /**
  * Change number size and set a new unit if the size is bigger than the size specified.
  * @extends GWC.HigJS.num
  * 
  * @param {Object}       opt             Configuration object.
  * @param {Object}       opt.value       Value.
  * @param {Object}       opt.um          Unit.
  * @param {Object}       opt.numLength   Maximum number length.
  * return {Object}       New number and new unit.
  */
  HigJS.num.autoSizeNum = function( opt ){
    // try {
      var units = [
        { sym: "", molt: 1, nDec: 1, nextSym: "k" },
        { sym: "k", molt: 1000, nDec: 1, nextSym: "M" },
        { sym: "M", molt: 1000000, nDec: 2, nextSym: "G" },
        { sym: "G", molt: 1000000000, nDec: 2, nextSym: "T" },
        { sym: "T", molt: 1000000000000, nDec: 2 }
      ], i, unitsObj = { "": units[0], k: units[1], M: units[2], G: units[3], T: units[4] }, originalValue = opt.value,
        nDecObj = opt.nDec;

      // Controllo che nDec sia un valore o un oggetto del tipo { "k": 1, "M": 2 }
      if( opt.nDecObj ){
        nDecObj = opt.nDecObj;
      }

      if( HigJS.type.isNumber( nDecObj ) ){
        for( i = 0; i < units.length; i++ ){
          units[i].nDec = nDecObj;
        }
      } else if( nDecObj ) {
        for( i = 0; i < units.length; i++ ){
          typeof nDecObj[ units[i].sym ] !== "undefined" && ( units[i].nDec = nDecObj[ units[i].sym ] );
        }
      }

      opt.value = parseFloat( opt.value ).toFixed( unitsObj[opt.um[0]] && unitsObj[opt.um[0]].nDec ? unitsObj[opt.um[0]].nDec : unitsObj[""].nDec );

      if( opt.value.length < opt.numLength ){
        return opt;
      } else {
        opt.value = HigJS.num.toString( originalValue );
      }

      // var counter = 0, i;
      while( opt.value.length > opt.numLength ){
        if( !unitsObj[opt.um[0]] ){
          opt.um = "k" + opt.um;
        } else if( unitsObj[opt.um[0]].nextSym ){
          opt.um = HigJS.str.replaceAt( opt.um, 0, unitsObj[opt.um[0]].nextSym );
        } else {
          return opt;
        }
        opt.value = ( parseFloat( opt.value ) / 1000 ).toFixed( unitsObj[opt.um[0]] && unitsObj[opt.um[0]].nDec ? unitsObj[opt.um[0]].nDec : unitsObj[""].nDec );

        // if( !unitsObj[opt.um[0]] ){
        //   opt.um = "k" + opt.um;
        // } else if( unitsObj[opt.um[0]].nextSym ){
        //   opt.um = HigJS.str.replaceAt( opt.um, 0, unitsObj[opt.um[0]].nextSym );
        // } else {
        //   return opt;
        // }
        // counter++;
      }

      return opt;
    // } catch( e ){
    //   return opt;
    // }
    
    // opt.value = parseFloat( opt.value ).toFixed( opt.nDec || 1 );
    // opt.value = opt.value.toString();

    // if( opt.value.length < opt.numLength ) 
    //   return opt;

    // var counter = 0, i;
    // while( opt.value.length > opt.numLength ){
    //   opt.value = ( parseFloat( opt.value ) / 1000 ).toFixed( opt.nDec || 1 ).toString();
    //   counter++;
    // }

    // for( i = 0; i < units.length; i++){
    //   if( opt.um[0] === units[i].sym ){
    //     opt.um = opt.um.replace( opt.um[0], units[i+counter].sym );
    //     return opt;
    //   }
    // }

    // // Nel caso non sia riuscito ad interpretare l'unità di misura ritorno la stessa.
    // if( i >= units.length ){
    //   opt.um = counter ? units[(counter-1)].sym + opt.um : opt.um;
    //   return opt;
    // }

    // opt.um = opt.um.replace( opt.um[0], units[i+counter].sym );
    // return opt;
  };

  /**
   * Converte un decimale in un esadecimale
   * @extends GWC.HigJS.num
   * 
   * @param  {Number}  d Decimale.
   * @return {String}  Valore esadecimale.
   */
  HigJS.num.dec2hex = function( d ){ return d.toString(16); };
  /**
   * Converte un esadecimale in un decimale
   * @extends GWC.HigJS.num
   * 
   * @param  {String}  d Decimale.
   * @return {Number}  Valore decimale.
   */
  HigJS.num.hex2dec = function( h ){ return parseInt(h,16); };
  HigJS.num.toString = function( num ){ try{ return num.toString(); } catch(e) { return ""; } }

  /**
   * @function
   * @description Converte un valore esadecimale in un binario.
   * @param {string}      h       Stringa in esadecimale.
   * @return Stringa binaria composta da 16 cifre.
   */
  HigJS.num.hex2bin = function (h,opt) {
    if(h == null || isNaN("0x"+h))
      return [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
    
    if(typeof h == "number")
      h = h.toString();
    h = parseInt(h,16);
    h = h.toString(2);
    while(h.length < 15)
      h = "0".concat(h);
    if(opt == 1){
      var h1 = new Array();
      for(var i = 0; i < h.length; i++){
        h1[i] = parseInt(h[i]);
      }
      return h1;
    }
    return h;
  }


  // --------------------------
  // Array Functions
  // --------------------------
  /**
   * Array Functions
   * @class GWC.HigJS.array
   */
  HigJS.array = {};
  /**
   * Array library version.
   * @property
   */
  HigJS.array.VERSION = '0.0.1';
  /**
   * Clona un Array js.
   * @extends GWC.HigJS.array
   * 
   * @param {Array}  source  Array javascript da clonare.
   * @return {Array} Array javascript clonato.
   */
  HigJS.array.clone = function( array ){ return array.slice(0); };

  /**
   * Concatena due array senza creare in memoria un'ulteriore copia.
   * @extends GWC.HigJS.array
   * 
   * @param {Array}  a  Array in cui viene concatenato l'altro array.
   * @param {Array}  b  Array da concatenare.
   */
  HigJS.array.merge = function( a, b ){ 
    if( a.reduce ){
      a = b.reduce( function(coll,item){
          coll.push( item );
          return coll;
      }, a );
    } else {
      a.push.apply( a, b );
    }
  };


  // --------------------------
  // Type Functions
  // --------------------------
  /**
   * Type's Functions
   * @class GWC.HigJS.type
   */
  HigJS.type = {};
  /**
   * Type library version.
   * @property
   */
  HigJS.type.VERSION = '0.0.1';
  /**
   * Controlla che l'input sia una funzione.
   * @extends GWC.HigJS.type
   * 
   * @param  {Function}  target Target da controllare.
   * @return {Number}  Valore decimale.
   */
  HigJS.type.isFunction = function( target ){ return typeof target === "function"         ? true  : false ;};
  /**
   * Controlla che l'input sia un numero.
   * @extends GWC.HigJS.type
   * 
   * @param  {Number}  target Target da controllare.
   * @return {Boolean} True se il tipo è corretto, altrimenti false.
   */
  HigJS.type.isNumber   = function( target ){ return HigJS.num.isNum( target ) === false  ? false : true  ;};
  /**
   * Controlla che l'input sia un array.
   * @extends GWC.HigJS.type
   * 
   * @param  {Array}  target Target da controllare.
   * @return {Boolean} True se il tipo è corretto, altrimenti false.
   */
  HigJS.type.isArray    = function( target ){ return target && Array.isArray(target)      ? true  : false ;};
  /**
   * Controlla che l'input sia una stringa.
   * @extends GWC.HigJS.type
   * 
   * @param  {String}  target Target da controllare.
   * @return {Boolean} True se il tipo è corretto, altrimenti false.
   */
  HigJS.type.isString   = function( target ){ return typeof target === "string"           ? true  : false ;};
  
  HigJS.type.isPlainObj = function( target ){
    return ( target && typeof target === "object" && !Array.isArray( target ) && Object.prototype.toString.call(target) === "[object Object]" ) ? true : false;
  };
  /**
   * Controlla che l'input sia un oggetto javascript.
   * Sono validi oggetti con diverso costruttore
   * @extends GWC.HigJS.type
   * 
   * @param  {Object}  target Target da controllare.
   * @return {Boolean} True se il tipo è corretto, altrimenti false.
   */
  HigJS.type.isObject  = function( target ){
    return ( target && typeof target === "object" && !Array.isArray( target ) && typeof target.lookupNamespaceURI !== "function" ) ? true : false;
  };

  // Utilizzata esclusivamente in HigJS.obj.extend(). DA NON SOSTITUIRE CON HigJS.type.isObject o HigJS.type.isPlainObj
  HigJS.type._sysIsObject = function( target ){
    if( !target || typeof target !== "object" || target === target.window ){ return false; }
    if( !( target.constructor && target.constructor === Object ) ){ return false; }

    return true;
  };
  /**
   * Controlla che l'input sia un oggetto del DOM.
   * @extends GWC.HigJS.type
   * 
   * @param  {Object}  target Target da controllare.
   * @return {Number}  True se il tipo è corretto, altrimenti false.
   */
  HigJS.type.isDOM      = function( target ){ return (target && typeof target.lookupNamespaceURI === "function" ) ? true : false };


  // --------------------------
  // Debug Functions
  // --------------------------
  /**
   * Debug Functions and Settings.
   * @class GWC.HigJS.debug
   */
  HigJS.debug = {};

  /**
   * Debug library version.
   * @property
   */
  HigJS.debug.VERSION = '0.0.1';
  /**
   * Debug status, if true enable debug functions.
   * @property
   */
  HigJS.debug.enable = false;

  /**
   * Prints a string only if debug is enabled.
   * @extends GWC.HigJS.debug
   * 
   * @param {String} txt String to be printed
   */
  HigJS.debug.print = function( txt ){
    HigJS.debug.enable && console.log( txt );
  };

  /**
   * Alias for print.
   * @extends GWC.HigJS.debug
   * 
   * @param {String} txt String to be printed.
   */
  HigJS.debug.log = HigJS.debug.print;


  /**
   * Prints an error only if debug is enabled.
   * @extends GWC.HigJS.debug
   * 
   * @param {String} txt Error String
   */
  HigJS.debug.error = function( txt ){
    HigJS.debug.enable && console.error( txt );
  };

  // --------------------------
  // Date Functions
  // --------------------------
  /**
   * Date tools.
   * @class GWC.HigJS.date
   */
  HigJS.date = {};

  /**
   * Date library version.
   * @property
   */
  HigJS.date.VERSION = '0.0.1';

  /**
   * Numbers of day in a Month.
   * @extends GWC.HigJS.date
   * 
   * @param {Number} month Month.
   * @param {Number} year Year.
   * @return {Number} Number of days.
   */
  HigJS.date.daysInMonth = function( month, year ){
    return (new Date(year, month+1, 0)).getDate()+1;
  };

  HigJS.date.daysInMonth2 = function( month, year ){
    return (new Date(year, month, 0)).getDate();
  };
  /**
   * Numbers of day in a year.
   * @extends GWC.HigJS.date
   * 
   * @param {Number} year Year.
   * @return {Number} Number of days.
   */
  HigJS.date.daysInYear = function( year ){
    return HigJS.date.isLeapYear(year) ? 366 : 365;
  };
  /**
   * Is leap year? (bisestile).
   * @extends GWC.HigJS.date
   * 
   * @param {Number} year Year.
   * @return {Number} True || false.
   */
  HigJS.date.isLeapYear = function(year) {
    return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
  };

  /**
   * Week number of a specific day - month - year
   * @extends GWC.HigJS.date
   *
   * @param {Number} year Year.
   * @param {Number} month Month.
   * @param {Number} day Day.
   * @return {Number} Week number.
   */
  HigJS.date.weekNumber = function( year, month, day ){
    var d = new Date( year, month, day );
    d.setHours(0,0,0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(),0,1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return weekNo;
  };

  /**
   * Returns the Date object for a specific year-week-date
   *
   *  - Date starts from 1 to 7
   *   - Week starts from 1
   * @extends GWC.HigJS.date
   *
   * @param {Number} year Year.
   * @param {Number} week Month.
   * @param {Number} date Day.
   * @return {Object} Date object.
   */
  HigJS.date.weeksToDate = function(year, week, date) {
    year = parseInt(year); week = parseInt(week); date = parseInt(date);
    var simple = new Date(year, 0, (week - 1) * 7);
    if( simple.getDay() < 4 )
        simple.setDate(simple.getDate() - simple.getDay() + date);
    else
        simple.setDate(simple.getDate() + 7 - simple.getDay() + date);
    return simple;
  };

  HigJS.date.getTodayDate = function( offset ){
    !offset && ( offset = 0 );
    return HigJS.num.formatDate({ utc: parseInt((new Date()).getTime()/1000)+(offset*86400), date: true, time: false });
  };

  HigJS.date.getYesterdayDate = function(){
    var now = new Date();
    return HigJS.num.formatDate({ utc: parseInt((new Date( now.getFullYear(), now.getMonth(), now.getDate()-1,now.getHours(),0,0 )).getTime()/1000), date: true, time: false });
  };

  HigJS.date.getTimeIntervalMil = function( str ){
    var interval = [ 0, 0 ], now = new Date();
    if( str == "today" ){
      interval = [
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),0,0,0),
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),23, 59, 59)
      ];
    } else if( str == "last24" ){
      interval[1] = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
      interval[0] = interval[1] - 86400000;
    } else if( str == "lastWeek" ) {
      interval[1] = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
      interval[0] = interval[1] - 604800000;
    } else if( str == "lastMonth" ) {
      interval[1] = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
      interval[0] = interval[1] - 2592000000;
    } else if( str == "currentMonth"){
      interval[0] = Date.UTC(now.getFullYear(), now.getMonth(), 1, 0, 0, 0)/1000;
      interval[1] = Date.UTC(now.getFullYear(), now.getMonth()+1, 0, 23, 59, 0)/1000;
    } else if( str == "lastYear") {
      interval[0] = Date.UTC(now.getUTCFullYear() - 1, now.getUTCMonth());
      interval[1] = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    } else if( str == "currentYear"){
      interval[0] = Date.UTC(now.getFullYear(), 0 )/1000;
      interval[1] = Date.UTC(now.getFullYear()+1, 0, 1 )/1000;
    }
    return interval;
  };

  HigJS.date.getCurrentWeek = function( startOnMonday ){
    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay() + ( startOnMonday ? 1 : 0 ); // First day is the day of the month - the day of the week
    return { start: parseInt(Date.UTC(curr.getUTCFullYear(), curr.getUTCMonth(), first, 0, 0, 0)/1000), stop: parseInt(Date.UTC(curr.getUTCFullYear(), curr.getUTCMonth(), first + 6, 0, 0, 0)/1000) }
  };

  HigJS.date.getTimeInterval = function( str ){
    var interval = HigJS.date.getTimeIntervalMil( str );
    return [ parseInt( interval[0]/1000 ), parseInt( interval[1]/1000 ) ];
  };

  HigJS.date.getCustomInterval = function( date ) {
    var type     = date.interval,
        dateObj  = date.selection,
        interval = [ 0, 0 ];

    for (var id in dateObj) {
      dateObj[id] = (dateObj[id] == null)? null : + dateObj[id]; //convert all the fields to number so there are non problems during adding operations
    }

    if (type == "year") {
      interval[0] = Date.UTC(dateObj.y, 0, 1);
      interval[1] = Date.UTC(dateObj.y + 1, 0, 1)
    } else if (type == "month") {
      interval[0] = Date.UTC(dateObj.y, dateObj.m, 1);
      interval[1] = Date.UTC(dateObj.y, dateObj.m + 1, 1)
    } else if (type == "day") {
      interval[0] = Date.UTC(dateObj.y, dateObj.m, dateObj.d);
      interval[1] = Date.UTC(dateObj.y, dateObj.m, dateObj.d + 1)
    }
    return [ parseInt(interval[0]/1000), parseInt(interval[1]/1000) ]
  };

  /**
    * Dig deep into an object to get one of its properties in a simple way.
    * @param   {object}         opt              Options object.
    * @param   {string}         [opt.key]        The point-separated properties to descend in the object tree.
    * @param   {object|string}  [opt.target]     The targeted object to dig in search of the desired properties .
    * @param   {object}         [opt.context]    The context where to find the targeted object if opt.target is a string, defaults to Window.
    * @param   {boolean}        [opt.makeCopy]   Simple flag to return a copy of the properties instead of a pointer.
    * @return  {object}                           Returns the desired object or undefined if the properties is not reachable.
  */

  HigJS.obj.getObjDeep = function(opt){
    var parsedObj,tmp;

    if (!(opt && opt.hasOwnProperty('key') && opt.hasOwnProperty('target'))) {
      return;
    }

    if (HigJS.type.isString(opt.target)) {
      parsedObj = opt.context? opt.context[opt.target] : window[opt.target];
    } else {
      parsedObj = opt.target;
    }

    if (HigJS.type.isString(opt.key)) {
      opt.key = opt.key.split(".")
      var l = opt.key.length;
      for (var i = 0; i < l; i++) {
        if (opt.key[i].replace(/\s+/g, '') != "") {
          try {
            tmp = opt.key[i].split('\\');
            if (tmp.length == 2 ) {
              if (tmp[0] !== '') {
                parsedObj = parsedObj[opt.key[i]];
              } else {
                switch(tmp[1]){
                  case 'LAST':
                    if (Array.isArray(parsedObj)) {
                      tmp = parsedObj.length - 1;
                      (tmp >= 0) && (parsedObj = parsedObj[tmp]);
                    } 
                    break;
                  default:
                    parsedObj =  parsedObj[opt.key[i]];
                }
              }
            } else {
              parsedObj = parsedObj[opt.key[i]];
            }
          }
          catch(e){
            console.error(e);
            console.error("Failed to parse " + opt.key[i] + " property");
            return;
          }
        }
      }
    } else {
      return
    }

    if (opt.makeCopy)
      return HigJS.obj.advClone( parsedObj, opt.context || undefined )
    
    return parsedObj    
  };

  HigJS.obj.customHasOwnProperty = function(opt) {
    var returnValue = true;
    var tmpTarget = opt.target;
    if (opt && opt.target && opt.key) {
      var splitted = opt.key.split(".")
      var howDeep = splitted.length;
      for (var i = 0; i < howDeep; i++) {
        var spl = splitted[i].replace(/\s+/g, '')
        if ( spl != "" && tmpTarget.hasOwnProperty(spl)) {
          try {
            tmpTarget = tmpTarget[spl];
          }
          catch(e){
            console.error(e);
            console.error("Failed to parse " + opt.key[i] + " property");
            return false;
          }
        } else {
          returnValue = false;
          break;
        }
      }
    } else {
      returnValue = false
    }
    return returnValue
  }


  HigJS.date.getStartStopFromInterval = function( opt ){
    if( !HigJS.type.isObject( opt ) ){
      return {};
    };

    var interval = [],
        period,
        incrPeriod;

    if( HigJS.type.isString( opt.interval ) ){ interval = HigJS.date.getTimeInterval( opt.interval ); }

    if( opt.interval === "all" || ( HigJS.type.isNumber( opt.startTime ) && HigJS.type.isNumber( opt.stopTime ) ) ){
      interval[0] = opt.startTime || 0 ;
      interval[1] = opt.stopTime  || ( Date.UTC( now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds() ) / 1000 );
    }

    // Checking interval bounds were properly computed
    if( !interval.length === 2 && HigJS.type.isNumber( interval[0] ) && HigJS.type.isNumber( interval[1] ) ){
      return {};
    }

    var  elapsed = interval[1] - interval[0];
    period = parseInt( elapsed / 10000 );
    incrPeriod = 86400;
    
    // Adjusting incrPeriod
         if(  elapsed <    86400 ){ incrPeriod =    3600; } // colonne di un ora su una giornata
    else if(  elapsed <   604800 ){ incrPeriod =   86400; } // colonne di un giorno
    else if(  elapsed <  3024000 ){ incrPeriod =   86400; }
    else if(  elapsed > 31536000 ){ incrPeriod = 2592000; }

    return { startTime: interval[0], stopTime: interval[1], period: period, incrPeriod: incrPeriod };

  };
}.call(this));

/*
 ┌──────────────────────────────────────────────────────┐
 │█┌──────────────────────────────────────────────────┐█│
 │█│  hih-dom.js                                      │█│
 │█│                                                  │█│
 │█│  Higeco JS Framework.                            │█│
 │█│  JavaScript and utilities.                       │█│
 │█└──────────────────────────────────────────────────┘█│
 └──────────────────────────────────────────────────────┘
*/ 

(function() {

  // --------------------------
  // 
  // INIT
  // 
  // --------------------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var self = this;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;


  if( typeof HigJS === void 0 || !HigJS ){
    console.error( "Missing HigJS base library. Include 'hig.js'" );
    return null;
  }
  // --------------------------
  // 
  // diz Only extensions to HigJS
  // 
  // --------------------------

  // Our Global Object
  var _diz = HigJS.diz = {};

  // Current version.
  _diz.VERSION = '0.0.1';
  _diz.enable = false;

  _diz.edw = function( opt ){

    var myDiz = typeof diz !== "undefined" ? diz : {};

    if( typeof opt == "undefined" )
      opt = "undefined";

    if( this.diz && !HigJS.hasOwnProperty( this.diz ) ){
      myDiz = this.diz;
    } else if( HigJS.dictionary ){
      myDiz = HigJS.dictionary;
    }

    if( typeof opt == "string" )
      opt = { word: opt, diz: myDiz };

    try{
      if( opt.diz[ opt.word ] )
        return opt.diz[ opt.word ];
      else
        return opt.word;
    }
    catch(e){
      HigJS.debug.error("Unable to load the word with id '" + opt.word + "' from diz");
      return opt.word;
    }
  };

  HigJS.diz.decodeDizIdFromString = function( str ){
    if( str && str[0] == "{" && str[ str.length - 1] == "}")
      return str.substring(1, str.length - 1);
    else
      return str;
  };

  HigJS.diz.encodeDizIdFromString = function( str ){
    if( str )
      return "{" + str + "}";
    else
      return str;
  };

  HigJS.diz.isCustomWord = function( str ){
    if( str && str[0] == "{" && str[ str.length - 1] == "}")
      return true;
    return false;
  };

  HigJS.diz.edwCustom = function( opt ){
    if( typeof opt == "undefined" )
      opt = "undefined";

    if( typeof opt == "string" )
      opt = { word: opt, alt: "" };

    if( !opt.diz && HigJS.userDiz ){
      opt.diz = HigJS.userDiz;
    } else {
      opt.diz = {};
    }

    if( opt.word == " " || opt.word == "")
      return opt.word;    

    try{
      if( HigJS.diz.isCustomWord( opt.word ) || opt.diz[ HigJS.diz.decodeDizIdFromString( opt.word ) ] )
        return opt.diz[ HigJS.diz.decodeDizIdFromString( opt.word ) ][ userConf.langId ] || opt.alt || "";
      else
        return opt.word;
    }
    catch(e){
      HigJS.debug.error("Unable to load the custom word with id '" + opt.word + "' from diz");
      if( typeof opt.alt !== "undefined" && opt.diz ){
        opt.diz[ HigJS.diz.decodeDizIdFromString( opt.word ) ] = {};
        opt.diz[ HigJS.diz.decodeDizIdFromString( opt.word ) ][ userConf.langId ] = opt.alt;
      }
      return typeof opt.alt !== "undefined" ? opt.alt : opt.word;
    };
  }

  HigJS.diz.addCustom = function( opt ){
    !opt.id && ( opt.id = HigJS.diz.encodeDizIdFromString( "word_" + parseInt( new Date().getTime()/1000 ) + HigJS.num.genNum() ) );
    !opt.diz[ HigJS.diz.decodeDizIdFromString( opt.id ) ] && ( opt.diz[ HigJS.diz.decodeDizIdFromString( opt.id ) ] = {} );
    opt.diz[ HigJS.diz.decodeDizIdFromString( opt.id ) ][ opt.lang ] = opt.word || "";
    return opt;
  };

  HigJS.num.formatDate = function ( opt ){
    if( HigJS.type.isNumber( opt ) )
      opt = { utc: opt, date: true, time: true, local: false }
    
    if(opt.utc == "---" || !opt.utc)
      return "---";  

    var myDate = new Date(parseInt(opt.utc)*1000), str = "";
    
    if(opt.date){
      var day = myDate.getUTCDate();
      var month = opt.months ? " " + opt.months[myDate.getUTCMonth()] + " " : myDate.getUTCMonth()+1;
      var year = myDate.getUTCFullYear();
      if(day < 10)
        day = "0" + day;
      if(month < 10 && !opt.months)
        month = "/0" + month + "/";
      else if(!opt.months)
        month = "/" + month + "/";
      if(opt.xml)
        str = year+"-"+month+"-"+day;
      else{
        if( userConf.dateFormat == "DD_MM_YY_HH_MM_SS_SINGLE_POINT" || userConf.dateFormat == "DD_MM_YY_HH_MM_SS_DOUBLE_POINT" )
          str = day + month + year;
        else if(userConf.dateFormat == "YY_MM_DD_HH_MM_SS_SINGLE_POINT" || userConf.dateFormat == "YY_MM_DD_HH_MM_SS_DOUBLE_POINT" )
          str = year + month + day;
        else if(userConf.dateFormat == "MM_DD_YY_HH_MM_SS_SINGLE_POINT" || userConf.dateFormat == "MM_DD_YY_HH_MM_SS_DOUBLE_POINT" )
          str = month + "/" + day + "/" + year;
        else
          str = day + month + year;
      }
    }
    if(opt.time){
      var hours = myDate.getUTCHours();
      var minutes = myDate.getUTCMinutes();
      var seconds = myDate.getUTCSeconds();
      if(hours < 10)
        hours = "0" + hours;
      if(seconds < 10)
        seconds = "0" + seconds;
      if(minutes < 10)
        minutes = "0" + minutes;
      if(opt.xml)
        str += "T" + hours + ":" + minutes + ":" + seconds + ".000";
      else if( userConf.dateFormat == "DD_MM_YY_HH_MM_SS_SINGLE_POINT" || userConf.dateFormat == "YY_MM_DD_HH_MM_SS_SINGLE_POINT" || userConf.dateFormat == "MM_DD_YY_HH_MM_SS_SINGLE_POINT" )
        str += " " + hours + "." + minutes + "." + seconds;
      else if( userConf.dateFormat == "DD_MM_YY_HH_MM_SS_DOUBLE_POINT" || userConf.dateFormat == "YY_MM_DD_HH_MM_SS_DOUBLE_POINT" || userConf.dateFormat == "MM_DD_YY_HH_MM_SS_DOUBLE_POINT" )
        str += " " + hours + ":" + minutes + ":" + seconds;
      else
        str += " " + hours + ":" + minutes + ":" + seconds;
    }
    return str;/*1981-12-11T11:11:11.000*/
  };

  HigJS.date.getIntervalFromStrDate = function( day, local ){
    if( !day || typeof day != "string" )  return [0,0];
    var days = day.split("/"), start, end;

    if( !local ){ // GMT
      if( userConf.dateFormat == "DD_MM_YY_HH_MM_SS_SINGLE_POINT" || userConf.dateFormat == "DD_MM_YY_HH_MM_SS_DOUBLE_POINT" ){
        start = parseInt(Date.UTC(parseInt(days[2]), parseInt(days[1]-1), parseInt(days[0]),0,0,0)/1000);
        end = parseInt(Date.UTC(parseInt(days[2]), parseInt(days[1]-1), parseInt(days[0]),23, 59, 59)/1000);
      }
      else if( userConf.dateFormat == "YY_MM_DD_HH_MM_SS_SINGLE_POINT" || userConf.dateFormat == "YY_MM_DD_HH_MM_SS_DOUBLE_POINT" ){
        start = parseInt(Date.UTC(parseInt(days[0]), parseInt(days[1]-1), parseInt(days[2]),0,0,0)/1000);
        end = parseInt(Date.UTC(parseInt(days[0]), parseInt(days[1]-1), parseInt(days[2]),23, 59, 59)/1000);
      } 
      else if( userConf.dateFormat == "MM_DD_YY_HH_MM_SS_SINGLE_POINT" || userConf.dateFormat == "MM_DD_YY_HH_MM_SS_DOUBLE_POINT" ){
        start = parseInt(Date.UTC(parseInt(days[2]), parseInt(days[0]-1), parseInt(days[1]),0,0,0)/1000);
        end = parseInt(Date.UTC(parseInt(days[2]), parseInt(days[0]-1), parseInt(days[1]),23, 59, 59)/1000);
      }
    } else {  // Tempo locale
      if( userConf.dateFormat == "DD_MM_YY_HH_MM_SS_SINGLE_POINT" || userConf.dateFormat == "DD_MM_YY_HH_MM_SS_DOUBLE_POINT" ){
        start = parseInt((new Date(parseInt(days[2]), parseInt(days[1]-1), parseInt(days[0]),0,0,0)).getTime()/1000);
        end = parseInt((new Date(parseInt(days[2]), parseInt(days[1]-1), parseInt(days[0]),23, 59, 59)).getTime()/1000);
      }
      else if( userConf.dateFormat == "YY_MM_DD_HH_MM_SS_SINGLE_POINT" || userConf.dateFormat == "YY_MM_DD_HH_MM_SS_DOUBLE_POINT" ){
        start = parseInt((new Date(parseInt(days[0]), parseInt(days[1]-1), parseInt(days[2]),0,0,0)).getTime()/1000);
        end = parseInt((new Date(parseInt(days[0]), parseInt(days[1]-1), parseInt(days[2]),23, 59, 59)).getTime()/1000);
      } 
      else if( userConf.dateFormat == "MM_DD_YY_HH_MM_SS_SINGLE_POINT" || userConf.dateFormat == "MM_DD_YY_HH_MM_SS_DOUBLE_POINT" ){
        start = parseInt(new Date(parseInt(days[2]), parseInt(days[0]-1), parseInt(days[1]),0,0,0)/1000);
        end = parseInt(new Date(parseInt(days[2]), parseInt(days[0]-1), parseInt(days[1]),23, 59, 59)/1000);
      }
    }
    return [start, end];
  };

  /**
   * @description Dato un valore in secondi restituisce una stringa gg/ore/min/sec.
   * @param {jSon}        opt             Oggetto jSon di configurazione.
   * @param {boolean}     opt.sec         Numero secondi.
   * @return Stringa gg/ore/min/sec.
   */

  HigJS.num.secToStr = function(opt){
    var val = 0;
    
    if(opt.sec == "---")
      return "---";
    
    if(opt.sec < 60){
      val = Math.floor(parseInt(opt.sec)) + " " + HigJS.diz.edw("sec");
    }
    else if(opt.sec < 3600){
      val = opt.sec/60;
      var sec = opt.sec % 60;
      val = Math.floor(val) + " " + HigJS.diz.edw("min");
      if( !opt.disableSec )
        val += ", " + Math.floor(sec) + " " + HigJS.diz.edw("sec");
    }
    else if(opt.sec < 86400){
      val = opt.sec/3600;
      var rest = opt.sec%3600;
      var min = (rest)/60;
      var sec = (rest)%60;
      val = Math.floor(val) + " " + HigJS.diz.edw("hours") + ", "+ Math.floor(min) + " " + HigJS.diz.edw("min");
      if( !opt.disableSec )
        val += ", " + Math.floor(sec) + " " + HigJS.diz.edw("sec");
    }
    else{
      val = opt.sec/86400;
      var rest = opt.sec%86400;
      var ore = (rest)/3600;
      var min = ((rest)%3600)/60;
      var sec = ((rest)%3600)%60;
      val = Math.floor(val) + " " + HigJS.diz.edw("days") + ", " + Math.floor(ore) + " " + HigJS.diz.edw("hours") + ", " + Math.floor(min) + " " + HigJS.diz.edw("min");
      if( !opt.disableSec )
        val += ", " + Math.floor(sec) + " " + HigJS.diz.edw("sec");
    }
   return val;
  }

  HigJS.num.format = function(val){
  
    if(typeof val == "boolean")
      return "---"
    
    if(typeof val == "number")
        val = val.toString();
    
    if(!HigJS.num.isNum(val))
      return "---";
    
    if(val == "---")
      return val;
    
    var str = " ";
    var dec = ".";
    var minus = "";

    if( userConf.numFormat == "1 000 000.000" ){ str = " "; dec = "."; }
    else if( userConf.numFormat == "1,000,000.000" ){ str = ","; dec = "."; }
    else if( userConf.numFormat == "1.000.000,000" ){ str = "."; dec = ","; }
    else { str = " "; dec = ".";}
    
    if(val[0] == "-"){
      minus = "-";
      val = val.split("-")[1];
    }
    
    var tmpVal = [];
    if(val.indexOf(",") >= 0) tmpVal = val.split(",");
    else if(val.indexOf(".") >= 0) tmpVal = val.split(".");
    else {tmpVal[0] = val.slice(0); tmpVal[1] = "";}
    
    var output = [];
    for(var i = 0; i < tmpVal[0].length; i++)
      output[i] = tmpVal[0][i];
    
    if(output.length > 3){
      for(var i = output.length-3; i > 0; i -= 3)
        output.splice(i,0,str);
    }
    
    tmpVal[0] = "";
    
    for(var i = 0; i < output.length; i++)
      tmpVal[0] += output[i];
    
    if(tmpVal[1] == "")
      return minus + tmpVal[0];
    return minus + tmpVal[0] + dec + tmpVal[1];
  };

  HigJS.num.unFormat = function( val ){
  
    if( typeof val == "boolean" || !HigJS.type.isNumber( val ) || val === "---" ) 
      return "---";  
    
    if( typeof val == "number" ) val = val.toString();
  
    var str = " ", dec = ".", dateNumFormat = "UNI";
    
    if( userConf.numFormat == "1 000 000.000" ){ str = " "; dec = "."; }
    else if( userConf.numFormat == "1,000,000.000" ){ str = ","; dec = "."; }
    else if( userConf.numFormat == "1.000.000,000" ){ str = "."; dec = ","; }
    else { str = " "; dec = ".";}
    
    val = val.replace(/ /g,'').replace(str,'').replace(dec,'.');

    return parseFloat(val);
  };

}.call(this));

/*
 ┌──────────────────────────────────────────────────────┐
 │█┌──────────────────────────────────────────────────┐█│
 │█│  hig-ajax.js                                     │█│
 │█│                                                  │█│
 │█│  Higeco JS Framework.                            │█│
 │█│  JavaScript and ajax utilities.                  │█│
 │█└──────────────────────────────────────────────────┘█│
 └──────────────────────────────────────────────────────┘
*/ 

(function() {

	// --------------------------
	// 
  // INIT
  // 
  // --------------------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var self = this;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;


  if( typeof HigJS === void 0 || !HigJS ){
  	console.error( "Missing HigJS base library. Include 'hig.js'" );
  	return null;
  }


  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
  /*  Block TEA (xxtea) Tiny Encryption Algorithm implementation in JavaScript                      */
  /*     (c) Chris Veness 2002-2012: www.movable-type.co.uk/tea-block.html                          */
  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
  /*  Algorithm: David Wheeler & Roger Needham, Cambridge University Computer Lab                   */
  /*             http://www.cl.cam.ac.uk/ftp/papers/djw-rmn/djw-rmn-tea.html (1994)                 */
  /*             http://www.cl.cam.ac.uk/ftp/users/djw3/xtea.ps (1997)                              */
  /*             http://www.cl.cam.ac.uk/ftp/users/djw3/xxtea.ps (1998)                             */
  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

  HigJS.Tea = {};

  /*
   * encrypt text using Corrected Block TEA (xxtea) algorithm
   *
   * @param {string} plaintext String to be encrypted (multi-byte safe)
   * @param {string} password  Password to be used for encryption (1st 16 chars)
   * @returns {string} encrypted text
   */
  HigJS.Tea.encrypt = function(plaintext, password) {
      if (plaintext.length == 0) return('');  // nothing to encrypt
      
      // convert string to array of longs after converting any multi-byte chars to UTF-8
      var v = HigJS.Tea.strToLongs(HigJS.Utf8.encode(plaintext));
      if (v.length <= 1) v[1] = 0;  // algorithm doesn't work for n<2 so fudge by adding a null
      // simply convert first 16 chars of password as key
      var k = HigJS.Tea.strToLongs(HigJS.Utf8.encode(password).slice(0,16));  
      var n = v.length;
      
      // ---- <TEA coding> ---- 
      
      var z = v[n-1], y = v[0], delta = 0x9E3779B9;
      var mx, e, q = Math.floor(6 + 52/n), sum = 0;
      
      while (q-- > 0) {  // 6 + 52/n operations gives between 6 & 32 mixes on each word
          sum += delta;
          e = sum>>>2 & 3;
          for (var p = 0; p < n; p++) {
              y = v[(p+1)%n];
              mx = (z>>>5 ^ y<<2) + (y>>>3 ^ z<<4) ^ (sum^y) + (k[p&3 ^ e] ^ z);
              z = v[p] += mx;
          }
      }
      
      // ---- </TEA> ----
      
      var ciphertext = HigJS.Tea.longsToStr(v);
      
      return HigJS.Base64.encode(ciphertext);
  }

  /*
   * decrypt text using Corrected Block TEA (xxtea) algorithm
   *
   * @param {string} ciphertext String to be decrypted
   * @param {string} password   Password to be used for decryption (1st 16 chars)
   * @returns {string} decrypted text
   */
  HigJS.Tea.decrypt = function(ciphertext, password) {
      if (ciphertext.length == 0) return('');
      var v = HigJS.Tea.strToLongs(HigJS.Base64.decode(ciphertext));
      var k = HigJS.Tea.strToLongs(HigJS.Utf8.encode(password).slice(0,16)); 
      var n = v.length;
      
      // ---- <TEA decoding> ---- 
      
      var z = v[n-1], y = v[0], delta = 0x9E3779B9;
      var mx, e, q = Math.floor(6 + 52/n), sum = q*delta;

      while (sum != 0) {
          e = sum>>>2 & 3;
          for (var p = n-1; p >= 0; p--) {
              z = v[p>0 ? p-1 : n-1];
              mx = (z>>>5 ^ y<<2) + (y>>>3 ^ z<<4) ^ (sum^y) + (k[p&3 ^ e] ^ z);
              y = v[p] -= mx;
          }
          sum -= delta;
      }
      
      // ---- </TEA> ---- 
      
      var plaintext = HigJS.Tea.longsToStr(v);

      // strip trailing null chars resulting from filling 4-char blocks:
      plaintext = plaintext.replace(/\0+$/,'');

      return HigJS.Utf8.decode(plaintext);
  }

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

  // supporting functions

  HigJS.Tea.strToLongs = function(s) {  // convert string to array of longs, each containing 4 chars
      // note chars must be within ISO-8859-1 (with Unicode code-point < 256) to fit 4/long
      var l = new Array(Math.ceil(s.length/4));
      for (var i=0; i<l.length; i++) {
          // note little-endian encoding - endianness is irrelevant as long as 
          // it is the same in longsToStr() 
          l[i] = s.charCodeAt(i*4) + (s.charCodeAt(i*4+1)<<8) + 
                 (s.charCodeAt(i*4+2)<<16) + (s.charCodeAt(i*4+3)<<24);
      }
      return l;  // note running off the end of the string generates nulls since 
  }              // bitwise operators treat NaN as 0

  HigJS.Tea.longsToStr = function(l) {  // convert array of longs back to string
      var a = new Array(l.length);
      for (var i=0; i<l.length; i++) {
          a[i] = String.fromCharCode(l[i] & 0xFF, l[i]>>>8 & 0xFF, 
                                     l[i]>>>16 & 0xFF, l[i]>>>24 & 0xFF);
      }
      return a.join('');  // use Array.join() rather than repeated string appends for efficiency in IE
  }


  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
  /*  Base64 class: Base 64 encoding / decoding (c) Chris Veness 2002-2012                          */
  /*    note: depends on Utf8 class                                                                 */
  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
  HigJS.Base64 = {}
  HigJS.Base64.code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  /**
   * Encode string into Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
   * (instance method extending String object). As per RFC 4648, no newlines are added.
   *
   * @param {String} str The string to be encoded as base-64
   * @param {Boolean} [utf8encode=false] Flag to indicate whether str is Unicode string to be encoded 
   *   to UTF8 before conversion to base64; otherwise string is assumed to be 8-bit characters
   * @returns {String} Base64-encoded string
   */ 
  HigJS.Base64.encode = function(str, utf8encode) {  // http://tools.ietf.org/html/rfc4648
    utf8encode =  (typeof utf8encode == 'undefined') ? false : utf8encode;
    var o1, o2, o3, bits, h1, h2, h3, h4, e=[], pad = '', c, plain, coded;
    var b64 = HigJS.Base64.code;
     
    plain = utf8encode ? HigJS.Utf8.encode(str) : str;
    
    c = plain.length % 3;  // pad string to length of multiple of 3
    if (c > 0) { while (c++ < 3) { pad += '='; plain += '\0'; } }
    // note: doing padding here saves us doing special-case packing for trailing 1 or 2 chars
     
    for (c=0; c<plain.length; c+=3) {  // pack three octets into four hexets
      o1 = plain.charCodeAt(c);
      o2 = plain.charCodeAt(c+1);
      o3 = plain.charCodeAt(c+2);
        
      bits = o1<<16 | o2<<8 | o3;
        
      h1 = bits>>18 & 0x3f;
      h2 = bits>>12 & 0x3f;
      h3 = bits>>6 & 0x3f;
      h4 = bits & 0x3f;

      // use hextets to index into code string
      e[c/3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    }
    coded = e.join('');  // join() is far faster than repeated string concatenation in IE
    
    // replace 'A's from padded nulls with '='s
    coded = coded.slice(0, coded.length-pad.length) + pad;
     
    return coded;
  }

  /**
   * Decode string from Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
   * (instance method extending String object). As per RFC 4648, newlines are not catered for.
   *
   * @param {String} str The string to be decoded from base-64
   * @param {Boolean} [utf8decode=false] Flag to indicate whether str is Unicode string to be decoded 
   *   from UTF8 after conversion from base64
   * @returns {String} decoded string
   */ 
  HigJS.Base64.decode = function(str, utf8decode) {
    utf8decode =  (typeof utf8decode == 'undefined') ? false : utf8decode;
    var o1, o2, o3, h1, h2, h3, h4, bits, d=[], plain, coded;
    var b64 = HigJS.Base64.code;

    coded = utf8decode ? HigJS.Utf8.decode(str) : str;
    
    
    for (var c=0; c<coded.length; c+=4) {  // unpack four hexets into three octets
      h1 = b64.indexOf(coded.charAt(c));
      h2 = b64.indexOf(coded.charAt(c+1));
      h3 = b64.indexOf(coded.charAt(c+2));
      h4 = b64.indexOf(coded.charAt(c+3));
        
      bits = h1<<18 | h2<<12 | h3<<6 | h4;
        
      o1 = bits>>>16 & 0xff;
      o2 = bits>>>8 & 0xff;
      o3 = bits & 0xff;
      
      d[c/4] = String.fromCharCode(o1, o2, o3);
      // check for padding
      if (h4 == 0x40) d[c/4] = String.fromCharCode(o1, o2);
      if (h3 == 0x40) d[c/4] = String.fromCharCode(o1);
    }
    plain = d.join('');  // join() is far faster than repeated string concatenation in IE
     
    return utf8decode ? HigJS.Utf8.decode(plain) : plain; 
  }


  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
  /*  Utf8 class: encode / decode between multi-byte Unicode characters and UTF-8 multiple          */
  /*              single-byte character encoding (c) Chris Veness 2002-2012                         */
  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

  HigJS.Utf8 = {};  // Utf8 namespace

  /**
   * Encode multi-byte Unicode string into utf-8 multiple single-byte characters 
   * (BMP / basic multilingual plane only)
   *
   * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
   *
   * @param {String} strUni Unicode string to be encoded as UTF-8
   * @returns {String} encoded string
   */
  HigJS.Utf8.encode = function(strUni) {
    // use regular expressions & String.replace callback function for better efficiency 
    // than procedural approaches
    var strUtf = strUni.replace(
        /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
        function(c) { 
          var cc = c.charCodeAt(0);
          return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
      );
    strUtf = strUtf.replace(
        /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
        function(c) { 
          var cc = c.charCodeAt(0); 
          return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
      );
    return strUtf;
  }

  /**
   * Decode utf-8 encoded string back into multi-byte Unicode characters
   *
   * @param {String} strUtf UTF-8 string to be decoded back to Unicode
   * @returns {String} decoded string
   */
  HigJS.Utf8.decode = function(strUtf) {
    // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
    var strUni = strUtf.replace(
        /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
        function(c) {  // (note parentheses for precence)
          var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f); 
          return String.fromCharCode(cc); }
      );
    strUni = strUni.replace(
        /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
        function(c) {  // (note parentheses for precence)
          var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
          return String.fromCharCode(cc); }
      );
    return strUni;
  };

  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
  /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */


  // Our Global Object
  var _ajax = HigJS.ajax = {};

  // Current version.
  _ajax.VERSION = '0.0.1';

 	// --------------------------
  // 
  // ajax Only extensions to HigJS
  // 
  // --------------------------
  
  _ajax.post = function( opt ){
    var request = new window.XMLHttpRequest();

    //request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    request.open("POST", opt.url, true);
    // request.onreadystatechange = opt.onSuccess;
    request.onload = function(){
      var response;
      if ( !request.readyState == XMLHttpRequest.DONE ){
        return;
      } else if( request.status !== 200 ){
        opt.onError && opt.onError( request );
        return;
      }

      if( opt.nodeJs && typeof request.responseText == "string" ){
        var msgTmp = HigJS.Tea.decrypt( request.responseText, "SR0cM+3pitFygtrA" );
        msgTmp = HigJS.str.toObj(msgTmp);
        msgTmp && ( response = msgTmp );
        try{ typeof sysConf != undefined && sysConf.debug && console.log( response ); } catch(e){}
      } else {
        response = HigJS.str.toObj(request.responseText) || request.responseText;
      }      
      opt.onSuccess && opt.onSuccess( response );
    };
    request.ontimeout = function(){
      if( opt.onTimeout ){
        opt.onTimeout();
      } else if( opt.onError ){
        opt.onError();
      };
    }
    request.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.onerror = opt.onError;
    request.onloadend = opt.onComplete;
    request.onabort = opt.onAbort;
    request.onprogress = opt.onProgress;
    opt.timeout && (request.timeout = opt.timeout);
    request.send( opt.data );
    return request;
  };

  _ajax.request = function( opt ){

    if( !opt.reqs ){
      opt.reqs = [{
        act:    opt.act,
        idReq:  opt.idReq || 1,
        data:   opt.data  || {}
      }]
    }
    
    var objJson = [], i, datiPost;
    for(var i = 0; i < opt.reqs.length; i++){
      opt.reqs[i].idReq = opt.reqs[i].idReq ? opt.reqs[i].idReq : opt.reqs[i].act;
      opt.reqs[i].ids = opt.reqs[i].ids ? opt.reqs[i].ids : opt.ids;
      opt.reqs[i].DATI = opt.reqs[i].data;
      delete opt.reqs[i].data;
      objJson.push( opt.reqs[i] );
    }

    datiPost = "query=" + encodeURIComponent( HigJS.obj.toString(objJson) );

    if( opt.nodeJs ){
      try{ typeof sysConf != undefined && sysConf.debug && console.log( HigJS.str.toObj( decodeURIComponent(datiPost).split("query=")[1] ) ); } catch(e){}
      opt.data = HigJS.Tea.encrypt( datiPost, "SR0cM+3pitFygtrA" );
    } else {
      opt.data = datiPost;  
    }
    
    return HigJS.ajax.post( opt );
  };

  /**
   * Controlla che l'input sia una funzione.
   * @extends GWC.HigJS.ajax
   * 
   * @param {Object}      opt             Oggetto di configurazione.
   * @param {String}      opt.reqs        Array delle richieste. Es: [{act:"act1",idReq:"idReq",data:{ value: 1 },sn:"GWC-SERIAL"}].
   * @param {String}      opt.act         Url della cgi via server.
   * @param {String}      opt.idReq       (optional) Id richiesta.
   * @param {String}      opt.data        Dati da inviare.
   * @param {String}      [opt.sn=gwc.sn] (optional) Url della cgi via server.
   * @param {String}      opt.phpFile     Url della cgi via server.
   * @param {String}      opt.cgi         Url della cgi in locale.
   * @param {String}      opt.source      Sorgente della richiesta ( gwc/server )
   * @param {Function}    opt.onSuccess   Funzione che viene eseguita in caso di successo.
   * @param {Function}    opt.onError     Funzione che viene eseguita in caso d'errore.
   */
  _ajax.gwcRequest = function( opt ){

    if( !opt.reqs ){
      opt.reqs = [{
        act: opt.act,
        idReq: opt.idReq || 1,
        data: opt.data || {},
        sn: opt.sn
      }]
    }
    !opt.phpFile && ( opt.phpFile = "/phpScript/deviceServerCgi.php" );
    !opt.source  && ( opt.source = "server" );
    
    var objJson = [], i, datiPost, objJsonSer;
    for( i = 0; i < opt.reqs.length; i++ ){
      opt.reqs[i].act == "getStatus" && (opt.reqs[i].data.localGMT = 1);
      objJson.push({ act: opt.reqs[i].act, idReq: opt.reqs[i].idReq, sn: opt.reqs[i].sn || opt.sn || opt.sn, DATI: opt.reqs[i].data });
    }

    if( HigJS.str.toLowerCase( opt.source ) === "gwc" ){
      objJsonSer = [{ act: "getFromGWC", sn: opt.sn, idReq: "getFromGWC", DATI: { cgi: opt.cgi, queryCgi: objJson }}];
      datiPost = "query=" + encodeURIComponent( HigJS.obj.toString(objJsonSer) );
      opt.url = "/GWC_V200" + opt.phpFile;
      opt.data = datiPost;
      return HigJS.ajax.post( opt );
    }
    else if( HigJS.str.toLowerCase( opt.source ) === "server" ){
      datiPost = "query=" + encodeURIComponent( HigJS.obj.toString(objJson) );
      opt.url = "/GWC_V200" + opt.phpFile;
      opt.data = datiPost;
      return HigJS.ajax.post( opt );
    }
  };

  _ajax.formRequest = function( opt ){

    if( !opt.reqs ){
      opt.reqs = [{
        act:    opt.act,
        idReq:  opt.idReq || 1,
        data:   opt.data  || {}
      }]
    }
    
    var objJson = [], i, datiPost;
    for(var i = 0; i < opt.reqs.length; i++){
      opt.reqs[i].idReq = opt.reqs[i].idReq ? opt.reqs[i].idReq : opt.reqs[i].act;
      opt.reqs[i].ids = opt.reqs[i].ids ? opt.reqs[i].ids : opt.ids;
      opt.reqs[i].DATI = opt.reqs[i].data;
      delete opt.reqs[i].data;
      objJson.push( opt.reqs[i] );
    }

    datiPost = "query=" + encodeURIComponent( HigJS.obj.toString(objJson) );

    if( opt.nodeJs ){
      try{ typeof sysConf != undefined && sysConf.debug && console.log( HigJS.str.toObj( decodeURIComponent(datiPost).split("query=")[1] ) ); } catch(e){}
      opt.data = HigJS.Tea.encrypt( datiPost, "SR0cM+3pitFygtrA" );
    } else {
      opt.data = datiPost;  
    }
    
    var $form = $("<form/>", {
      action: opt.url,
      target: opt.frameId || "fakeFrame",
      method: "post"
    }).appendTo( $("body") );

    // data = HigJS.obj.toString(data);
    // data = HigJS.Tea.encrypt( "query="+encodeURIComponent(data), "SR0cM+3pitFygtrA" );
    $("<input/>",{ type: "hidden", name: "encryptData", value: opt.data, id: "encryptData" }).appendTo( $form );

    $form.submit(); 
  };

  _ajax.getFile = function( opt ){

    var request = new window.XMLHttpRequest();
    request.open("GET", opt.url, true);
    opt.timeout && (request.timeout = opt.timeout);
    request.onerror = opt.onError;
    request.onloadend = opt.onComplete;
    request.onload = function(){
      if( request.status !== 200 ){
        opt.onError && opt.onError( request );
        return;
      }
      var response = HigJS.str.toObj(request.responseText) || request.responseText;
      opt.onSuccess && opt.onSuccess( response );
    };
    request.send();

  };

  _ajax.checkResponse = function( msg ){
    try{
      if(!msg)
        return {ok : false, errMsg : "no msg"};
      if(msg.ERR != 0){
        return {ok : false, errMsg : msg.STRERR};
      }
      if( HigJS.type.isArray( msg.DATI )){
        for (var i = 0; i < msg.DATI.length; i++ ){
          if (msg.DATI[i].ERR != 0) {
            return {ok : false, errMsg : msg.DATI[i].STRERR};
          } 
        }
      }
      return {ok : true};
    }
    catch(e){
      return {ok : false, errMsg : "undefined error"}
    }
  };

}.call(this));

/*
 ┌──────────────────────────────────────────────────────┐
 │█┌──────────────────────────────────────────────────┐█│
 │█│  node.js                                         │█│
 │█│                                                  │█│
 │█│  Higeco JS Framework.                            │█│
 │█│  JavaScript and Node utilities.                  │█│
 │█└──────────────────────────────────────────────────┘█│
 └──────────────────────────────────────────────────────┘
*/ 

(function(){

  // --------------------------
  // 
  // INIT
  // 
  // --------------------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var self = this;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  if( typeof HigJS !== typeof {} ){
    console.error( "Missing HigJS base library. Include 'hig.js'" );
    return null;
  }


  // Our Global Object
  var node = HigJS.node = {};

  // // Export the Underscore object for **Node.js**, with
  // // backwards-compatibility for the old `require()` API. If we're in
  // // the browser, add `_` as a global object.
  // if (typeof exports !== "undefined") {
  //   // if (typeof module !== 'undefined' && module.exports) {
  //   //   exports = module.exports = node;
  //   // }
  //   exports.node = node;
  // } else {
  //   self.node = node;
  // }

  // Current version.
  node.VERSION = "0.0.1";

 

  // --------------------------
  // 
  // Node Only extensions to HigJS
  // 
  // --------------------------



  // --------------------------
  // Log Functions
  // --------------------------
  var clc;
  try {
    clc = require("cli-color");   // Command line interface colors
  } catch( e ){ }
  HigJS.Logger = function( logCfg ){
      this.logCfg = logCfg;

      // Set Defaults
      if( !( this.logCfg && typeof this.logCfg === "object" ) ){ this.logCfg = {}; }
      this.logCfg.level  = this.logCfg.level  || "dbg";
      this.logCfg.file   = this.logCfg.file   || false;
      this.logCfg.stdout = this.logCfg.stdout === false ? false : true;
      this.logCfg.color  = typeof this.logCfg.color !== "boolean" ? true : this.logCfg.color ;

      this.fs = this.logCfg.fs   || fs;
      
      // Check if color library is loaded, otherwise set colorify option to false
      if( typeof clc === typeof void 0 ){
        console.error("Color lib not imported, log will be without colors.");
        this.logCfg.color = false;
      }
      //Imposto il limite del debug
      this.logLimit = this.logLevels[ this.logCfg.level ] ? this.logLevels[ this.logCfg.level ].val : 1000;
     
      // DateStr  stores day info for log: 15.05.27
      this.dateStr = "";
      
      this.updateDateTO = null;
      this.updateDateStr(); // First time will execute immediatly
    };

  HigJS.Logger.prototype.logLevels = {
      err: { val: 0, color: "redBright"    },
      war: { val: 1, color: "yellowBright" },
      inf: { val: 2, color: "greenBright"  },
      dbg: { val: 3, color: "cyanBright"   }
    };
  // Updates dateStr every hour
  HigJS.Logger.prototype.updateDateStr = function(){ 
      var logger = this,
          now   = new Date(),
          year  = now.getFullYear(),
          month = now.getMonth(),
          day   = now.getDate(),
          hour  = now.getHours();
          
      this.dateStr =  year.toString().substr( 2, 2 )        + "." +
                      HigJS.str.padLeft( month+1, 2, "0" )  + "." +
                      HigJS.str.padLeft( day,     2, "0" )  + "-" +
                      HigJS.str.padLeft( hour,    2, "0" )  + ":";

      // Set update on next hour
      var nextHour      = new Date( year, month, day, hour +1 , 0, 0, 0  );
      clearTimeout( this.updateDateTO );
      this.updateDateTO = setTimeout( function(){ logger.updateDateStr(); }, (nextHour.getTime() - now.getTime()) );
    };

  HigJS.Logger.prototype.log = function( opt, level ){  
      level = level || "dbg";
      if( !this.logLevels[ level ] ){ return; }
      
      var now   = new Date(),
          min   = now.getMinutes(),
          sec   = now.getSeconds(),       
          dateTime    = this.dateStr + HigJS.str.padLeft(min, 2, "0") + ":" + HigJS.str.padLeft(sec, 2, "0"),
          logInfoLen  = 25, // lunghezza della prima parte di stringa, quella con le info
          msg         = '',
          prefix      = [];

      var optType = typeof opt;

      if( optType === "string" ){ msg = opt; }
      else if( optType === "object" && typeof opt.msg !== "undefined" ){
        msg = (typeof opt.msg === "string" ) ? opt.msg : HigJS.obj.toString(msg) ;
        if( opt.pre ){ 
          HigJS.type.isArray(opt.pre) ? ( prefix = prefix.concat(opt.pre) ) : prefix.push(opt.pre);
        }
      } else if( opt ){ 
        msg = HigJS.obj.toString(opt); 
      } else {
        msg = "";
      }


      var dbgStr = "", multiline;
      
      // Stringa con le info di dbg
      dbgStr = this.logCfg.color ? "["+ clc.blackBright(dateTime) +"] ["+ clc[ this.logLevels[level].color ](level) +"]" : "["+ (dateTime) +"] ["+ level +"]";

      var i = 0, el;
      if( HigJS.type.isArray( prefix ) ){ 
        for( i = 0; i < prefix.length; i++ ){
          el = prefix[i];
          if( !(el && typeof el === "string") ){ return; }
          dbgStr += this.logCfg.color ? (" ["+ clc.blackBright(el) +"]") : (" ["+ el +"]");
          logInfoLen += el.length + 3;
        }
      }


      var logStr = "", logger =  this;
      // Creo le righe del log
      msg.split( "\n" ).forEach( function ( el, i ){
          if( i > 0 ){
            multiline = HigJS.str.padLeft(""+i, logInfoLen);
            logger.logCfg.color && ( multiline = clc.blackBright( multiline ) );
          }
          logStr += (i === 0 ? dbgStr : multiline ) + " " + el + "\n";
        });
      
      this.printLog( logStr );
    };

  HigJS.Logger.prototype.printLog = function( logStr ){
      // Stampo
      this.logCfg.file   && this.fs.appendFile( this.logCfg.file, logStr, function(err){ err && console.log(err); } );
      this.logCfg.stdout && process.stdout.write( logStr );
    };

  // --------------------------
  // Http Response functions
  // --------------------------
  
  // Creates a responce to an http request
  HigJS.node.httpRes = function( opt ){
    !opt.query && ( opt.query = { ids: "UNDEFINED", idReq: "UNDEFINED", act: "UNDEFINED" } );
    var msg = {
        ids:    opt.ids     || opt.query.ids    || "UNDEFINED",
        idReq:  opt.idReq   || opt.query.idReq  || "UNDEFINED",
        act:    opt.act     || opt.query.act    || "UNDEFINED",
        ERR:    opt.ERR     || 0,
        STRERR: opt.STRERR  || "OK"
      };

    opt.DATI && ( opt.data = opt.DATI );
    msg[ (opt.lang === "EN" ? "data" : "DATI") ] = opt.data || {};
    // if( opt.lang == "EN" )
    //   msg.data = opt.data || {};
    // else
    //   msg.DATI = opt.data || {};


    return msg;
  };

  HigJS.num.formatDate = function ( opt ){
    if( HigJS.type.isNumber( opt ) ){
      opt = { utc: opt, date: true, time: true, local: false };
    }
    var userConf = opt.userConf || { dateFormat: "DD_MM_YY_HH_MM_SS_SINGLE_POINT" }; //<---- modifica per server.
        
    if(opt.utc == "---" || !opt.utc)
      return "---";  

    var myDate = new Date(parseInt(opt.utc)*1000), str = "";
        
    if(opt.date){
      var day = myDate.getUTCDate();
      var month = opt.months ? " " + opt.months[myDate.getUTCMonth()] + " " : myDate.getUTCMonth()+1;
      var year = myDate.getUTCFullYear();
      if(day < 10)
        day = "0" + day;
      if(month < 10 && !opt.months)
        month = "/0" + month + "/";
      else if(!opt.months)
        month = "/" + month + "/";
      if(opt.xml){
        str = year+"-"+month+"-"+day;
      } else {
        if( userConf.dateFormat == "DD_MM_YY_HH_MM_SS_SINGLE_POINT" || userConf.dateFormat == "DD_MM_YY_HH_MM_SS_DOUBLE_POINT" )
          str = day + month + year;
        else if(userConf.dateFormat == "YY_MM_DD_HH_MM_SS_SINGLE_POINT" || userConf.dateFormat == "YY_MM_DD_HH_MM_SS_DOUBLE_POINT" )
          str = year + month + day;
        else if(userConf.dateFormat == "MM_DD_YY_HH_MM_SS_SINGLE_POINT" || userConf.dateFormat == "MM_DD_YY_HH_MM_SS_DOUBLE_POINT" )
          str = month + "/" + day + "/" + year;
        else
          str = day + month + year;
      }
    }
    if(opt.time){
      var hours = myDate.getUTCHours();
      var minutes = myDate.getUTCMinutes();
      var seconds = myDate.getUTCSeconds();
      if(hours < 10)
        hours = "0" + hours;
      if(seconds < 10)
        seconds = "0" + seconds;
      if(minutes < 10)
        minutes = "0" + minutes;
      if(opt.xml)
        str += "T" + hours + ":" + minutes + ":" + seconds + ".000";
      else if( userConf.dateFormat == "DD_MM_YY_HH_MM_SS_SINGLE_POINT" || userConf.dateFormat == "YY_MM_DD_HH_MM_SS_SINGLE_POINT" || userConf.dateFormat == "MM_DD_YY_HH_MM_SS_SINGLE_POINT" )
        str += " " + hours + "." + minutes + "." + seconds;
      else if( userConf.dateFormat == "DD_MM_YY_HH_MM_SS_DOUBLE_POINT" || userConf.dateFormat == "YY_MM_DD_HH_MM_SS_DOUBLE_POINT" || userConf.dateFormat == "MM_DD_YY_HH_MM_SS_DOUBLE_POINT" )
        str += " " + hours + ":" + minutes + ":" + seconds;
      else
        str += " " + hours + ":" + minutes + ":" + seconds;
    }
    return str;/*1981-12-11T11:11:11.000*/
  }

  HigJS.date.getIntervalFromStrDate = function( day, local, userConf ){
    if( !day || typeof day != "string" )  return [0,0];
    var days = day.split("/"), start, end;
    !userConf && ( userConf = { dateFormat: "DD_MM_YY_HH_MM_SS_SINGLE_POINT" } );

    if( !local ){ // GMT
      if( userConf.dateFormat == "DD_MM_YY_HH_MM_SS_SINGLE_POINT" || userConf.dateFormat == "DD_MM_YY_HH_MM_SS_DOUBLE_POINT" ){
        start = parseInt(Date.UTC(parseInt(days[2]), parseInt(days[1]-1), parseInt(days[0]),0,0,0)/1000);
        end = parseInt(Date.UTC(parseInt(days[2]), parseInt(days[1]-1), parseInt(days[0]),23, 59, 59)/1000);
      }
      else if( userConf.dateFormat == "YY_MM_DD_HH_MM_SS_SINGLE_POINT" || userConf.dateFormat == "YY_MM_DD_HH_MM_SS_DOUBLE_POINT" ){
        start = parseInt(Date.UTC(parseInt(days[0]), parseInt(days[1]-1), parseInt(days[2]),0,0,0)/1000);
        end = parseInt(Date.UTC(parseInt(days[0]), parseInt(days[1]-1), parseInt(days[2]),23, 59, 59)/1000);
      }
      else if( userConf.dateFormat == "MM_DD_YY_HH_MM_SS_SINGLE_POINT" || userConf.dateFormat == "MM_DD_YY_HH_MM_SS_DOUBLE_POINT" ){
        start = parseInt(Date.UTC(parseInt(days[2]), parseInt(days[0]-1), parseInt(days[1]),0,0,0)/1000);
        end = parseInt(Date.UTC(parseInt(days[2]), parseInt(days[0]-1), parseInt(days[1]),23, 59, 59)/1000);
      }
    } else {  // Tempo locale
      if( userConf.dateFormat == "DD_MM_YY_HH_MM_SS_SINGLE_POINT" || userConf.dateFormat == "DD_MM_YY_HH_MM_SS_DOUBLE_POINT" ){
        start = parseInt((new Date(parseInt(days[2]), parseInt(days[1]-1), parseInt(days[0]),0,0,0)).getTime()/1000);
        end = parseInt((new Date(parseInt(days[2]), parseInt(days[1]-1), parseInt(days[0]),23, 59, 59)).getTime()/1000);
      }
      else if( userConf.dateFormat == "YY_MM_DD_HH_MM_SS_SINGLE_POINT" || userConf.dateFormat == "YY_MM_DD_HH_MM_SS_DOUBLE_POINT" ){
        start = parseInt((new Date(parseInt(days[0]), parseInt(days[1]-1), parseInt(days[2]),0,0,0)).getTime()/1000);
        end = parseInt((new Date(parseInt(days[0]), parseInt(days[1]-1), parseInt(days[2]),23, 59, 59)).getTime()/1000);
      }
      else if( userConf.dateFormat == "MM_DD_YY_HH_MM_SS_SINGLE_POINT" || userConf.dateFormat == "MM_DD_YY_HH_MM_SS_DOUBLE_POINT" ){
        start = parseInt(new Date(parseInt(days[2]), parseInt(days[0]-1), parseInt(days[1]),0,0,0)/1000);
        end = parseInt(new Date(parseInt(days[2]), parseInt(days[0]-1), parseInt(days[1]),23, 59, 59)/1000);
      }
    }    
    return [start, end];
  };

  HigJS.diz = {};
  // Current version.
  HigJS.diz.VERSION = '0.0.2';
  HigJS.diz.enable = false;

  HigJS.diz.edw = function( opt ){

    var myDiz = typeof diz !== "undefined" ? diz : {};

    if( typeof opt == "undefined" )
      opt = "undefined";

    if( this.diz && !HigJS.hasOwnProperty( this.diz ) ){
      myDiz = this.diz;
    } else if( HigJS.dictionary ){
      myDiz = HigJS.dictionary;
    }

    if( typeof opt == "string" )
      opt = { word: opt, diz: myDiz };

    try{
      if( opt.diz[ opt.word ] )
        return opt.diz[ opt.word ];
      else
        return opt.word;
    }
    catch(e){
      return opt.word;
    }
  };
//
// Node's HigJS Extension
//
}.call(this));

