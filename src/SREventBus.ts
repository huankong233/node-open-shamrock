import type { SocketHandle, Status } from './Interfaces.ts'
import type { SRWebsocket } from './SRWebsocket.ts'

import { EventEmitter } from 'events'
import { logger } from './Utils.ts'

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

    // 已注册
    if (handlers) {
      if (typeof handlers === 'function') {
        // 单个
        handlers(context)
      } else {
        // 多个
        for (let i = 0; i < handlers.length; i++) {
          handlers[i](context)
        }
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
    const post_type: 'message' | 'notice' | 'request' | 'meta_event' | 'message_sent' =
      json['post_type']

    if (this.post_types.includes(post_type)) {
      return this[post_type](json)
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
          logger.warn(`[node-open-shamrock] unknown message_type : ${messageType}`)
        }
        return false
    }
  }

  notice(json: any) {
    const notice_type = json['notice_type']
    switch (notice_type) {
      case 'group_upload':
        return this.emit('notice.group_upload', json)
      case 'group_admin':
        return this.emit('notice.group_admin', json)
      case 'group_decrease':
        return this.emit('notice.group_decrease', json)
      case 'group_increase':
        return this.emit('notice.group_increase', json)
      case 'group_ban':
        return this.emit('notice.group_ban', json)
      case 'friend_add':
        return this.emit('notice.friend_add', json)
      case 'group_recall':
        return this.emit('notice.group_recall', json)
      case 'friend_recall':
        return this.emit('notice.friend_recall', json)
      case 'notify':
        const subType = json['sub_type']
        switch (subType) {
          case 'poke':
            return this.emit(
              Reflect.has(json, 'group_id')
                ? 'notice.notify.poke.group'
                : 'notice.notify.poke.friend',
              json
            )
          case 'lucky_king':
            return this.emit('notice.notify.lucky_king', json)
          case 'honor':
            return this.emit('notice.notify.honor', json)
          default:
            if (this.SRWebsocket.debug) {
              logger.warn(`[node-open-shamrock] unknown notify_type : ${subType}`)
            }
            return false
        }
      case 'group_card':
        return this.emit('notice.group_card', json)
      case 'offline_file':
        return this.emit('notice.offline_file', json)
      case 'client_status':
        return this.emit('notice.client_status', json)
      case 'essence':
        return this.emit('notice.essence', json)
      default:
        if (this.SRWebsocket.debug) {
          logger.warn(`[node-open-shamrock] unknown notice_type : ${notice_type}`)
        }
        return false
    }
  }

  request(json: any) {
    const request_type = json['request_type']
    switch (request_type) {
      case 'friend':
        return this.emit('request.friend', json)
      case 'group':
        return this.emit('request.group', json)
      default:
        if (this.SRWebsocket.debug) {
          logger.warn(`[node-open-shamrock] unknown request_type : ${request_type}`)
        }
        return false
    }
  }

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
