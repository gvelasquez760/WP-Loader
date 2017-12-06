const express = require('express')
const app = express()
const request = require('request')
const WooCommerceAPI = require('woocommerce-api')
const async = require('async')

var dataObj = {
  settings: {
    'tax_status': 'none',
    'weight_type': 'greater',
    'price_type': 'excl',
    'calculation_type': 'line',
    'title' : 'Costo despacho'
  }
};

var WooCommerce = new WooCommerceAPI({
  url: 'http://52.201.187.33',
  consumerKey: 'ck_',
  consumerSecret: 'cs_',
  wpAPI: true,
  version: 'wc/v2'
});

function removeShippingZones() {
  shippingArrayID = [];
  WooCommerce.get('shipping/zones', function(err, data, res) {
    var shippingArrayID = []
    var obj = JSON.parse(res);
    for (var key in obj) {
      shippingArrayID.push(obj[key]["id"]);
    }
    //async.eachSeries(shippingArrayID, function(data, callback) {
    //  WooCommerce.delete('shipping/zones/' + data + '?force=true', function(err, data, res) {
    //    console.log(res);
    //    callback(null);
    //  });
    //});
  });
}

function updateEveryMethod() {
  shippingArrayID = [];

  WooCommerce.get('shipping/zones', function(err, data, res) {
    var obj = JSON.parse(res);
    for (var key in obj) {
      shippingArrayID.push(obj[key]["id"]);
    }
    //console.log(shippingArrayID);
    //shippingArrayID = ['1531'];
    async.eachSeries(shippingArrayID, function(data, callback) {
      methodArrayID = [];
      WooCommerce.get('shipping/zones/' + data + '/methods', function(err, datar, res) {
        var obj = JSON.parse(res);
        for (var key in obj) {
          methodArrayID.push(obj[key]["id"]);
        }
        async.eachSeries(methodArrayID, function(inner, callback) {
          WooCommerce.put('shipping/zones/' + data + '/methods/' + inner, dataObj, function(err, data, res) {
            console.log("updated!");
            callback(null);
          });
        });
        callback(null);
      });
    }, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log('everything ok!');
    });
  });
}

//updateEveryMethod();
//removeShippingZones();


//WooCommerce.get('shipping/zones/21/methods/27', function(err, data, res) {
//  console.log(res);
//});

//WooCommerce.put('shipping/zones/21/methods/27', data, function(err, data, res) {
//  console.log(res);
//});

//WooCommerce.delete('shipping/zones/21?force=true', function(err, data, res) {
//  console.log(res);
//});
