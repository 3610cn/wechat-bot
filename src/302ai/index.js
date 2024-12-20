import axios from 'axios'
import dotenv from 'dotenv'
import { getCozeAiReply } from '../coze/index.js'
import q from '../q.js'

dotenv.config()
const env = dotenv.config().parsed
const key = env._302AI_API_KEY
const model = env._302AI_MODEL ? env._302AI_MODEL : 'gpt-4o-mini'

function setConfig(prompt, options) {
  const { to } = options
  q.add({ name: to, role: 'user', content: prompt })

  return {
    method: 'post',
    url: 'https://api.302.ai/v1/chat/completions',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${key}`,
      'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      model: model,
      messages: q.getList(to),
    }),
  }
}

export async function get302AiReply(prompt, options) {
  // 表示聊天对象，用于分别存储上下文
  const { to } = options
  if (prompt === '1') {
    q.clear(to)
    return 'copy that'
  } else if (prompt.indexOf('天气') > -1) {
    return getCozeAiReply(prompt, options)
  }
  try {
    const config = setConfig(prompt, options)
    const response = await axios(config)
    const { choices } = response.data
    const content = choices[0].message.content
    q.add({ name: to, content })
    return content
  } catch (error) {
    console.error(error.code)
    console.error(error.message)
  }
}
