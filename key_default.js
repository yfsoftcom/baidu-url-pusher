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
        result: {to: '1794947912@qq.com', subject: '新版百度收录结果'},
        domain: 'www.xinyangjlm.com',
        update: false,
        urls:
          'http://www.xinyangjlm.com/index.html\n' +
          'http://www.xinyangjlm.com/aboutus/index.html\n' +
          'http://www.xinyangjlm.com/categories/index.html\n' +
          'http://www.xinyangjlm.com/%E9%98%B2%E7%81%AB%E5%8D%B7%E5%B8%98%E9%97%A8/index.html\n' +
          'http://www.xinyangjlm.com/%E7%94%B5%E5%8A%A8%E4%BC%B8%E7%BC%A9%E9%97%A8/index.html\n' +
          'http://www.xinyangjlm.com/%E9%9A%94%E7%A6%BB%E6%A0%8F/index.html\n' +
          'http://www.xinyangjlm.com/%E9%92%A2%E7%BB%93%E6%9E%84%E8%BD%A6%E6%A3%9A/index.html\n' +
          'http://www.xinyangjlm.com/%E8%87%AA%E5%8A%A8%E6%84%9F%E5%BA%94%E9%97%A8/index.html\n' +
          'http://www.xinyangjlm.com/%E5%A0%86%E7%A7%AF%E9%97%A8/index.html\n' +
          'http://www.xinyangjlm.com/%E5%BF%AB%E9%80%9F%E9%97%A8/index.html\n' +
          'http://www.xinyangjlm.com/%E7%94%B5%E5%8A%A8%E5%B9%B3%E7%A7%BB%E9%97%A8/index.html\n' +
          'http://www.xinyangjlm.com/%E6%B0%B4%E6%99%B6%E5%8D%B7%E5%B8%98%E9%97%A8/index.html\n' +
          'http://www.xinyangjlm.com/%E9%98%B2%E7%81%AB%E5%8D%B7%E5%B8%98%E9%97%A8/index.html'

      }
    ]
  }


}
