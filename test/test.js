import {baidu} from 'yf-website-tool'
import config from '../key'
import mailer from '../email'
mailer.init(config.mail)

const jobFun = async () => {
  for(let i = 0; i < config.baidu.sites.length; i++){
    let site = config.baidu.sites[i]
    let data = {domain: site.domain}
    try{
      data.site = await baidu.crawler.checkSite(site.domain)
      data.keywords = await baidu.crawler.checkKeywords(site)
      data.push = await baidu.pusher.pushUrls(site)
      console.log(JSON.stringify(data))
      mailer.send(
        {
          to: site.result.to,
          subject: 'BaiduToolMessage',
          result: JSON.stringify(data)
        }, (err, data) => {
          if(err)
            console.log(err)
        }
      )

    }catch(e){
      console.log(e)
    }
  }
}

jobFun()
