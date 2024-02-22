import type { SocketHandle, Status } from './Interfaces.ts'
import type { SRWebsocket } from './SRWebsocket.ts'

import { EventEmitter } from 'events'
import { logger } from './utils.ts'

export class SREventBus extends EventEmitter implements EventEmitter {
  _events: { [key in keyof SocketHandle]?: Function[] | Function }
  SRWebsocket: SRWebsocket
  status: Status

  constructor(SRWebsocket: SRWebsocket) {
    super({ captureRejections: true })

    this.SRWebsocket = SRWebsocket
    this._events = {}
    this.setMaxListeners(0)
    this.status = {
      self: { platform: 'qq', user_id: -1 },
      online: false,
      good: true,
      'qq.status': '正常'
    }
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

    if (this.post_types.includes(post_type)) {
      // return this[post_type](json)
    } else {
      logger.warn(`[node-open-shamrock] unknown post_type: ${post_type}`)
      return false
    }
  }

  message(json: any) {
    const messageType = json['message_type']
    switch (messageType) {
      case 'private':
        return this.emit('message.private', json)
      case 'group':
        return this.emit('message.group', json)
      case 'guild':
        return this.emit('message.guild', json)
      default:
        if (this.SRWebsocket.debug) {
          logger.warn(`[go-cqwebsocket] 未知的消息类型: ${messageType}`)
        }
        return false
    }
  }

  notice(json: any) {}

  request(json: any) {}

  meta_event(json: any) {
    const meta_event_type = json['meta_event_type']

    switch (meta_event_type) {
      case 'lifecycle':
        this.status = json['status']
        return this.emit('meta_event.lifecycle', json)
      case 'heartbeat':
        this.status = json['status']
        return this.emit('meta_event.heartbeat', json)
      default:
        if (this.SRWebsocket.debug) {
          logger.warn(`[node-open-shamrock] unknown meta_event: ${meta_event_type}`)
        }
        return false
    }
  }

  message_sent(json: any) {}
}
