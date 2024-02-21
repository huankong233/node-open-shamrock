import type { SocketHandle } from './Interfaces.ts'
import type { SRWebsocket } from './SRWebsocket.ts'

import { EventEmitter } from 'events'

export class SREventBus extends EventEmitter implements EventEmitter {
  SRWebsocket: SRWebsocket
  _events: { [key in keyof SocketHandle]?: Function[] | Function }

  constructor(SRWebsocket: SRWebsocket) {
    super()

    this.SRWebsocket = SRWebsocket
    this._events = {}
  }

  emit<T extends keyof SocketHandle>(type: T, context: SocketHandle[T]): boolean {
    const handlers = this._events[type]

    // 未注册
    if (!handlers) return false

    if (typeof handlers === 'function') {
      // 单个
      handlers(context)
    } else {
      // 多个
      for (let i = 0; i < handlers.length; i++) {
        handlers[i](context)
      }
    }

    // 触发总类
    const indexOf = type.lastIndexOf('.')
    if (indexOf > 0) {
      return this.emit(type.slice(0, indexOf) as T, context)
    }

    return true
  }

  post_types = ['message', 'notice', 'request', 'meta_event', 'message_sent']

  parseMessage(json: any) {
    const post_type = json['post_type']

    if (post_type in this.post_types) {
      // return this[post_type](json)
    } else {
      console.warn(`[node-open-shamrock] unknown post_type: ${post_type}`)
      return false
    }

    return
  }
}
