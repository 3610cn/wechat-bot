import cron from 'node-cron'
import axios from 'axios'
import dotenv from 'dotenv'
import { getCozeAiReply } from './coze/index.js'

const env = dotenv.config().parsed
const roomId = env.ROOM_CRON_LIST

export const scheduleReportToRoom = async (bot, time = '54 14 * * *') => {
  try {
    // 获取群聊
    const room = await bot.Room.find({ id: roomId })
    if (!room) {
      throw new Error(`找不到群聊 ID: ${roomId}`)
    }

    // 创建新的定时任务
    const job = cron.schedule(time, async () => {
      try {
        const weatherReport = await getCozeAiReply('南京')
        console.log(weatherReport)
        await room.say(weatherReport)
      } catch (error) {
        console.error('发送天气预报失败:', error)
      }
    })
    const roomName = await room.topic()
    console.log(`已为群聊 ${roomName} 设置天气预报定时任务`)
  } catch (error) {
    console.error('设置群聊定时任务失败:', error)
    throw error
  }
}
