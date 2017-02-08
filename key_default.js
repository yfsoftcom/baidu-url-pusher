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
        result: {to: '1794947912@qq.com', subject: '百度收录', page: 5},
        domain: 'www.xinyangjlm.com',
        keywords: ['新扬卷帘门', '扬州卷帘门'],
        sitemap: 'baidusitemap.xml',
        update: false,
        urls: false
      }
    ]
  }


}
