soap = require('soap');
convertXML = require('xml-js');

class FacturacionCL {

    constructor(config) {

        this.endpoint = "http://ws.facturacion.cl/WSDS/wsplano.asmx?wsdl=0";
        this.config = config;

        this.login = {
            Usuario: Buffer.from("PARRONAL").toString('base64'),
            Rut: Buffer.from("1-9").toString('base64'),
            Clave: Buffer.from("plano91098").toString('base64'),
            IncluyeLink: "1",
            Puerto: ""
        }

        //loadInvoice
        //this.loadInvoice();
        //this.createInvoice33XML();
    }

    createInvoice33XML(instr, payment_matrix) {

        var debtor = instr.debtor_info;
        var creditor = instr.creditor_info;

        getLastFolio(function (result) {
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
                                FchEmis: "2018-10-09",
                                FmaPago: 2,
                                TermPagoGlosa: "CREDITO SII",
                                FchVenc: "2018-10-12"
                            },
                            Emisor: {
                                RUTEmisor: numberWithThousands(creditor.rut) + "-" + creditor.verification_code,
                                RznSoc: creditor.business_name,
                                GiroEmis: creditor.commercial_business,
                                CorreoEmisor: "test@wemworld.it",
                                Acteco: 401019,
                                DirOrigen: creditor.commercial_address,
                                CmnaOrigen: "",
                                CiudadOrigen: ""
                            },
                            Receptor: {
                                RUTRecep: numberWithThousands(debtor.rut) + "-" + debtor.verification_code,
                                RznSocRecep: debtor.business_name,
                                GiroRecep: debtor.commercial_business,
                                Contacto: "",
                                DirRecep: debtor.commercial_address,
                                CmnaRecep: "",
                                CiudadRecep: ""
                            },
                            Totales: {
                                MntNeto: instr.amount,
                                MntExe: 0,
                                TasaIVA: 19,
                                IVA: instr.amount_gross - instr.amount,
                                MntTotal: instr.amount_gross
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
                            PrcItem: instr.amount,
                            MontoItem: instr.amount
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
            var xml = require('fs').writeFileSync('./public/invoice/F' + folio + 'T33.xml', json2xml, 'utf8');

            facturacion_cl.loadInvoice(xmlEncoded64, "2");

        });
    }

    loadInvoice(xml, type) {
        var args = {};

        soap.createClient(this.endpoint, function (err, client) {

            args = {
                login: facturacion_cl.login,
                file: xml,
                formato: type
            }

            client.Procesar(args, function (err, result, rawResponse, soapHeader, rawRequest) {

                if (err) return;

                var resultJs = convertXML.xml2js(result.ProcesarResult, { compact: true, spaces: 3 });
                console.log(resultJs);

                // IF RESULT / CREATION IS TRUE
                if (resultJs.WSPLANO.Detalle.Documento.Resultado._text === "True") {
                    var data = {
                        folio: parseInt(resultJs.WSPLANO.Detalle.Documento.Folio._text),
                        type: parseInt(resultJs.WSPLANO.Detalle.Documento.TipoDte._text),
                        operation: resultJs.WSPLANO.Detalle.Documento.Operacion._text,
                        urlCedible: resultJs.WSPLANO.Detalle.Documento.urlCedible._text,
                        urlOriginal: resultJs.WSPLANO.Detalle.Documento.urlOriginal._text,
                        created_at: resultJs.WSPLANO.Detalle.Documento.Fecha._text
                    }
                } else {
                    var data = {
                        error: resultJs.WSPLANO.Detalle.Documento.Error._text,
                        folio: parseInt(resultJs.WSPLANO.Detalle.Documento.Folio._text),
                        type: parseInt(resultJs.WSPLANO.Detalle.Documento.TipoDte._text),
                        operation: resultJs.WSPLANO.Detalle.Documento.Operacion._text,
                        created_at: resultJs.WSPLANO.Detalle.Documento.Fecha._text
                    }
                }

                models.dte_info.create(data).then(() => {
                    return;
                });

                // result is a javascript object
                // rawResponse is the raw xml response string
                // soapHeader is the response soap header as a javascript object
                // rawRequest is the raw xml request string
            })

        });
    }
}

function getLastFolio(callback) {
    models.dte_info.findAll({ limit: 1, order: [['folio', 'DESC']] }).then(function (result) {
        callback(result[0].folio + 1);
    });
}

function numberWithThousands(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

module.exports = FacturacionCL;
