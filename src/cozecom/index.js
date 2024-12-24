import axios from 'axios'
import dotenv from 'dotenv'
import { CozeAPI, ChatEventType, COZE_COM_BASE_URL, RoleType } from '@coze/api'

dotenv.config()
const env = dotenv.config().parsed

const token = env.COZECOM_API_KEY
const botId = env.COZECOM_BOT_ID
const baseURL = COZE_COM_BASE_URL

let client
let conversationIdMap = {}

async function createConversation(bot_id) {
  const conversation = await client.conversations.create({
    bot_id: botId,
    messages: [
      // {
      //   role: RoleType.Assistant,
      //   content_type: 'text',
      //   content: 'Hi, you are an assistant',
      // },
    ],
    meta_data: {},
  })
  return conversation
}

export async function getCozecomAiReply(prompt, options) {
  if (!client) {
    client = new CozeAPI({
      baseURL,
      token,
    })
  }

  const { to = 'default' } = options
  let conversationId = conversationIdMap[to]
  if (!conversationId) {
    const conversation = await createConversation(botId)
    conversationId = conversation.id
    conversationIdMap[to] = conversationId
  }

  console.log('use cozecom')
  try {
    const stream = await client.chat.stream({
      conversation_id: conversationId,
      bot_id: botId,
      additional_messages: [
        {
          role: RoleType.User,
          content: prompt,
          content_type: 'text',
        },
      ],
      auto_save_history: true,
    })

    let message = ''

    for await (const part of stream) {
      if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
        message += part.data.content
      }
    }
    return message
  } catch (error) {
    console.error(error.code)
    console.error(error.message)
  }
}
