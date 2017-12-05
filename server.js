const express = require('express')
const app = express()
const request = require('request')
const Browser = require('zombie')
const WooCommerceAPI = require('woocommerce-api')

var async = require('async');

//zones= 1530 -3110
//methods 1616 - 3204

var dataObj = {
  settings: {
    'tax_status': 'none',
    'weight_type': 'greater',
    'price_type': 'excl',
    'calculation_type': 'line'
  }
};


var WooCommerce = new WooCommerceAPI({
  url: 'http://52.201.187.33',
  consumerKey: 'ck_c9501002eeb2bfbd04be7596cd0fc8893bad38f1 ',
  consumerSecret: 'cs_0bd7e5cf6b513bce52a733320fca69aef74c5d76',
  wpAPI: true,
  version: 'wc/v2'
});


function getShippingZones() {

  WooCommerce.get('shipping/zones', function(err, data, res) {
    var shippingArrayID = []
    var obj = JSON.parse(res);
    for (var key in obj) {
      shippingArrayID.push(obj[key]["id"]);
    }

    console.log(shippingArrayID);

    //async.eachSeries(shippingArrayID, function(data, callback) {
    //  WooCommerce.delete('shipping/zones/' + data + '?force=true', function(err, data, res) {
    //    console.log(res);
    //    callback(null);
    //  });
    //});

  });

}



//WooCommerce.get('shipping/zones/21/methods/27', function(err, data, res) {
//  console.log(res);
//});

//WooCommerce.put('shipping/zones/21/methods/27', data, function(err, data, res) {
//  console.log(res);
//});

//WooCommerce.delete('shipping/zones/21?force=true', function(err, data, res) {
//  console.log(res);
//});




function updateEveryMethod() {

  shippingArrayID = [];


  WooCommerce.get('shipping/zones', function(err, data, res) {
    var obj = JSON.parse(res);
    for (var key in obj) {
      shippingArrayID.push(obj[key]["id"]);
    }

    //console.log(shippingArrayID);
    shippingArrayID = ['1531'];


    async.eachSeries(shippingArrayID, function(data, callback) {
      methodArrayID = [];
      WooCommerce.get('shipping/zones/' + data + '/methods', function(err, data2, res) {
        var obj = JSON.parse(res);
        for (var key in obj) {
          methodArrayID.push(obj[key]["id"]);
        }

        console.log("============");
        console.log(data);

        //here =============================
        async.eachSeries(methodArrayID, function(inner, callback) {
          WooCommerce.put('shipping/zones/' + data + '/methods/' + inner, dataObj, function(err, data, res) {
            console.log(res);
            console.log("updated!");
            callback(null);
          });




        });
        //=================================


        callback(null);
      });
    }, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log('ok');
    });




  });

}

updateEveryMethod();
