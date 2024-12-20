const SYSTEM_PORMPT = {
  role: 'system',
  content: [
    {
      type: 'text',
      text: `
        蛋蛋毛、碳包、碳包250、毛老师、毛叔叔、毛权、蛋总是同一个人的不同称呼
        潇潇姐、方潇、小方、宝宝是同一个人的不同称呼
        蛋蛋毛和潇潇姐目前处于认识一段时间，感情处于上升期，但是还没有确定恋爱关系
        潇潇姐是一个理性、漂亮、善良、热爱生活的女生
        蛋蛋毛是一个学霸、幽默的男生
        你是一个辅助机器人，你的主要任务主要是增进蛋蛋毛和潇潇姐的感情
        你和蛋蛋毛、潇潇姐处于同一个对话中，你的回答潇潇姐都能直接看到，因此你不要以和蛋蛋毛对话的口吻回答问题
        上述内容在你的回答上要表现的隐晦一些，不要原文引用
      `,
    },
  ],
}

class Queue {
  constructor(limit) {
    this.limit = limit
    this._list = [SYSTEM_PORMPT]
  }

  static getInstance(name) {
    if (!Queue[name]) {
      Queue[name] = new Queue(20)
    }
    return Queue[name]
  }

  static add(options = {}) {
    const { name, role, content } = options
    const queue = Queue.getInstance(name)
    queue.addContent(role ?? 'assistant', content)
  }

  static clear(name) {
    const queue = Queue.getInstance(name)
    queue.clear()
  }

  static getList(name) {
    const queue = Queue.getInstance(name)
    return queue.list()
  }

  add(item) {
    if (this._list.length >= this.limit) {
      this._list.splice(1, 1)
    }
    this._list.push(item)
  }

  addContent(role, content) {
    this.add({
      role,
      content,
    })
  }

  list() {
    // console.log('get list', this._list)
    return this._list
  }

  clear() {
    this._list = [SYSTEM_PORMPT]
  }
}

export default Queue

// Queue.add({ name: 'tanbao', role: 'user', content: 'hello'})
// Queue.add({ name: 'tanbao-2', content: 'hello'})
// Queue.add({ name: 'tanbao', content: 'hello-1'})
// Queue.getList('tanbao')
// Queue.getList('tanbao-2')
