import cron from 'node-cron'
import axios from 'axios'
import dotenv from 'dotenv'
import { getCozeAiReply } from './coze/index.js'

const env = dotenv.config().parsed
const roomId = env.ROOM_CRON_LIST

const CONCACT_TYPE = {
  CONTCAT: 'contact',
  ROOM: 'room',
}

const SCHEDULE_LIST = [
  {
    id: '蛋蛋毛',
    city: '上海',
    type: CONCACT_TYPE.CONTCAT,
    time: '41 8 * * *',
  },
  {
    id: '方潇',
    city: '南京',
    type: CONCACT_TYPE.ROOM,
    time: '20 7 * * *',
  },
]

const scheduleReportToRoomImpl = async (bot, scheduleItem) => {
  try {
    const { id, type, time, city } = scheduleItem
    let sayer

    if (type === CONCACT_TYPE.CONTCAT) {
      // 获取联系人
      sayer = await bot.Contact.find({ name: id })
      if (!sayer) {
        throw new Error(`找不到联系人 ID: ${id}`)
      }
    } else if (type === CONCACT_TYPE.ROOM) {
      // 获取群聊
      sayer = await bot.Room.find({ id })
      if (!sayer) {
        throw new Error(`找不到群聊 ID: ${id}`)
      }
    }

    // 创建新的定时任务
    const job = cron.schedule(time, async () => {
      try {
        const weatherReport = await getCozeAiReply(city)
        console.log(weatherReport)
        await sayer.say(weatherReport)
      } catch (error) {
        console.error('发送天气预报失败:', error)
      }
    })
    let sayerName = await (typeof sayer.name === 'function' ? sayer.name() : sayer.topic())
    console.log(`已为 ${sayerName} 设置天气预报定时任务`)
  } catch (error) {
    console.error('设置聊定时任务失败:', error)
    throw error
  }
}

export const scheduleReportToRoom = async (bot, scheduleItem) => {
  const list = await bot.Contact.findAll()
  for (const item of list) {
    const avatar = await item.avatar()
    const alias = await item.alias()
    console.log('x', avatar, alias)
  }
  for (const item of SCHEDULE_LIST) {
    await scheduleReportToRoomImpl(bot, item)
  }
}
