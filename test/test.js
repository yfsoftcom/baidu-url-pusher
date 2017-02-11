import {baidu} from 'yf-website-tool'
import config from '../key'
import ejs from 'ejs'


const emailTemplate = `
  <h5>Domain: http://<%= domain%>百度解析结果</h5>
  <h6>收录结果:</h6>
  <p><b><%= site%><b/></p>
  <hr/>
  <h6>关键字查询结果</h6>
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
      console.log(result)
    }catch(e){
      console.log(e)
    }
  }
}

jobFun()
