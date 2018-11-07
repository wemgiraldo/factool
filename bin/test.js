var fs = require('fs'),
    request = require('request');

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

download('http://www.facturacion.cl/plano/descargar.php?p1=2e8481ab46&p2=GDI&m=V&i=738834&c=true', './public/invoice/pdf/test.pdf', function(){
  console.log('done');
});