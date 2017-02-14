import {baidu} from 'yf-website-tool'
import config from '../key'
import ejs from 'ejs'

const emailTemplate = `
  <h4>Domain: http://<%= domain%> 百度解析结果</h4>
  <h4>收录结果:</h4>
  <br/>
  <p><b><%= site%><b/></p>
  <h4>关键字查询结果</h4>
  <% keywords.forEach(function(item){
    %>
  <p><b><%= item.keyword %>:</b> <% if(!item.rank) {%>未找到<% }else{ %>在第 <%= item.rank.page %> 页<% }%></p>
  <%}) %>
`

const jobFun = async () => {
  for(let i = 0; i < config.baidu.sites.length; i++){
    let site = config.baidu.sites[i]
    let data = {domain: site.domain}
    try{
      data.site = await baidu.spider.checkSite(site.domain)
      data.keywords = await baidu.spider.checkKeywords(site)
      data.push = await baidu.pusher.pushUrls(site)
      const result = ejs.render(emailTemplate, data)
      console.log(result)
      console.log(data)
    }catch(e){
      console.log(e)
    }
  }
}

jobFun()
