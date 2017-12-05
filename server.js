const express = require('express')
const app = express()
const request = require('request')
const Browser = require('zombie')
const WooCommerceAPI = require('woocommerce-api')

var async = require('async');

//zones= 21 -1529
//methods 27 - 1615

var data = {
  settings: {
    'tax_status': 'none',
    'weight_type': 'greater',
    'price_type': 'excl',
    'calculation_type': 'line'
  }
};


var WooCommerce = new WooCommerceAPI({
  url: 'http://52.201.187.33',
  consumerKey: '',
  consumerSecret: '',
  wpAPI: true,
  version: 'wc/v2'
});

WooCommerce.get('shipping/zones', function(err, data, res) {
  var shippingArrayID = []
  var obj = JSON.parse(res);
  for (var key in obj) {
    shippingArrayID.push(obj[key]["id"]);
  }


  async.eachSeries(shippingArrayID, function(data, callback) {
    WooCommerce.delete('shipping/zones/' + data + '?force=true', function(err, data, res) {
      console.log(res);
      callback(null);
    });

  });

});




//WooCommerce.get('shipping/zones/21/methods/27', function(err, data, res) {
//  console.log(res);
//});

//WooCommerce.put('shipping/zones/21/methods/27', data, function(err, data, res) {
//  console.log(res);
//});

//WooCommerce.delete('shipping/zones/21?force=true', function(err, data, res) {
//  console.log(res);
//});
