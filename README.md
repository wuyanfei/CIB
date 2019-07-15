# 兴业银行银企直连系统开发接口，nodejs版
```
//查询主账号余额
let test2 = async (obj)=>{
  let userId = 'qw1'
  let password = 'a1111111'
  let instance = new CIB('1100343164','http://127.0.0.1:8007',userId,password)
  let data = await instance.queryCurrentBalance('117010100100050880961208')
  console.log(util.inspect(data,{depth:null}))
}
//查询虚拟账户余额
let test3 = async (obj)=>{
  let userId = 'qw1'
  let password = 'a1111111'
  let instance = new CIB('1100343164','http://127.0.0.1:8007',userId,password)
  let data = await instance.queryVirtualSubaccount('117010100100050880','010488')
  console.log(util.inspect(data,{depth:null}))
}
//虚拟账户打款
let test4 = async (obj)=>{
  let userId = 'qw1'
  let password = 'a1111111'
  let instance = new CIB('1100343164','http://127.0.0.1:8007',userId,password)
  let data = await instance.pay('117010100100050880','961208','6225885123771966','无言非',30.5,'N','Y','中国工商银行股份有限公司北京通州支行新华分理处','北京')
  console.log(util.inspect(data,{depth:null}))
}
//虚拟账户间打款
let test5 = async (obj)=>{
  let userId = 'qw1'
  let password = 'a1111111'
  let instance = new CIB('1100343164','http://127.0.0.1:8007',userId,password)
  let data = await instance.subaccount2subaccount('117010100100050880','961208','010488',30)
  console.log(util.inspect(data,{depth:null}))
}
//查询虚拟账户流水
let test6 = async (obj)=>{
  let userId = 'qw1'
  let password = 'a1111111'
  let instance = new CIB('1100343164','http://127.0.0.1:8007',userId,password)
  let data = await instance.queryBankFlow('117010100100050880','961208','2019-07-11','2019-07-12')
  console.log(util.inspect(data,{depth:null}))
}
//查询转账状态
let test7 = async (obj)=>{
  let userId = 'qw1'
  let password = 'a1111111'
  let instance = new CIB('1100343164','http://127.0.0.1:8007',userId,password)
  let data = await instance.queryOrderStatus('2019-07-13_17:24:19_80096')
  console.log(util.inspect(data,{depth:null}))
}
```
