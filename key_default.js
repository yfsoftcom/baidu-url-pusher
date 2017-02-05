module.exports = {
  mail: {
    service: 'qq',
    user: '*****',
    pass: '*****'
  },
  schedule: '*/15 * * * *',
  baidu: {
    token: '*****',
    sites:[
      {
        result: {to: '1794947912@qq.com', subject: '百度收录'},
        domain: 'www.xinyangjlm.com',
        update: false,
        urls:
          'http://www.xinyangjlm.com/index.html\n' +
          'http://www.xinyangjlm.com/aboutus/index.html\n' +
          'http://www.xinyangjlm.com/categories/index.html\n' +
          'http://www.xinyangjlm.com/2016-11-21-9.html\n' +
          'http://www.xinyangjlm.com/2016-11-21-8.html\n' +
          'http://www.xinyangjlm.com/2016-11-21-7.html\n' +
          'http://www.xinyangjlm.com/2017-02-04-6.html\n' +
          'http://www.xinyangjlm.com/2016-11-21-5.html\n' +
          'http://www.xinyangjlm.com/2016-11-21-4.html\n' +
          'http://www.xinyangjlm.com/2016-11-21-3.html\n' +
          'http://www.xinyangjlm.com/2016-11-21-2.html\n' +
          'http://www.xinyangjlm.com/2016-11-21-1.html'
      }
    ]
  }


}
