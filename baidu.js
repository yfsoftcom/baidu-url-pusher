var _ = require('lodash');
var parallel = require('async/parallel');
var each = require('async/each');
var map = require('async/map');
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

function execute(url, callback){
  request(url, function(error, response, body){
    if (!error && response.statusCode == 200) {
      callback(null, body);
    }else{
      callback(error);
    }
  });
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
        emailer.send({
          to: site.result.to,
          subject: results[0][1]? ('Yeah,' + site.domain + site.result.subject + '@ ' + new Date().toLocaleString()) : ('Ops,'+ site.domain + site.result.subject + '@ ' + new Date().toLocaleString()),
          result: results[0][0] + ';<br/>Keywords Sort:<br/>' + results[1]
        }, mailCallback);

      }
    });
  });

}


function checkKeyword(domain, keyword, cb){
  each([1, 2, 3, 4, 5],
    function(pn, callback){
      var url = 'http://www.baidu.com/s?wd=' + encodeURIComponent(keyword) + '&pn=' + ((pn-1)*10);
      execute(url, function(err, body){
        if(err) { cb(err); return;}
        var doc = $(body);
        var list = doc.find('#content_left .result>.f13>a');
        var l = list.length;

        for(var i = 0 ; i < l ; i++){
          if(_.startsWith(list[i].innerHTML, domain)){
            callback({pn: pn, no: (i+1)});
            return;
          }
        }
        callback();
      });
    },
    function(error){
      if(error){
        cb(null, "Find Keyword: " + keyword + " In Page: " + error.pn + ' ; NO: ' + error.no);
      }else{
        cb(null, 'Cant Find Keyword: ' + keyword + '.');
      }
    }
  )

}

function checkKeywords(cb, site){
  map(site.keywords,
    function(keyword, callback){
      checkKeyword(site.domain, keyword, callback);
    },
    function(error, results){
      if(error){
        cb(error); return;
      }
      cb(null, results.join('<br/>'));
    }
  )
}

function checkSite(cb, site){
  var url = 'http://www.baidu.com/s?wd=site%3A' + site.domain;
  execute(url, function(err, body){
    if(err) { cb(err); return;}
    var doc = $(body);
    if(doc.find('.content_none').length > 0){
      var result = 'Ops,'+ site.domain + ',has not get yet~';
      cb(null, result, false);
    }else{
      var $result = doc.find('.site_tip p b');
      var result = 'Yeah,' + $result.text();
      cb(null, result, true);
    }
  })
}
module.exports.push = push;
module.exports.check = check;
