const schedule = require('node-schedule');
const axios = require('axios')
const config = require('./config')

const TOKEN = config.TOKEN
const APP_ID = config.APP_ID
const APP_SECRET = config.APP_SECRET
const AUTH_TOKEN = `Bearer ${TOKEN}`;
const TASK_URL = `https://www.erplus.co/taskWeb/filterUserTaskList?pageSize=20&currentPage=0&contactId=0&order=0&taskType=0&taskStatus=1,2,7&taskFeatures=2,4,1,3&startDate=1972-01-01&endDate=2099-12-30&personLabelType=0&personLabelIds=-1&labelType=0&labelIds=-1&prefix=`;
const START_URL = `https://www.erplus.co/task/v1/statuses/start`;
// const HOLIDAY_URL1 = `https://www.mxnzp.com/api/holiday/single/${getTime(2)}?app_id=${APP_ID}&app_secret=${APP_SECRET}`
const HOLIDAY_URL2 = `https://tool.bitefu.net/jiari/?d=${getTime(2)}`

axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

const  scheduleCronstyle = ()=>{
  // 每天的早上 9 点 0 分 0 秒触发
  schedule.scheduleJob('0 0 9 * * *',()=>{
    start()
    console.log('定时任务启动:' + getTime(1));
  });
}

function getTime(type) {
  const time = new Date()
  switch (type) {
    case 1:
      return `${time.getMonth()+1}月${time.getDate()}日 ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
    case 2:
      return `${time.getFullYear()}${time.getMonth()+1}${time.getDate()}`
  }
}

async function getHolidayType() {
  const res = await axios.get(HOLIDAY_URL2)
  // 工作日（0）、休息日（1）和节假日（2）
  if (res.status === 200) {
    return Number(res.data)
  }
  return -1
}

async function start() {
  console.log(`---------`)
  console.log(`启动任务`)
  const holidayType = await getHolidayType()
  if (holidayType === 2 || (holidayType === 1 && new Date().getDay() === 0)) {
    // 默认单休
    console.log(`当前为节假日或周日，暂停打卡`)
    return
  }

  const res = await axios.get(TASK_URL);
  if (res.status === 200) {
    const itemList = res.data.pageItems;
    const doingList = itemList.filter((ele) => {
      return ele.status === 2;
    });
    if (doingList.length) {
      console.log(`存在已启动任务：【${doingList[0].topic}】，时间：${getTime(1)}`);
      return;
    }

    const filterList = itemList.filter((ele) => {
      return ele.status === 1 || ele.status === 7;
    });
    const startId = filterList.length ? filterList[0].id : "";
    if (startId) {
      const data = {
        taskId: startId,
      };
      const startRes = await axios.post(START_URL, data);
      if (startRes.status === 200) {
        console.log(
            `任务：【${filterList[0].topic}】已启动，时间：${getTime(1)}`
        );
      }
    }
  }
}

start()
scheduleCronstyle();
