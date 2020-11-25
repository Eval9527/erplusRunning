const axios = require('axios')
const config = require('./config')

const APP_ID = config.APP_ID
const APP_SECRET = config.APP_SECRET


function getHolidayURL() {
  const HOLIDAY_URL1 = `https://www.mxnzp.com/api/holiday/single/${getTime(2)}?app_id=${APP_ID}&app_secret=${APP_SECRET}`
// const HOLIDAY_URL2 = `https://tool.bitefu.net/jiari/?d=${getTime(2)}`
  const HOLIDAY_URL2 = `http://timor.tech/api/holiday/info/${getTime(3)}`

  return config.HOLIDAY_SWITCH === 1 && APP_ID && APP_SECRET ? HOLIDAY_URL1 : HOLIDAY_URL2
}


function getTime(type) {
  const time = new Date()
  const month = time.getMonth() > 8 ? time.getMonth()+1 : "0"+ time.getMonth()+1
  const day = time.getDate() > 8 ? time.getDate() : "0"+ time.getDate()
  switch (type) {
    case 1:
      return `${month}月${day}日 ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
    case 2:
      return `${"" + time.getFullYear() + month + day}`
    case 3:
      return `${"" + time.getFullYear() + "-" + month+ "-" + day}`
  }
}

async function getHolidayType() {
  // 工作日（0）、休息日（1）和节假日（2）
  console.log('请求 HOLIDAY_URL 地址为：' + getHolidayURL())
  const res = await axios.get(getHolidayURL())
  if (res.status === 200) {
    if (config.HOLIDAY_SWITCH === 1 && res.data.code === 1) {
      return Number(res.data.data.type)
    }
    // if (config.HOLIDAY_SWITCH === 2 || !APP_ID || !APP_SECRET) {
    //   return Number(res.data)
    // }
    if (config.HOLIDAY_SWITCH === 2 || !APP_ID || !APP_SECRET) {
      console.log(res.data.type)
      return Number(res.data.type.type)
    }
  }
  return -1
}


module.exports.getTime = getTime
module.exports.getHolidayType = getHolidayType
