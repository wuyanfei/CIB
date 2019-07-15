const request = require('request')
const encoding = require('encoding');
const moment = require('moment');
const util = require("util")
const parseString = require('xml2js').parseString;
class CIB{
    constructor(customerNo, url, userId, password, appId='1111111', appVersion='1.0'){
        this.customerNo = customerNo
        this.url = url
        this.userId = userId
        this.password = password
        this.appId = appId
        this.appVersion = appVersion
    }
    dateStr(){
      return `${moment().format('YYYY-MM-DD_HH:mm:ss')}_${parseInt(Math.random() * 1000000)}` 
    }
    loginXml(){
      return `<?xml version="1.0" encoding="GBK"?><FOX><SIGNONMSGSRQV1><SONRQ><DTCLIENT>${this.dateStr()}</DTCLIENT><CID>${this.customerNo}</CID><USERID>${this.userId}</USERID><USERPASS>${this.password}</USERPASS><GENUSERKEY>N</GENUSERKEY><APPID>${this.appId}</APPID><APPVER>${this.appVersion}</APPVER></SONRQ></SIGNONMSGSRQV1>`
    }
    /**
     * 发送请求
     * @param {请求的数据} postData 
     */
    http(postData){
      return new Promise((resolve, reject)=>{
        var options = {
          url: this.url,  
          headers: {  
            'Content-Type': 'application/x-fox'
          },  
          body: postData,
          encoding:'utf8'
        };
        request.post(options, function(err, res, html) {
          if(err){
            reject(err)
          }else{
            parseString(html,{explicitArray : false},function(e,r){
              if(e){
                reject(e)
              }else{
                resolve(r)
              }
            })
          }
        });
      })
    }
    /**
     * 用户登录
     * @param {第三方的appid  选填} appId
     * @param {第三方的版本号  选填} appVersion  
     */
    async login(){
      try {
        let xml = this.loginXml() + '</FOX>'
        let data = await this.http(xml)
        return data
      } catch (error) {
        throw error
      }
    }
    /**
     * 主账户信息查询
     * @param {银行卡号} accountNo 
     */
    async queryCurrentBalance(accountNo){
      try {
        let xml = this.loginXml()
        xml = `${xml}<SECURITIES_MSGSRQV1><CURRACCTQUERYTRNRQ><TRNUID>${this.dateStr()}</TRNUID><RQBODY><ACCTID>${accountNo}</ACCTID></RQBODY></CURRACCTQUERYTRNRQ></SECURITIES_MSGSRQV1></FOX>`
        let data = await this.http(xml)
        return data
      } catch (error) {
        throw error
      }
    }
    /**
     * 虚拟子账户信息查询
     * @param {主账户} accountNo 
     * @param {子账户后缀} suffix 
     */
    async queryVirtualSubaccount(accountNo, suffix){
      try {
        let xml = this.loginXml()
        xml = `${xml}<SECURITIES_MSGSRQV1><VSASUBACCTINFOTRNRQ><TRNUID>${this.dateStr()}</TRNUID><INQUIRYINFO><MAINACCT>${accountNo}</MAINACCT><SUBACCT>${suffix}</SUBACCT><STARTROW>1</STARTROW><PATTERN>1</PATTERN></INQUIRYINFO></VSASUBACCTINFOTRNRQ></SECURITIES_MSGSRQV1></FOX>`
        let data = await this.http(xml)
        return data
      } catch (error) {
        throw error
      }
    }
    /**
     * 从虚拟子账户付款
     * @param {付款主账号18位} fromAccount 
     * @param {付款子账户6位} fromSuffix 
     * @param {收款账户} toAccount 
     * @param {收款人} toName 
     * @param {收款金额} amount 
     * @param {是否跨行} interBank 
     * @param {是否跨地区} local 
     * @param {付款备注} remark 
     * @param {付款用途} purpose 
     */
    async pay(fromAccount, fromSuffix, toAccount, toName, amount, interBank, local,bankName,city,remark='ceshi', purpose='服务费'){
      try {
        amount = parseFloat(amount).toFixed(2)
        let xml = this.loginXml()
        xml = `${xml}<SECURITIES_MSGSRQV1><VATTRNRQ><TRNUID>${this.dateStr()}</TRNUID><VATRQ><VATTYPE>1</VATTYPE><MAINACCT>${fromAccount}</MAINACCT><SUBACCT>${fromSuffix}</SUBACCT><XFERINFO><ACCTFROM><ACCTID>${fromAccount}</ACCTID><NAME>44444</NAME></ACCTFROM><ACCTTO INTERBANK='${interBank}' LOCAL='${local}'><ACCTID>${toAccount}</ACCTID><NAME>${toName}</NAME><BANKDESC>${bankName}</BANKDESC><CITY>${city}</CITY></ACCTTO><TRNAMT>${amount}</TRNAMT><PMTMODE>REAL_TIME</PMTMODE><PURPOSE>${purpose}</PURPOSE><DTDUE>${moment().format("YYYY-MM-DD")}</DTDUE><MEMO>${remark}</MEMO></XFERINFO></VATRQ></VATTRNRQ></SECURITIES_MSGSRQV1></FOX>`
        xml = encoding.convert(xml, "gbk");
        let data = await this.http(xml)
        return data
      } catch (error) {
        throw error
      }
    }
    /**
     * 虚拟子账户间转账
     * @param {付款主账户} fromAccount 
     * @param {付款子账户} fromSuffix 
     * @param {收款子账户} toSuffix 
     * @param {付款金额} amount 
     * @param {付款用途} purpose 
     */
    async subaccount2subaccount(fromAccount, fromSuffix, toSuffix, amount, purpose='服务费'){
      try {
        amount = parseFloat(amount).toFixed(2)
        let xml = this.loginXml()
        xml = `${xml}<SECURITIES_MSGSRQV1><VSAINTRSFTRNRQ><TRNUID>${this.dateStr()}</TRNUID><VSAINTRSFRQ><MAINACCT>${fromAccount}</MAINACCT><SUBACCT>${fromSuffix}</SUBACCT><TOSUBACCT>${toSuffix}</TOSUBACCT><TRNAMT>${amount}</TRNAMT><PURPOSE>${purpose}</PURPOSE><DTDUE>${moment().format('YYYY-MM-DD')}</DTDUE></VSAINTRSFRQ></VSAINTRSFTRNRQ></SECURITIES_MSGSRQV1></FOX>`
        xml = encoding.convert(xml, "gbk");
        let data = await this.http(xml)
        return data
      } catch (error) {
        throw error
      }
    }
    /**
     * 查询虚拟子账户交易明细
     * @param {18位主账户} accountNo 
     * @param {6位子账户} suffix 
     * @param {开始日期YYYY-MM-DD} startDate 
     * @param {结束日期YYYY-MM-DD} endDate 
     * @param {页码} pageNo 
     */
    async queryBankFlow(accountNo, suffix,startDate, endDate, pageNo=1){
      try {
        let xml = this.loginXml()
        xml = `${xml}<SECURITIES_MSGSRQV1><VATSTMTTRNRQ><TRNUID>${this.dateStr()}</TRNUID><VATSTMTRQ><VATTYPE>1</VATTYPE><MAINACCT>${accountNo}</MAINACCT><SUBACCT>${suffix}</SUBACCT><ACCTFROM><ACCTID>${accountNo}</ACCTID></ACCTFROM><INCTRAN><DTSTART>${startDate}</DTSTART><DTEND>${endDate}</DTEND><PAGE>${pageNo}</PAGE></INCTRAN></VATSTMTRQ></VATSTMTTRNRQ></SECURITIES_MSGSRQV1></FOX>`
        let data = await this.http(xml)
        return data
      } catch (error) {
        throw error
      }
    }
    /**
     * 根据交易流水号查询交易状态
     * @param {交易流水号ID} orderId 
     */
    async queryOrderStatus(orderId){
      try {
        let xml = this.loginXml()
        xml = `${xml}<SECURITIES_MSGSRQV1><XFERINQTRNRQ><TRNUID>${this.dateStr()}</TRNUID><XFERINQRQ><CLIENTREF>${orderId}</CLIENTREF></XFERINQRQ></XFERINQTRNRQ></SECURITIES_MSGSRQV1></FOX>`
        let data = await this.http(xml)
        return data
      } catch (error) {
        throw error
      }
    }
}
