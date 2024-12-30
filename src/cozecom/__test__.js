import dotenv from 'dotenv'
import { CozeAPI, ChatEventType, COZE_COM_BASE_URL, RoleType } from '@coze/api'
import { FileBox } from 'file-box'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import { getCozecomAiReply } from './index.js'
import { getStreamFromFileBox } from '../wechaty/utils.js'

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()
const env = dotenv.config().parsed

const token = env.COZECOM_API_KEY
const baseURL = COZE_COM_BASE_URL

const client = new CozeAPI({
  baseURL,
  token,
})

async function upload() {
  const filePath = path.join(__dirname, '5747829915094262157.jpg')
  const fileBox = await FileBox.fromFile(filePath)
  // const file = await fileBox.toStream()
  // const res = await client.files.upload({ file });
  const file = await getStreamFromFileBox(fileBox, client)
  const message = await getCozecomAiReply(file, { to: '蛋蛋', isImage: true })
  console.log('🌸🌸🌸 / message: ', message)
}

async function testMessage() {
  const message = await getCozecomAiReply('你好', { to: '蛋蛋' })
  console.log('🌸🌸🌸 / message: ', message)
}

// testMessage()
upload()
