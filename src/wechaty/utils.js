import { FileBox } from 'file-box'
import axios from 'axios'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export async function downloadImageAsFileBox(imageUrl) {
  try {
    // 创建临时文件夹（如果不存在）
    const tempDir = path.join(__dirname, '../../temp')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    // 下载图片
    const response = await axios({
      url: imageUrl,
      responseType: 'stream',
    })

    // 生成临时文件名
    let ext = path.extname(imageUrl) || '.jpg'
    if (ext.indexOf('?') > -1) {
      ext = ext.slice(0, ext.indexOf('?'))
    }
    const fileName = `image_${Date.now()}${ext}`
    const localPath = path.join(tempDir, fileName)

    // 保存到本地
    const writer = fs.createWriteStream(localPath)
    response.data.pipe(writer)

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
    return FileBox.fromFile(localPath)
    // 发送后删除临时文件
    // fs.unlinkSync(localPath)
  } catch (error) {
    console.error('下载或发送图片失败:', error)
  }
}

export async function getStreamFromFileBox(filebox) {
  try {
    // 创建临时文件夹（如果不存在）
    const tempDir = path.join(__dirname, '../../temp')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    const fileName = filebox.name
    let ext = path.extname(fileName) || '.jpg'
    if (ext.indexOf('?') > -1) {
      ext = ext.slice(0, ext.indexOf('?'))
    }
    const filePath = path.join(tempDir, Math.random() + ext)
    await filebox.toFile(filePath)

    const newFileBox = FileBox.fromFile(filePath)
    const fileStream = await newFileBox.toStream()
    return fileStream
  } catch (error) {
    console.error('下载或发送图片失败:', error)
  }
}

// 下载图片并转换为 Base64
export async function downloadImageAsBase64(imageUrl) {
  try {
    // 下载图片
    const response = await axios({
      url: imageUrl,
      responseType: 'arraybuffer', // 以二进制格式接收数据
    })

    // 将下载的图片数据转换为 Base64
    const base64Image = Buffer.from(response.data, 'binary').toString('base64')
    const imageType = path.extname(imageUrl).slice(1) // 获取文件扩展名

    // 创建 Base64 数据 URL
    const base64DataUrl = `data:image/${imageType};base64,${base64Image}`
    return base64DataUrl
  } catch (error) {
    console.error('下载或转换图片失败:', error)
    throw error // 抛出错误以便调用者处理
  }
}

// const imageUrl = 'https://s.coze.cn/t/Cvt62bqUeFzKVhws'
// // await downloadImage(imageUrl)
// const base64 = await downloadImageAsBase64(imageUrl)
// console.log(base64)
