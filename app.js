import {baidu} from 'yf-website-tool'
import schedule from 'node-schedule'
import config from './key'
import mailer from './email'
import ejs from 'ejs'
import moment from 'moment'

mailer.init(config.mail)


const emailTemplate = `
  <h3>Domain: http://<%= domain%> 百度解析结果</h3>
  <h4>收录结果:</h4>
  <p><b><%= site%><b/></p>
  <h4>关键字查询结果<h4/>
  <% keywords.forEach(function(item){
    %>
  <p><b><%= item.keyword %>:</b> <%= item.rank %></p>
  <%}) %>
`

const jobFun = async () => {
  for(let i = 0; i < config.baidu.sites.length; i++){
    let site = config.baidu.sites[i]
    let data = {domain: site.domain}
    try{
      data.site = await baidu.crawler.checkSite(site.domain)
      data.keywords = await baidu.crawler.checkKeywords(site)
      data.push = await baidu.pusher.pushUrls(site)
      const result = ejs.render(emailTemplate, data)
      mailer.send(
        {
          to: site.result.to,
          subject: site.domain + '@' + moment().format('MM/DD HH:mm'),
          result: result,
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

schedule.scheduleJob(config.schedule, jobFun)
