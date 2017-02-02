var request = require('request');
var jsdom = require("jsdom");
var config = require('./key.js');

var window = jsdom.jsdom().defaultView;
var $ = require('jquery')(window);
var emailer = require('./email.js');
emailer.init(config.mail);


var sites = config.baidu.sites;
var token = config.baidu.token;

function buildBaiduRequest(method, domain, urls){
  var url = 'http://data.zz.baidu.com/' + method + '?site=' + domain + '&token=' + token;
  return {
    method: 'POST',
    uri: url,
    headers: {
     'Content-Type': 'text/plain'
    },
    body: urls
  };
}

function buildBaiduUrls(domain, urls){
  return buildBaiduRequest('urls', domain, urls);
}

function buildBaiduUpdate(domain, urls){
  return buildBaiduRequest('update', domain, urls);
}

function pushCallback(error, response, body){
  if (!error) {
    switch (response.statusCode) {
      case 200:
        console.log('push ok :' + body)
        break;
      default:
        console.log('push error :' + body);
    }
  }else{
    console.log(error);
  }
}

function push(){
  sites.forEach(function(site){
    if(site.update){
      request(buildBaiduUpdate(site.domain, site.update), pushCallback);
    }
    if(site.urls){
      request(buildBaiduUrls(site.domain, site.urls), pushCallback);
    }
  });
}


function mailCallback(err, data){
  if(err){
    console.log(err);
  }else{
    console.log(data);
  }
};

function checkSite(){
  sites.forEach(function(site){
    var url = 'http://www.baidu.com/s?wd=site%3A' + site.domain;
    request(url, function(error, response, body){
      if (!error && response.statusCode == 200) {
        var doc = $(body);
        if(doc.find('.content_none').length > 0){
          //
          var result = 'O NO, domain: '+ site.domain + ' ,has not get yet~ @ ' + new Date().toLocaleString();
          emailer.send({to: site.result.to, subject: site.result.subject, result: result} , mailCallback);
        }else{
          var $result = doc.find('.site_tip p b');
          var result = 'O YE, domain: '+ site.domain + ' , ' + $result.text() + '@ ' + new Date().toLocaleString();
          emailer.send({to: site.result.to, subject: site.result.subject, result: result}, mailCallback);
        }
      }else{
        console.log(error);
      }
    });
  });
}
module.exports.push = push;
module.exports.checkSite = checkSite;
