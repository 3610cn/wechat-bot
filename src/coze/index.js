import axios from 'axios'
import dotenv from 'dotenv'
import { downloadImageAsFileBox } from '../wechaty/utils.js'

dotenv.config()
const env = dotenv.config().parsed
const key = env.COZE_API_KEY

function setConfig(prompt) {
  return {
    method: 'post',
    url: 'https://api.coze.cn/v1/workflow/run',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${key}`,
      'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      workflow_id: env.COZE_WORKFLOW_ID,
      parameters: {
        city: prompt.replace('天气', ''),
      },
      app_id: env.COZE_APP_ID,
    }),
  }
}

export async function getCozeAiReply(prompt, options) {
  console.log('use coze')
  try {
    const config = setConfig(prompt, options)
    const response = await axios(config)
    const data = JSON.parse(response.data.data)
    if (data.img) {
      return downloadImageAsFileBox(data.img)
    }
    return data.poetry
  } catch (error) {
    console.error(error.code)
    console.error(error.message)
  }
}
