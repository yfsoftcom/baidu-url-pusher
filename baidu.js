var _ = require('lodash');
var parallel = require('async/parallel');
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

function check(){
  sites.forEach(function(site){
    parallel([
      function(callback) {
        checkSite(callback, site);
      },
      function(callback) {
        checkKeywords(callback, site);
      }
    ],
    function(err, results) {
      if(err){
        emailer.send({
          to: site.result.to,
          subject: 'Ops,Request Error@ ' + new Date().toLocaleString(),
          result: err
        } , mailCallback);
      }else{
        if(results[0][1]){
          emailer.send({
            to: site.result.to,
            subject: 'Yeah,' + site.domain + site.result.subject + '@ ' + new Date().toLocaleString(),
            result: results[0][0] + ';关键字排名:' + results[1]
          }, mailCallback);
        }else{
          emailer.send({
            to: site.result.to,
            subject: 'Ops,'+ site.domain + site.result.subject + '@ ' + new Date().toLocaleString(),
            result: results[0][0] + ';关键字排名:' + results[1]
          }, mailCallback);
        }
      }
    });
  });

}


function checkKeywords(cb, site){
  var url = 'http://www.baidu.com/s?wd=' + encodeURIComponent(site.keywords.join(''));
  request(url, function(error, response, body){
    if (!error && response.statusCode == 200) {
      var doc = $(body);
      var list = doc.find('#content_left .result>.f13>a');
      var l = list.length;
      for(var i = 0 ; i < l ; i++){
        if(_.startsWith(list[i].innerHTML, site.domain)){
          //在首页
          cb(null, '在首页,NO:' + (i+1));
          return;
        }
      }
      cb(null, '不在首页');
    }else{
      cb(error);
    }
  });
}

function checkSite(cb, site){
  var url = 'http://www.baidu.com/s?wd=site%3A' + site.domain;
  request(url, function(error, response, body){
    if (!error && response.statusCode == 200) {
      var doc = $(body);
      if(doc.find('.content_none').length > 0){
        //
        var result = 'Ops,'+ site.domain + ',has not get yet~';
        cb(null, result, true);
      }else{
        var $result = doc.find('.site_tip p b');
        var result = 'Yeah,' + $result.text();
        cb(null, result, false);

      }
    }else{
      cb(error);
    }
  });
}
module.exports.push = push;
module.exports.check = check;
