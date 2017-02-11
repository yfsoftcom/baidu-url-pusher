import {baidu} from 'yf-website-tool'
import config from '../key'

const jobFun = async () => {
  for(let i = 0; i < config.baidu.sites.length; i++){
    let site = config.baidu.sites[i]
    let data = {domain: site.domain}
    try{
      data.site = await baidu.crawler.checkSite(site.domain)
      data.keywords = await baidu.crawler.checkKeywords(site)
      data.push = await baidu.pusher.pushUrls(site)
      console.log(JSON.stringify(data))
    }catch(e){
      console.log(e)
    }
  }
}

jobFun()
