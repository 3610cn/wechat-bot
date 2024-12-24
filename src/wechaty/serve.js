import { getGptReply } from '../openai/index.js'
import { getKimiReply } from '../kimi/index.js'
import { getXunfeiReply } from '../xunfei/index.js'
import { getDeepSeekFreeReply } from '../deepseek-free/index.js'
import { get302AiReply } from '../302ai/index.js'
import { getDifyReply } from '../dify/index.js'
import { getOllamaReply } from '../ollama/index.js'
import { getTongyiReply } from '../tongyi/index.js'
import { getCozecomAiReply } from '../cozecom/index.js'
import { getCozeAiReply } from '../coze/index.js'

let switchServerType = ''

/**
 * 获取ai服务
 * @param serviceType 服务类型 'GPT' | 'Kimi'
 * @returns {Promise<void>}
 */
export function getServe(serviceType, options = {}) {
  const { prompt } = options
  if (/^sss/.test(prompt)) {
    switchServerType = prompt.replace(/^sss/, '')
  }
  switch (switchServerType || serviceType) {
    case 'Coze':
      return getCozeAiReply
    case 'CozeCom':
      return getCozeComAiReply
    case 'ChatGPT':
      return getGptReply
    case 'Kimi':
      return getKimiReply
    case 'Xunfei':
      return getXunfeiReply
    case 'deepseek-free':
      return getDeepSeekFreeReply
    case '302AI':
      return get302AiReply
    case 'dify':
      return getDifyReply
    case 'ollama':
      return getOllamaReply
    case 'tongyi':
      return getTongyiReply
    default:
      return getCozeComAiReply
  }
}
