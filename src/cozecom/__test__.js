import { getCozecomAiReply } from './index.js'

// 测试 302 ai api
async function testMessage() {
  const message = await getCozecomAiReply('你好', { to: '蛋蛋' })
  console.log('🌸🌸🌸 / message: ', message)
}

testMessage()
