const express = require('express')
const app = express()
const request = require('request')
const async = require('async')

var dataObj = [{
  "Estamento": "Profesional",
  "Nombre completo": "ABDO CALVO, YASMIN AMAL",
  "Cargo o función": "PROFESIONAL SECTORIAL",
  "Grado EUS / Cargo con jornada": 13,
  "Calificación profesional o formación": "MÉDICO VETERINARIO",
  "Región": "XV Región de Arica y Parinacota",
  "Asignaciones especiales": "(37)(33)",
  "Unidad monetaria": "Pesos",
  "Remuneración bruta mensualizada": "2.200.803",
  "Montos y horas extraordinarias diurnas": "$78.660",
  "horas extra diurna": 12,
  "Montos y horas extraordinarias nocturnas": "No tiene",
  "Montos y horas extraordinarias festivas": "No tiene",
  "Fecha de inicio dd/mm/aa": "01-09-2013",
  "Fecha de término dd/mm/aa": "31-12-2017",
  "Declaración de intereses y patrimonio": "No",
  "Viáticos": "No informa",
  "Observaciones": "Sin observaciones"
}, ];

var headerObj = {
  'content-type': 'application/json',
  'kbn-version': '6.1.0',
  'Accept': 'text/plain, */*; q=0.01',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'en-US,en;q=0.9',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36'
}


function updateEveryMethod() {
  console.log("test");
  shippingArrayID = [];
  async.eachSeries(dataObj, function(data, callback) {

    request.post({
      gzip: true,
      headers: headerObj,
      url: 'http://35.168.202.205:5601/api/console/proxy?path=sag%2Fsag%2F&method=POST',
      body: JSON.stringify(data)
    }, function(error, response, body) {
      callback(null);
      console.log(body);
    });

  });


}

updateEveryMethod();
