var nodemailer = require('nodemailer');
var transporter;
var initOptions;
module.exports = {
  init: function(options){
    options = options || {};
    initOptions = options;
    transporter = nodemailer.createTransport({
        //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
        service: options.service,
        port: 465, // SMTP 端口
        secureConnection: true, // 使用 SSL
        auth: {
            user: options.user,
            pass: options.pass
        }
    });
  },
  send: function(options, callback){
    if(!transporter){
      callback('error: has not init mailer transporter');
      return;
    }
    options = options || {};
    var mailOptions = {
        from: initOptions.user, // 发件地址
        to: options.to, // 收件列表
        subject: options.subject, // 标题
        //text和html两者只支持一种
        text: options.result  ,
        html: '<p>' + options.result + '</p>' // html 内容
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            callback(error)
        }else{
          callback(null, 'Message sent: ' + info.response)
        }

    });
  }
};
