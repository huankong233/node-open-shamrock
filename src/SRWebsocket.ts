import type {
  APIErrorResponse,
  APIRequest,
  APISuccessResponse,
  EventHandle,
  ResponseHandler,
  SRWebsocketOptions,
  SRWebsocketOptionsBaseUrl,
  SocketHandle,
  WSSendParam,
  WSSendReturn
} from './Interfaces.ts'

import WebSocket, { Data } from 'ws'
import { randomUUID } from 'crypto'
import { SREventBus } from './SREventBus.ts'
import { logger } from './utils.ts'

export class SRWebsocket {
  debug: boolean

  eventBus: SREventBus
  SRWebsocketOptions: SRWebsocketOptionsBaseUrl
  eventSocket?: WebSocket
  apiSocket?: WebSocket
  echoMap: Map<string, ResponseHandler>

  constructor(SRWebsocketOptions: SRWebsocketOptions, debug = false) {
    const { accessToken, ClientOptions = {} } = SRWebsocketOptions

    if ('baseUrl' in SRWebsocketOptions) {
      const { baseUrl } = SRWebsocketOptions
      this.SRWebsocketOptions = {
        baseUrl,
        accessToken,
        ClientOptions
      }
    } else if (
      'protocol' in SRWebsocketOptions &&
      'host' in SRWebsocketOptions &&
      'port' in SRWebsocketOptions
    ) {
      const { protocol, host, port } = SRWebsocketOptions
      this.SRWebsocketOptions = {
        baseUrl: protocol + '://' + host + ':' + port,
        accessToken,
        ClientOptions
      }
    } else {
      throw new Error(
        'SRWebsocketOptions must contain either "protocol && host && port" or "baseUrl"'
      )
    }

    // 兼容 OpenShamrock
    if (accessToken) {
      this.SRWebsocketOptions.ClientOptions = {
        ...ClientOptions,
        headers: { ...(ClientOptions?.headers ?? {}), access_token: accessToken }
      }
    }

    this.eventBus = new SREventBus(this)
    this.echoMap = new Map()
    this.debug = debug
  }

  connect() {
    this.connectEvent()
    this.connectApi()
  }

  disconnect() {
    this.disconnectEvent()
    this.disconnectApi()
  }

  reconnect() {
    this.disconnect()
    this.connect()
  }

  connectEvent() {
    const url = `${this.SRWebsocketOptions.baseUrl}/?access_token=${this.SRWebsocketOptions.accessToken}`
    this.eventSocket = new WebSocket(url, this.SRWebsocketOptions.ClientOptions)
    this.eventBus.emit('socket.eventConnecting', undefined)
    this.eventSocket
      .on('open', () => {
        this.eventBus.emit('socket.eventOpen', undefined)
      })
      .on('close', (code, reason) => {
        this.eventBus.emit('socket.eventClose', { code, reason })
        this.eventSocket = undefined
      })
      .on('message', data => {
        this.eventMessage(data)
      })
      .on('error', data => {
        this.eventBus.emit('socket.eventError', data)
      })
  }

  connectApi() {
    const url = `${this.SRWebsocketOptions.baseUrl}/api?access_token=${this.SRWebsocketOptions.accessToken}`
    this.apiSocket = new WebSocket(url, this.SRWebsocketOptions.ClientOptions)
    this.eventBus.emit('socket.apiConnecting', undefined)
    this.apiSocket
      .on('open', () => {
        this.eventBus.emit('socket.apiOpen', undefined)
      })
      .on('close', (code, reason) => {
        this.eventBus.emit('socket.apiClose', { code, reason })
        this.apiSocket = undefined
      })
      .on('message', data => {
        this.apiMessage(data)
      })
      .on('error', data => {
        this.eventBus.emit('socket.apiError', data)
      })
  }

  eventMessage(data: Data) {
    data = Buffer.isBuffer(data) ? (data = data.toString()) : data
    if (typeof data !== 'string') return

    let json
    try {
      json = JSON.parse(data)
    } catch (error) {
      return logger.warn('[node-open-shamrock] failed to parse JSON')
    }

    if (this.debug) {
      logger.debug('[node-open-shamrock] received data from event')
      logger.dir(json)
    }

    this.eventBus.parseMessage(json)
  }

  apiMessage(data: Data) {
    data = Buffer.isBuffer(data) ? (data = data.toString()) : data
    if (typeof data !== 'string') return

    let json
    try {
      json = JSON.parse(data)
    } catch (error) {
      return logger.warn('[node-open-shamrock] failed to parse JSON')
    }

    if (this.debug) {
      logger.debug('[node-open-shamrock] received data from api')
      logger.dir(json)
    }

    if (json.echo === undefined) return

    const handler = this.echoMap.get(json.echo)

    if (handler === undefined) return

    if (json.retcode === 0) {
      handler.onSuccess(json)
    } else {
      handler.onFailure(json)
    }

    this.eventBus.emit('api.response', json)
  }

  disconnectEvent() {
    if (this.eventSocket !== undefined) {
      this.eventSocket.close(1000)
      this.eventSocket = undefined
    }
  }

  disconnectApi() {
    if (this.apiSocket !== undefined) {
      this.apiSocket.close(1000)
      this.apiSocket = undefined
    }
  }

  async send<T extends keyof WSSendParam>(
    method: T,
    params: WSSendParam[T]
  ): Promise<WSSendReturn[T]> {
    const echo = randomUUID({ disableEntropyCache: true })

    const message: APIRequest<WSSendParam[T]> = {
      action: method,
      params: params,
      echo
    }

    if (this.debug) {
      logger.debug('[node-open-shamrock] send request')
      logger.dir(message)
    }

    return new Promise((resolve, reject) => {
      const onSuccess = (res: APISuccessResponse<WSSendReturn[T]>) => {
        this.echoMap.delete(echo)
        return resolve(res.data)
      }

      const onFailure = (err: APIErrorResponse<WSSendReturn[T]>) => {
        this.echoMap.delete(echo)
        return reject(err)
      }

      this.echoMap.set(echo, {
        message,
        onSuccess,
        onFailure
      })

      this.eventBus.emit('api.preSend', message)

      if (this.apiSocket === undefined) {
        reject(<APIErrorResponse<null>>{
          status: 'failed',
          retcode: -1,
          msg: 'api socket is not connected',
          wording: '无连接',
          data: null,
          echo: ''
        })
      } else if (this.apiSocket.readyState === WebSocket.CLOSING) {
        reject(<APIErrorResponse<null>>{
          status: 'failed',
          retcode: -1,
          msg: 'api socket is closed',
          wording: '连接已关闭',
          data: null,
          echo: ''
        })
      } else {
        this.apiSocket.send(JSON.stringify(message))
      }
    })
  }

  /**
   * 注册监听方法
   * @param event
   * @param handle
   * @return 用于当作参数调用 [off]{@link off} 解除监听
   */
  on<T extends keyof SocketHandle>(event: T, handle: EventHandle<T>): this {
    this.eventBus.on(event, handle)
    return this
  }

  /**
   * 只执行一次
   * @param event
   * @param handle
   * @return 用于当作参数调用 [off]{@link off} 解除监听
   */
  once<T extends keyof SocketHandle>(event: T, handle: EventHandle<T>): this {
    this.eventBus.once(event, handle)
    return this
  }

  /**
   * 解除监听方法
   * @param event
   * @param handle
   */
  off<T extends keyof SocketHandle>(event: T, handle: EventHandle<T>): this {
    this.eventBus.off(event, handle)
    return this
  }

  /**
   * 手动模拟触发某个事件
   * @param type
   * @param context
   */
  emit<T extends keyof SocketHandle>(type: T, context: SocketHandle[T]): this {
    this.eventBus.emit(type, context)
    return this
  }
}
