const express = require('express')
const app = express()
const request = require('request')
const Browser = require('zombie')

const csvFilePath = 'despacho.csv'
const csv = require('csvtojson')
var json2csv = require('json2csv');
var fs = require('fs');
var fields = ['zone', 'continent', 'country', 'state', 'postcode', 'class', 'weight', 'price', 'quantity', 'volume', 'cost', 'comment', 'active'];

var originArray = [];

var result = [];

csv()
  .fromFile(csvFilePath)
  .on('json', (jsonObj) => {
    originArray.push(jsonObj);
  })
  .on('end', (endObj) => {
    startProcess();
  })


function startProcess() {

  var idx = 0;
  var tempSet = [];

  for (var i = 0; i < originArray.length; i++) {
    idx++;
    tempSet.push(originArray[i]);
    if (idx == 15) {
      console.log("end first set");
      configureSet(tempSet);
      idx = 0;
      tempSet = [];
    }

  }

  console.log(result);
  generateCSV(result)

}

function configureSet(tempSet) {
  //  console.log(tempSet);

  var zoneName = tempSet[0]["Nombre Comuna"];
  var first = true;

  for (var i = 0; i < tempSet.length; i++) {
    var objResult = {};
    if (first) {
      objResult.zone = zoneName;
      first = false;
    }
    objResult.weight = tempSet[i]["Pmin"].replace(",", ".") + "-" + tempSet[i]["Pmax"].replace(",", ".");
    objResult.cost = tempSet[i]["Valor"];
    objResult.state = "CL:" + tempSet[i]["numberID"];
    objResult.active = 1;
    result.push(objResult);
  }
}

function generateCSV(data) {

  var csv = json2csv({
    data: data,
    fields: fields,
    del: ','
  });

  fs.writeFile('file.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved');
  });


}


function init() {

  var jsonDataObj = {
    "changes[zone_locations][]": "state:CL:446",
    "changes[zone_name]": "TEST1",
    "wc_shipping_zones_nonce": "70530c4ed4",
    "zone_id": ""
  };

  var options = {
    url: 'http://52.201.187.33/wp-admin/admin-ajax.php?action=woocommerce_shipping_zone_methods_save_changes',
    form: jsonDataObj,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    },
    json: true,
    method: 'POST'
  };

  request(options, function(error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.


    addShippingMethod(body.data.zone_id);
  });

}

function addShippingMethod(zoneID) {

  var jsonDataObj = {
    "method_id": "betrs_shipping",
    "wc_shipping_zones_nonce": "wasdsadas",
    "wc_shipping_zones_nonce": "70530c4ed4",
    "zone_id": zoneID
  };

  var options = {
    url: 'http://52.201.187.33/wp-admin/admin-ajax.php?action=woocommerce_shipping_zone_add_method',
    form: jsonDataObj,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    },
    json: true,
    method: 'POST'
  };


  request(options, function(error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.

    //  editShippingMethod(zoneID, body.data.instance_id);

  });

}




function editShippingMethod(zoneID, instanceID) {

  var jsonDataObj = '';

  var options = {
    url: 'http://52.201.187.33/wp-admin/admin.php?page=wc-settings&tab=shipping&instance_id=' + instanceID,
    body: jsonDataObj,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    },
    json: true,
    method: 'POST'
  };


  request(options, function(error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.



  });




}
