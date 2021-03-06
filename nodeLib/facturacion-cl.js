var soap = require('soap');
var convertXML = require('xml-js');
var async = require('async');

class FacturacionCL {

    constructor(config) {

        this.endpoint = "http://ws.facturacion.cl/WSDS/wsplano.asmx?wsdl=0";
        this.endpoint_local = path.join(global.appRoot, '/public/wsdl/wsplano.wsdl');
        this.config = config;

        this.gmapApiKey = this.config.vendor.gmapApiKey;

    }

    verificationAddress(address, callback) {

        var addr = address.replace(" ", "+");
        // Vitacura 2969 Of. 902 Las Condes Santiago
        // Vitacura+2969+Of.+902+Las+Condes+Santiago
        request.post({
            headers: { 'content-type': 'application/json' },
            url: 'https://maps.googleapis.com/maps/api/place/queryautocomplete/xml?&key=' + this.gmapApiKey + '&input=' + addr,
            json: body
        }, function (error, response, body) {
            if (error) {
                logger.log('error:', error); // Print the error if one occurred
                return callback(error);
            }
            callback(body.token);
        });

    }

    createInvoice33XML(instruction, payment_matrix, callback) {

        var debtor = instruction.debtor_info;
        var creditor = instruction.creditor_info;

        getLastFolio(instruction.creditor, function (err, result) {

            if (err) {
                logger.log("error");
                return callback(err);
            }

            var folio = result; // INVOICE NUMBER

            var data = {
                _declaration: {
                    _attributes: { version: "1.0", encoding: "ISO-8859-1" }
                },
                DTE: {
                    _attributes: { version: "1.0" },
                    Documento: {
                        _attributes: { ID: "F" + folio + "T33" },
                        Encabezado: {
                            IdDoc: {
                                TipoDTE: 33,
                                Folio: folio,
                                FchEmis: moment().format("YYYY-MM-DD"),
                                FmaPago: 2,
                                TermPagoGlosa: "CREDITO SII",
                                FchVenc: moment().add(8, "day").format("YYYY-MM-DD")
                            },
                            Emisor: {
                                RUTEmisor: numberWithThousands(creditor.rut) + "-" + creditor.verification_code,
                                RznSoc: creditor.business_name.substring(0, 100),
                                GiroEmis: creditor.commercial_business.substring(0, 40),
                                CorreoEmisor: "test@wemworld.it",
                                Acteco: 401019,
                                DirOrigen: creditor.commercial_address.substring(0, 60),
                                CmnaOrigen: "",
                                CiudadOrigen: ""
                            },
                            Receptor: {
                                RUTRecep: numberWithThousands(debtor.rut) + "-" + debtor.verification_code,
                                RznSocRecep: debtor.business_name.substring(0, 100),
                                GiroRecep: debtor.commercial_business.substring(0, 40),
                                Contacto: "",
                                DirRecep: debtor.commercial_address.substring(0, 60),
                                CmnaRecep: "",
                                CiudadRecep: ""
                            },
                            Totales: {
                                MntNeto: instruction.amount,
                                MntExe: 0,
                                TasaIVA: 19,
                                IVA: Math.round(instruction.amount * 1.19) - instruction.amount,
                                MntTotal: Math.round(instruction.amount * 1.19)
                            }
                        },
                        Detalle: {
                            NroLinDet: 1,
                            CdgItem: {
                                TpoCodigo: "CFN",
                                VlrCodigo: "4-1-1-01-01"
                            },
                            NmbItem: payment_matrix.natural_key,
                            DscItem: payment_matrix.billingWindow.billingType.title + " (Carta " + payment_matrix.letter_code + ", balance " + payment_matrix.billingWindow.periods + ")",
                            QtyItem: 1,
                            UnmdItem: "UN",
                            PrcItem: instruction.amount,
                            MontoItem: instruction.amount
                        },
                        Referencia: {
                            NroLinRef: 1,
                            TpoDocRef: "SEN",
                            FolioRef: payment_matrix.reference_code,
                            FchRef: payment_matrix.publish_date,
                            RazonRef: payment_matrix.natural_key
                        }
                    }
                }
            }

            // CONVERT JS OBJECT TO XML FILE AND ENCODE IT IN 64BIT FOR USE IN SOAP REQ
            var json2xml = convertXML.js2xml(data, { compact: true, spaces: 4 });
            var xmlEncoded64 = Buffer.from(json2xml).toString('base64');

            // SAVE THE XML IN A LOCAL FOLDER 
            var xml = require('fs').writeFileSync(path.join(global.appRoot, '/public/invoice/xml/F' + folio + 'T33.xml'), json2xml, 'utf8');

            getLogin(instruction.creditor, function (err, result) {
                facturacion_cl.loadInvoice(instruction, xmlEncoded64, "2", result, function (err, result) {
                    if (err) {
                        logger.log(err);
                        return callback(err, result);
                    }
                    callback(null, result);
                });
            });
        });
    }

    loadInvoice(instruction, xml, type, login, callback) {
        var args = {};

        logger.log("Connect to ..." + this.endpoint);

        var options = {
            wsdl_options: { timeout: 10000 }
        };

        soap.createClient(this.endpoint, options, function (err, client) {

            if (err) {
                return callback(err, false);
            }

            logger.log("Connected to " + facturacion_cl.endpoint);

            facturacion_cl.login = {
                Usuario: Buffer.from(login.username_fact).toString('base64'),
                Rut: Buffer.from(login.rut_fact).toString('base64'),
                Clave: Buffer.from(login.password_fact).toString('base64'),
                IncluyeLink: "1",
                Puerto: "9978"
            }

            args = {
                login: facturacion_cl.login,
                file: xml,
                formato: type
            }

            logger.log("Creating Invoice");
            client.Procesar(args, function (err, result, rawResponse, soapHeader, rawRequest) {

                if (err) {
                    logger.log("error");
                    return callback(err, false);
                }

                var resultJs = convertXML.xml2js(result.ProcesarResult, { compact: true, spaces: 3 });
                //console.log(resultJs);

                // IF RESULT / CREATION IS TRUE
                if (resultJs.WSPLANO.Detalle.Documento.Resultado._text === "True") {
                    logger.log("Created Invoice");

                    var data = {
                        instruction: instruction.id_cen,
                        company: instruction.creditor,
                        gross_amount: Math.round(instruction.amount * 1.19),
                        net_amount: instruction.amount,
                        folio: parseInt(resultJs.WSPLANO.Detalle.Documento.Folio._text),
                        type: parseInt(resultJs.WSPLANO.Detalle.Documento.TipoDte._text),
                        operation: resultJs.WSPLANO.Detalle.Documento.Operacion._text,
                        urlCedible: Buffer.from(resultJs.WSPLANO.Detalle.Documento.urlCedible._text, 'base64').toString('ascii'),
                        urlOriginal: Buffer.from(resultJs.WSPLANO.Detalle.Documento.urlOriginal._text, 'base64').toString('ascii'),
                        xml: Buffer.from(xml, 'base64').toString('ascii'),
                        created_at: new Date(resultJs.WSPLANO.Detalle.Documento.Fecha._text),
                        reported_by_creditor: true
                    }
                } else {
                    logger.log("Invoice not created for some errors");
                    //logger.log(resultJs.WSPLANO.Detalle.Documento.Error._text);
                    var data = {
                        instruction: instruction.id_cen,
                        company: instruction.creditor,
                        gross_amount: Math.round(instruction.amount * 1.19),
                        net_amount: instruction.amount,
                        error: resultJs.WSPLANO.Detalle.Documento.Error._text,
                        folio: parseInt(resultJs.WSPLANO.Detalle.Documento.Folio._text),
                        type: parseInt(resultJs.WSPLANO.Detalle.Documento.TipoDte._text),
                        operation: resultJs.WSPLANO.Detalle.Documento.Operacion._text,
                        xml: Buffer.from(xml, 'base64').toString('ascii'),
                        created_at: new Date(resultJs.WSPLANO.Detalle.Documento.Fecha._text),
                        reported_by_creditor: true
                    }
                }

                if (data.error) {

                    models.dte_info.findOrCreate({ where: { folio: data.folio } })
                        .spread((record, created) => {
                            record.updateAttributes(data);
                            return callback(data.error, false);
                        })
                        .catch(function (error) {
                            logger.log(error);
                            return callback(err, false);
                        });

                } else {

                    models.dte_info.findOrCreate({ where: { folio: data.folio } })
                        .spread((record, created) => {
                            record.updateAttributes(data);
                        })
                        .catch(function (error) {
                            logger.log(error);
                            return callback(err, false);
                        });

                    logger.log("Loading into CEN");

                    cen.putAuxiliaryFiles(data, function (err, invoice_file_id, file_url) {
                        logger.log("Loaded into CEN");
                        if (err) return callback(err, false);
                        data['invoice_file_id_cen'] = invoice_file_id;
                        data['file_url_cen'] = file_url;

                        cen.postCreateDte(data, function (err, result) {
                            if (err) return callback(err, false);
                            return callback(null, true);
                        });
                    });
                }

            });
        });
    }
}


async function getLastFolio(id, callback) {
    var folioNew;

    await models.dte_info.findAll({
        where: {
            company: id
        },
        limit: 1,
        order: [['folio', 'DESC']]
    }).then(function (result) {
        if (result.length === undefined || result.length === 0) {
            folioNew = 1;
        } else {
            folioNew = result[0].folio + 1;
        }
    });

    await models.dte_info.findOrCreate({ where: { folio: folioNew } })
        .spread((record, created) => {
            return callback(null, folioNew);
        })
        .catch(function (error) {
            logger.log(error);
            return callback(error, false);
        });

}


async function getLogin(id, callback) {

    await models.plants.findAll({
        where: {
            company_cen_id: id
        },
        limit: 1
    }).then(function (result) {
        if (result.length === undefined) {
            return callback(err, "No plants");
        } else {
            return callback(null, result[0]);
        }
    });

}

function numberWithThousands(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

module.exports = FacturacionCL;
