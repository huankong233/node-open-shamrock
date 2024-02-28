import type {
  APIRequest,
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
import { JSONParse, logger } from './utils.ts'

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
        this.#eventMessage(data)
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
        this.#apiMessage(data)
      })
      .on('error', data => {
        this.eventBus.emit('socket.apiError', data)
      })
  }

  #eventMessage(data: Data) {
    data = Buffer.isBuffer(data) ? (data = data.toString()) : data
    if (typeof data !== 'string') return

    let json
    try {
      json = JSONParse(data)
    } catch (error) {
      return logger.warn('[node-open-shamrock] failed to parse JSON')
    }

    if (this.debug) {
      logger.debug('[node-open-shamrock] received data from event')
      logger.dir(json)
    }

    this.eventBus.parseMessage(json)
  }

  #apiMessage(data: Data) {
    data = Buffer.isBuffer(data) ? (data = data.toString()) : data
    if (typeof data !== 'string') return

    let json
    try {
      json = JSONParse(data)
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

  /**
   * 发送API请求
   * @param method API 端点
   * @param params 请求参数
   */
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
      const onSuccess = (response: any) => {
        this.echoMap.delete(echo)
        return resolve(response)
      }

      const onFailure = (reason: any) => {
        this.echoMap.delete(echo)
        return reject(reason)
      }

      this.echoMap.set(echo, {
        message,
        onSuccess,
        onFailure
      })

      this.eventBus.emit('api.preSend', message)

      if (this.apiSocket === undefined) {
        reject({
          status: 'failed',
          retcode: -1,
          data: null,
          message: 'api socket is not connected',
          echo: ''
        })
      } else if (this.apiSocket.readyState === WebSocket.CLOSING) {
        reject({
          status: 'failed',
          retcode: -1,
          data: null,
          message: 'api socket is closed',
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

  // --------------------------------APIS--------------------------------

  set_group_ban(params: WSSendParam['set_group_ban']) {
    return this.send('set_group_ban', params)
  }

  clean_cache() {
    return this.send('clean_cache', {})
  }

  clear_messages(params: WSSendParam['clear_messages']) {
    return this.send('clear_messages', params)
  }

  create_group_file_folder(params: WSSendParam['create_group_file_folder']) {
    return this.send('create_group_file_folder', params)
  }

  /**
   * @deprecated 频道支持存在变动,请不要使用
   */
  create_guild_role(params: WSSendParam['create_guild_role']) {
    return this.send('create_guild_role', params)
  }

  delete_essence_message(params: WSSendParam['delete_essence_message']) {
    return this.send('delete_essence_message', params)
  }

  delete_group_file(params: WSSendParam['delete_group_file']) {
    return this.send('delete_group_file', params)
  }

  delete_group_folder(params: WSSendParam['delete_group_folder']) {
    return this.send('delete_group_folder', params)
  }

  /**
   * @deprecated 频道支持存在变动,请不要使用
   */
  delete_guild_role(params: WSSendParam['delete_guild_role']) {
    return this.send('delete_guild_role', params)
  }

  delete_message(params: WSSendParam['delete_message']) {
    return this.send('delete_message', params)
  }

  download_file(params: WSSendParam['download_file']) {
    return this.send('download_file', params)
  }

  fav_add_image_message(params: WSSendParam['fav.add_image_message']) {
    return this.send('fav.add_image_message', params)
  }

  fav_add_text_message(params: WSSendParam['fav.add_text_message']) {
    return this.send('fav.add_text_message', params)
  }

  fav_get_item_content(params: WSSendParam['fav.get_item_content']) {
    return this.send('fav.get_item_content', params)
  }

  fav_get_item_list(params: WSSendParam['fav.get_item_list']) {
    return this.send('fav.get_item_list', params)
  }

  get_cookies(params: WSSendParam['get_cookies']) {
    return this.send('get_cookies', params)
  }

  get_credentials(params: WSSendParam['get_credentials']) {
    return this.send('get_credentials', params)
  }

  get_csrf_token(params: WSSendParam['get_csrf_token']) {
    return this.send('get_csrf_token', params)
  }

  get_device_battery() {
    return this.send('get_device_battery', {})
  }

  get_essence_message_list(params: WSSendParam['get_essence_message_list']) {
    return this.send('get_essence_message_list', params)
  }

  get_forward_message(params: WSSendParam['get_forward_message']) {
    return this.send('get_forward_message', params)
  }

  get_friend_list(params: WSSendParam['get_friend_list']) {
    return this.send('get_friend_list', params)
  }

  get_friend_system_message() {
    return this.send('get_friend_system_message', {})
  }

  /**
   * @deprecated 频道支持存在变动,请不要使用
   */
  get_guild_channel_list(params: WSSendParam['get_guild_channel_list']) {
    return this.send('get_guild_channel_list', params)
  }

  get_group_file_system_info(params: WSSendParam['get_group_file_system_info']) {
    return this.send('get_group_file_system_info', params)
  }

  get_group_file_url(params: WSSendParam['get_group_file_url']) {
    return this.send('get_group_file_url', params)
  }

  get_group_message_history(params: WSSendParam['get_group_message_history']) {
    return this.send('get_group_message_history', params)
  }

  get_group_notice(params: WSSendParam['get_group_notice']) {
    return this.send('get_group_notice', params)
  }

  get_group_at_all_remain(params: WSSendParam['get_group_at_all_remain']) {
    return this.send('get_group_at_all_remain', params)
  }

  get_group_root_files(params: WSSendParam['get_group_root_files']) {
    return this.send('get_group_root_files', params)
  }

  get_group_files_by_folder(params: WSSendParam['get_group_files_by_folder']) {
    return this.send('get_group_files_by_folder', params)
  }

  get_group_system_message() {
    return this.send('get_group_system_message', {})
  }

  /**
   * @deprecated 频道支持存在变动,请不要使用
   */
  get_guild_feeds(params: WSSendParam['get_guild_feeds']) {
    return this.send('get_guild_feeds', params)
  }

  /**
   * @deprecated 频道支持存在变动,请不要使用
   */
  get_guild_list(params: WSSendParam['get_guild_list']) {
    return this.send('get_guild_list', params)
  }

  /**
   * @deprecated 频道支持存在变动,请不要使用
   */
  get_guild_member_list(params: WSSendParam['get_guild_member_list']) {
    return this.send('get_guild_member_list', params)
  }

  /**
   * @deprecated 频道支持存在变动,请不要使用
   */
  get_guild_member_profile(params: WSSendParam['get_guild_member_profile']) {
    return this.send('get_guild_member_profile', params)
  }

  /**
   * @deprecated 频道支持存在变动,请不要使用
   */
  get_guild_meta_by_guest(params: WSSendParam['get_guild_meta_by_guest']) {
    return this.send('get_guild_meta_by_guest', params)
  }

  /**
   * @deprecated 频道支持存在变动,请不要使用
   */
  get_guild_roles(params: WSSendParam['get_guild_roles']) {
    return this.send('get_guild_roles', params)
  }

  /**
   * @deprecated 频道支持存在变动,请不要使用
   */
  get_guild_service_profile() {
    return this.send('get_guild_service_profile', {})
  }

  get_history_message(params: WSSendParam['get_history_message']) {
    return this.send('get_history_message', params)
  }

  get_http_cookies(params: WSSendParam['get_http_cookies']) {
    return this.send('get_http_cookies', params)
  }

  get_image(params: WSSendParam['get_image']) {
    return this.send('get_image', params)
  }

  get_latest_events() {
    return this.send('get_latest_events', {})
  }

  get_login_info() {
    return this.send('get_login_info', {})
  }

  get_model_show(params: WSSendParam['get_model_show']) {
    return this.send('get_model_show', params)
  }

  get_message(params: WSSendParam['get_message']) {
    return this.send('get_message', params)
  }

  get_not_joined_group_info(params: WSSendParam['get_not_joined_group_info']) {
    return this.send('get_not_joined_group_info', params)
  }

  _get_online_clients() {
    return this.send('_get_online_clients', {})
  }

  get_user_info(params: WSSendParam['get_user_info']) {
    return this.send('get_user_info', params)
  }

  get_profile_card(params: WSSendParam['get_profile_card']) {
    return this.send('get_profile_card', params)
  }

  get_prohibited_member_list(params: WSSendParam['get_prohibited_member_list']) {
    return this.send('get_prohibited_member_list', params)
  }

  get_record(params: WSSendParam['get_record']) {
    return this.send('get_record', params)
  }

  get_self_info() {
    return this.send('get_self_info', {})
  }

  get_status() {
    return this.send('get_status', {})
  }

  get_stranger_info(params: WSSendParam['get_stranger_info']) {
    return this.send('get_stranger_info', params)
  }

  get_supported_actions({}) {
    return this.send('get_supported_actions', {})
  }

  get_group_honor_info(params: WSSendParam['get_group_honor_info']) {
    return this.send('get_group_honor_info', params)
  }

  get_group_info(params: WSSendParam['get_group_info']) {
    return this.send('get_group_info', params)
  }

  get_group_list(params: WSSendParam['get_group_list']) {
    return this.send('get_group_list', params)
  }

  get_group_member_info(params: WSSendParam['get_group_member_info']) {
    return this.send('get_group_member_info', params)
  }

  get_group_member_list(params: WSSendParam['get_group_member_list']) {
    return this.send('get_group_member_list', params)
  }

  get_uid(params: WSSendParam['get_uid']) {
    return this.send('get_uid', params)
  }

  get_uin_by_uid(params: WSSendParam['get_uin_by_uid']) {
    return this.send('get_uin_by_uid', params)
  }

  get_version() {
    return this.send('get_version', {})
  }

  get_weather(params: WSSendParam['get_weather']) {
    return this.send('get_weather', params)
  }

  get_weather_city_code(params: WSSendParam['get_weather_city_code']) {
    return this.send('get_weather_city_code', params)
  }

  poke(params: WSSendParam['poke']) {
    return this.send('poke', params)
  }

  is_blacklist_uin(params: WSSendParam['is_blacklist_uin']) {
    return this.send('is_blacklist_uin', params)
  }

  set_group_kick(params: WSSendParam['set_group_kick']) {
    return this.send('set_group_kick', params)
  }

  set_group_leave(params: WSSendParam['set_group_leave']) {
    return this.send('set_group_leave', params)
  }

  set_group_card(params: WSSendParam['set_group_card']) {
    return this.send('set_group_card', params)
  }

  set_group_name(params: WSSendParam['set_group_name']) {
    return this.send('set_group_name', params)
  }

  set_group_remark(params: WSSendParam['set_group_remark']) {
    return this.send('set_group_remark', params)
  }

  handle_quick_operation_async(params: WSSendParam['.handle_quick_operation_async']) {
    return this.send('.handle_quick_operation_async', params)
  }

  rename_group_folder(params: WSSendParam['rename_group_folder']) {
    return this.send('rename_group_folder', params)
  }

  request_upload_group_image(params: WSSendParam['request_upload_group_image']) {
    return this.send('request_upload_group_image', params)
  }

  restart_me() {
    return this.send('restart_me', {})
  }

  sanc_qrcode(params: WSSendParam['sanc_qrcode']) {
    return this.send('sanc_qrcode', params)
  }

  send_forward_message(params: WSSendParam['send_forward_message']) {
    return this.send('send_forward_message', params)
  }

  send_group_forward_message(params: WSSendParam['send_group_forward_message']) {
    return this.send('send_group_forward_message', params)
  }

  send_group_message(params: WSSendParam['send_group_message']) {
    return this.send('send_group_message', params)
  }

  send_group_announcement(params: WSSendParam['send_group_announcement']) {
    return this.send('send_group_announcement', params)
  }

  send_group_sign(params: WSSendParam['send_group_sign']) {
    return this.send('send_group_sign', params)
  }

  /**
   * @deprecated 频道支持存在变动,请不要使用
   */
  send_guild_message(params: WSSendParam['send_guild_message']) {
    return this.send('send_guild_message', params)
  }

  send_message(params: WSSendParam['send_message']) {
    return this.send('send_message', params)
  }

  send_message_by_resid(params: WSSendParam['send_message_by_resid']) {
    return this.send('send_message_by_resid', params)
  }

  send_private_forward_message(params: WSSendParam['send_private_forward_message']) {
    return this.send('send_private_forward_message', params)
  }

  send_private_message(params: WSSendParam['send_private_message']) {
    return this.send('send_private_message', params)
  }

  set_essence_message(params: WSSendParam['set_essence_message']) {
    return this.send('set_essence_message', params)
  }

  set_friend_add_request(params: WSSendParam['set_friend_add_request']) {
    return this.send('set_friend_add_request', params)
  }

  set_group_add_request(params: WSSendParam['set_group_add_request']) {
    return this.send('set_group_add_request', params)
  }

  set_group_admin(params: WSSendParam['set_group_admin']) {
    return this.send('set_group_admin', params)
  }

  set_group_comment_face(params: WSSendParam['set_group_comment_face']) {
    return this.send('set_group_comment_face', params)
  }

  set_group_special_title(params: WSSendParam['set_group_special_title']) {
    return this.send('set_group_special_title', params)
  }

  set_group_whole_ban(params: WSSendParam['set_group_whole_ban']) {
    return this.send('set_group_whole_ban', params)
  }

  /**
   * @deprecated 频道支持存在变动,请不要使用
   */
  set_guild_member_role(params: WSSendParam['set_guild_member_role']) {
    return this.send('set_guild_member_role', params)
  }

  _set_model_show(params: WSSendParam['_set_model_show']) {
    return this.send('_set_model_show', params)
  }

  set_qq_profile(params: WSSendParam['set_qq_profile']) {
    return this.send('set_qq_profile', params)
  }

  sign_ark_message(params: WSSendParam['sign_ark_message']) {
    return this.send('sign_ark_message', params)
  }

  switch_account(params: WSSendParam['switch_account']) {
    return this.send('switch_account', params)
  }

  /**
   * @deprecated 频道支持存在变动,请不要使用
   */
  update_guild_role(params: WSSendParam['update_guild_role']) {
    return this.send('update_guild_role', params)
  }

  upload_file_to_shamrock(params: WSSendParam['upload_file_to_shamrock']) {
    return this.send('upload_file_to_shamrock', params)
  }

  upload_group_file(params: WSSendParam['upload_group_file']) {
    return this.send('upload_group_file', params)
  }

  upload_nt_res(params: WSSendParam['upload_nt_res']) {
    return this.send('upload_nt_res', params)
  }

  upload_private_file(params: WSSendParam['upload_private_file']) {
    return this.send('upload_private_file', params)
  }
}
