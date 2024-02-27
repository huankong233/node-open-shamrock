import { ClientOptions } from 'ws'

export interface SRWebsocketOptionsBaseUrl {
  baseUrl: string
  accessToken?: string
  ClientOptions?: ClientOptions
}

export interface SRWebsocketOptionsHost {
  protocol: 'ws' | 'wss'
  host: string
  port: number
  accessToken?: string
  ClientOptions?: ClientOptions
}

export type SRWebsocketOptions = SRWebsocketOptionsBaseUrl | SRWebsocketOptionsHost

export interface WSCloseRes {
  code: number
  reason: Buffer
}

export interface APIRequest<T> {
  action: string
  params: T
  echo: string
}

export interface APISuccessResponse<T> {
  status: 'ok'
  retcode: 0
  msg: ''
  wording: ''
  data: T
  echo: string
}

export interface APIErrorResponse<T> {
  status: 'failed'
  retcode: number // 返回码，0 为成功，非 0 为失败
  msg: string // 错误信息
  wording: string // 对错误的描述
  data: T
  echo: string
}

export interface ResponseHandler {
  onSuccess: (json: APISuccessResponse<any>) => void
  onFailure: (reason: APIErrorResponse<any>) => void
  message: APIRequest<any>
}

export type EventHandle<T extends keyof SocketHandle> = (context: SocketHandle[T]) => void

// 心跳包
export interface HeartBeat {
  time: number
  self_id: number
  post_type: 'meta_event'
  meta_event_type: 'heartbeat'
  sub_type: 'connect'
  status: Status
  // 到下次的间隔
  interval: number
}

// 生命周期
export interface LifeCycle {
  time: number
  self_id: number
  post_type: 'meta_event'
  meta_event_type: 'lifecycle'
  sub_type: 'connect'
  status: Status
  // 到下次的间隔
  interval: number
}

// 发送者信息
export interface Sender {
  user_id: number
  nickname: string
  card: string
  role: string
  title: string
  level: string
}

// 私聊消息
export interface PrivateMessage {
  time: number
  post_type: 'message'
  message_type: 'private'
  sub_type: 'friend'
  // 消息 ID
  message_id: number
  // 消息目标
  target_id: number
  // 目标QQ
  peer_id: number
  // 发送者 QQ 号
  user_id: number
  // 消息内容
  message: MessageArray
  // CQ 码格式消息
  raw_message: string
  // 字体
  font: number
  // 发送人信息
  sender: Sender
  /**
   * 临时会话来源
   * -1 非临时会话
   * 0	群聊
   * 1	QQ咨询
   * 2	查找
   * 3	QQ电影
   * 4	热聊
   * 6	验证消息
   * 7	多人聊天
   * 8	约会
   * 9	通讯录
   */
  temp_source: number
}

// 群消息
export interface GroupMessage {
  time: number
  self_id: number
  post_type: 'message'
  message_type: 'group'
  sub_type: 'normal'
  // 消息 ID
  message_id: number
  // 群号
  group_id: number
  // 目标QQ
  peer_id: number
  // 发送者 QQ 号
  user_id: number
  // 消息内容
  message: MessageArray
  // CQ 码格式消息
  raw_message: string
  // 字体
  font: number
  // 发送人信息
  sender: Sender
}

// 频道信息
export interface GuildMessage {
  time: number
  self_id: number
  post_type: 'message'
  message_type: 'guild'
  sub_type: 'channel'
  // 消息 ID
  message_id: number
  // 频道 ID
  guild_id: string
  // 分区 ID
  channel_id: string
  // 锁定为 0
  target_id: 0
  // 目标 QQ
  peer_id: number
  user_id: bigint
  message: MessageArray
  raw_message: string
  font: 0
  sender: {
    user_id: bigint
    nickname: string
    card: string
    // 锁定 member
    // OpenShamrock: 手机QQ获取 role 会导致崩溃
    role: 'member'
    title: string
    level: string
    tiny_id: string
  }
}

// 加群请求／邀请
export interface RequestGroup {
  time: number
  self_id: number
  post_type: 'request'
  request_type: 'group'
  sub_type: 'add' | 'invite'
  group_id: number
  user_id: number
  user_uid: string
  comment: string
  flag: string
}

// 加好友请求
export interface RequestFriend {
  time: number
  self_id: number
  post_type: 'request'
  request_type: 'friend'
  user_id: number
  comment: string
  flag: string
}

export interface FriendRecall {
  time: number
  self_id: number
  post_type: 'notice'
  notice_type: 'friend_recall'
  user_id: number
  operator_id: number
  message_id: number
}

export interface GroupRecall {
  time: number
  self_id: number
  post_type: 'notice'
  notice_type: 'group_recall'
  group_id: number
  operator_id: number
  user_id: number
  message_id: number
}

export interface GroupIncrease {
  time: number
  self_id: number
  post_type: 'notice'
  notice_type: 'group_increase'
  sub_type: 'invite' | 'approve'
  group_id: number
  operator_id: number
  operator_uid: string
  user_id: number
  user_uid: string
  sender_id: number
  target_id: number
  target_uid: string
}

export interface GroupDecrease {
  time: number
  self_id: number
  post_type: 'notice'
  notice_type: 'group_decrease'
  sub_type: 'leave' | 'kick' | 'kick_me'
  group_id: number
  operator_id: number
  user_id: number
  user_uid: string
  sender_id: number
  target_id: number
  target_uid: string
}

export interface GroupAdmin {
  time: number
  self_id: number
  post_type: 'notice'
  notice_type: 'group_admin'
  sub_type: 'set' | 'unset'
  group_id: number
  operator_id: number
  target_id: number
  target_uid: string
}

export interface GroupUpload {
  time: number
  self_id: number
  post_type: 'notice'
  notice_type: 'group_upload'
  group_id: number
  operator_id: number
  user_id: number
  file: {
    id: string
    name: string
    size: number
    busid: number
    url: string
  }
}

export interface PrivateUpload {
  time: number
  self_id: number
  post_type: 'notice'
  notice_type: 'private_upload'
  operator_id: number
  user_id: number
  sender_id: number
  private_file: {
    id: string
    name: string
    size: number
    sub_id: string
    url: string
    expire: number
  }
}

export interface GroupBan {
  time: number
  self_id: number
  post_type: 'notice'
  notice_type: 'group_ban'
  sub_type: 'ban' | 'lift_ban'
  group_id: number
  operator_id: number
  operator_uid: string
  user_id: number
  sender_id: number
  duration: number
  target_id: number
  target_uid: string
}

export interface GroupCard {
  // TODO: 无法触发
}

export interface FriendAdd {
  // TODO: 未实现
}

export interface OfflineFile {
  // TODO: 未实现
}

export interface Essence {
  time: number
  self_id: number
  post_type: 'notice'
  notice_type: 'essence'
  sub_type: 'add' | 'delete'
  group_id: number
  operator_id: number
  sender_id: number
  message_id: number
}

export interface ClientStatus {
  // TODO: 未实现
}

export interface NotifyPokeFriend {
  time: number
  self_id: number
  post_type: 'notice'
  notice_type: 'notify'
  sub_type: 'poke'
  operator_id: number
  user_id: number
  sender_id: number
  target_id: number
  poke_detail: {
    action: string
    action_img_url: string
  }
}

export interface NotifyPokeGroup {
  time: number
  self_id: number
  post_type: 'notice'
  notice_type: 'notify'
  sub_type: 'poke'
  group_id: number
  operator_id: number
  user_id: number
  target_id: number
  poke_detail: {
    action_img_url: string
  }
}

export interface NotifyLuckyKing {
  // TODO: 未实现
}

export interface NotifyHonor {
  // TODO: 未实现
}

export interface NotifyTitle {
  time: number
  self_id: number
  post_type: 'notice'
  notice_type: 'notify'
  sub_type: 'title'
  group_id: number
  user_id: number
  title: string
}

export type SocketHandle = {
  'socket.eventConnecting': void
  'socket.apiConnecting': void
  'socket.eventOpen': void
  'socket.apiOpen': void
  'socket.eventClose': WSCloseRes
  'socket.apiClose': WSCloseRes
  'socket.eventError': Error
  'socket.apiError': Error
  socket: void | WSCloseRes | Error

  'api.preSend': APIRequest<any>
  'api.response': APISuccessResponse<any> | APIErrorResponse<any>
  api: APIRequest<any> | APISuccessResponse<any> | APIErrorResponse<any>

  'meta_event.lifecycle': LifeCycle
  'meta_event.heartbeat': HeartBeat
  meta_event: HeartBeat | LifeCycle

  'message.private': PrivateMessage
  'message.group': GroupMessage
  'message.guild': GuildMessage
  message: PrivateMessage | GroupMessage | GuildMessage

  'request.friend': RequestFriend
  'request.group': RequestGroup
  request: RequestGroup | RequestFriend

  'notice.friend_recall': FriendRecall
  'notice.group_recall': GroupRecall
  'notice.group_increase': GroupIncrease
  'notice.group_decrease': GroupDecrease
  'notice.group_admin': GroupAdmin
  'notice.group_upload': GroupUpload
  'notice.private_upload': PrivateUpload
  'notice.group_ban': GroupBan
  'notice.group_card': GroupCard
  'notice.friend_add': FriendAdd
  'notice.offline_file': OfflineFile
  'notice.essence': Essence
  'notice.client_status': ClientStatus

  'notice.notify.poke.friend': NotifyPokeFriend
  'notice.notify.poke.group': NotifyPokeGroup
  'notice.notify.lucky_king': NotifyLuckyKing
  'notice.notify.honor': NotifyHonor
  'notice.notify.title': NotifyTitle
  'notice.notify': NotifyPokeFriend | NotifyPokeGroup | NotifyLuckyKing | NotifyHonor | NotifyTitle

  notice:
    | FriendRecall
    | GroupRecall
    | GroupIncrease
    | GroupDecrease
    | GroupAdmin
    | GroupUpload
    | PrivateUpload
    | GroupBan
    | GroupCard
    | FriendAdd
    | OfflineFile
    | Essence
    | ClientStatus
    | NotifyPokeFriend
    | NotifyPokeGroup
    | NotifyLuckyKing
    | NotifyHonor
    | NotifyTitle
}

export interface Refresh {
  refresh?: boolean
  no_cache?: boolean
}

export interface MessageObject {
  type: string
  data: { [key: string]: string | number }
}

export type MessageArray = MessageObject[]

export type WSSendParam = {
  set_group_ban: { group_id: number; user_id: number; duration?: number }
  clean_cache: {}
  clear_msgs:
    | { message_type: 'group'; group_id: number }
    | { message_type: 'private'; user_id: number }
  create_group_file_folder: { group_id: number; name: string }
  create_guild_role: { guild_id: string; name: string; color: number; initial_users: number[] }
  delete_essence_msg: { message_id: number }
  delete_essence_message: { message_id: number }
  delete_group_file: { group_id: number; file_id: string; busid: number }
  delete_group_folder: { group_id: number; folder_id: string }
  delete_guild_role: { guild_id: string; role_id: number }
  delete_msg: { message_id: number }
  delete_message: { message_id: number }
  download_file: {
    url?: string
    name?: string
    base64?: string
    thread_cnt?: number
    headers?: string[] | string
  }
  'fav.add_image_msg': {
    user_id: number
    nick: string
    group_name?: string
    group_id?: number
    file: string
  }
  'fav.add_text_msg': {
    user_id: number
    nick: string
    group_name?: string
    group_id?: number
    time?: number
    content: string
  }
  'fav.get_item_content': { id: number }
  'fav.get_item_list': { category: number; start_pos: number; page_size: number }
  get_cookies: { domain?: string }
  get_cookie: { domain?: string }
  get_credentials: { domain?: string }
  get_csrf_token: { domain?: string }
  get_device_battery: {}
  get_essence_msg_list: { group_id: number; page?: number; page_size?: number }
  get_essence_message_list: { group_id: number; page?: number; page_size?: number }
  get_forward_msg: { id: number }
  get_friend_list: Refresh
  get_friend_system_msg: {}
  get_guild_channel_list: { guild_id: string } & Refresh
  get_group_file_system_info: { group_id: number }
  get_group_file_url: { group_id: number; file_id: string; busid: number }
  get_group_msg_history: { group_id: number; count?: number; message_seq?: number }
  _get_group_notice: { group_id: number }
  get_group_notice: { group_id: number }
  get_group_at_all_remain: { group_id: number }
  get_group_root_files: { group_id: number }
  get_group_files_by_folder: { group_id: number; folder_id: string }
  get_group_system_msg: {}
  get_guild_feeds: { guild_id: string; channel_id?: string; from?: number }
  get_guild_list: { old_sdk?: boolean } & Refresh
  get_guild_member_list: { guild_id: string; all?: boolean; next_token?: string }
  get_guild_member_profile: { guild_id: string; user_id: number }
  get_guild_meta_by_guest: { guild_id: string }
  get_guild_roles: { guild_id: string }
  get_guild_service_profile: {}
  get_history_msg: (
    | { message_type: 'group'; group_id: number }
    | { message_type: 'private'; user_id: number }
  ) & { count: number; message_seq: number }
  get_http_cookies: { appid: string; daid: string; jumpurl: string }
  get_image: { file: string }
  get_latest_events: {}
  get_login_info: {}
  get_model_show: { user_id?: number }
  _get_model_show: { model: string }
  get_msg: { message_id: number } | { msg_id: number }
  get_message: { message_id: number } | { msg_id: number }
  get_not_joined_group_info: { group_id: number }
  _get_online_clients: {}
  get_user_info: { user_id: number } & Refresh
  get_profile_card: { user_id: number } & Refresh
  get_prohibited_member_list: { group_id: number }
  get_record: { file: string; out_format: string }
  get_self_info: {}
  get_status: {}
  status: {}
  get_stranger_info: { user_id: number }
  _get_stranger_info: { user_id: number }
  get_supported_actions: {}
  get_group_honor_info: { group_id: number } & Refresh
  get_troop_honor_info: { group_id: number } & Refresh
  get_group_info: { group_id: number } & Refresh
  get_group_list: Refresh
  get_group_member_info: { user_id: number; group_id: number } & Refresh
  get_group_member_list: { group_id: number } & Refresh
  get_uid: { uin_list: number[] }
  get_uin_by_uid: { uid_list: string[] }
  get_version_info: {}
  get_version: {}
  get_weather: { code: number } | { city: string }
  get_weather_city_code: { city: string }
  poke: { group_id: number; user_id: number }
  is_blacklist_uin: { user_id: number }
  set_group_kick: {
    group_id: number
    user_id: number
    kick_msg?: string
    reject_add_request?: boolean
  }
  kick_group_member: {
    group_id: number
    user_id: number
    kick_msg?: string
    reject_add_request?: boolean
  }
  leave_group: { group_id: number }
  set_group_leave: { group_id: number }
  set_group_card: { group_id: number; user_id: number; card?: string }
  set_group_name: { group_id: number; group_name: string }
  set_group_remark: { group_id: number; remark?: string }
  modify_group_remark: { group_id: number; remark?: string }
  '.handle_quick_operation_async': {
    self_id: number
    context: SocketHandle['message']
    operation?: {
      reply: string | MessageObject
      auto_escape?: boolean
      at_sender?: boolean
      auto_reply?: boolean
      delete?: boolean
      delete_delay?: number
      kick?: boolean
      ban?: boolean
      ban_duration?: number
    }
  }
  rename_group_folder: { group_id: number; folder_id: string; name: string }
  request_upload_group_image: {
    md5: string
    file_size: number
    width: number
    height: number
    group_id: number
  }
  restart_me: {}
  sanc_qrcode: { pic: string }
  send_forward_msg:
    | {
        message_type: 'group'
        group_id: number
        messages: {
          data:
            | { id: number }[]
            | {
                content: string
                uin?: number
                uid?: string
                name?: string
                seq?: number
                time?: number
              }[]
        }
      }
    | {
        detail_type: 'group'
        group_id: number
        messages: {
          data:
            | { id: number }[]
            | {
                content: string
                uin?: number
                uid?: string
                name?: string
                seq?: number
                time?: number
              }[]
        }
      }
    | {
        message_type: 'private'
        user_id: number
        messages: {
          data:
            | { id: number }[]
            | {
                content: string
                uin?: number
                uid?: string
                name?: string
                seq?: number
                time?: number
              }[]
        }
      }
    | {
        detail_type: 'private'
        user_id: number
        messages: {
          data:
            | { id: number }[]
            | {
                content: string
                uin?: number
                uid?: string
                name?: string
                seq?: number
                time?: number
              }[]
        }
      }
  send_group_forward_msg: {
    group_id: number
    messages:
      | { id: number }[]
      | {
          content: string
          uin?: number
          uid?: string
          name?: string
          seq?: number
          time?: number
        }[]
  }
  send_group_message:
    | {
        group_id: number
        retry_cnt?: number
        recall_duration?: number
        message: MessageObject | MessageArray
      }
    | {
        group_id: number
        retry_cnt?: number
        recall_duration?: number
        message: string
        autoEscape?: boolean
      }
  send_group_msg:
    | {
        group_id: number
        retry_cnt?: number
        recall_duration?: number
        message: MessageObject | MessageArray
      }
    | {
        group_id: number
        retry_cnt?: number
        recall_duration?: number
        message: string
        autoEscape?: boolean
      }
  send_group_notice: { group_id: number; content: string; image?: string }
  send_group_announcement: { group_id: number; content: string; image?: string }
  send_group_sign: { group_id: number }
  send_guild_message:
    | {
        guild_id: string
        channel_id: string
        retry_cnt?: number
        recall_duration?: number
        message: MessageObject | MessageArray
      }
    | {
        guild_id: string
        channel_id: string
        retry_cnt?: number
        recall_duration?: number
        message: string
        autoEscape?: boolean
      }
  send_guild_msg:
    | {
        guild_id: string
        channel_id: string
        retry_cnt?: number
        recall_duration?: number
        message: string | MessageObject | MessageArray
      }
    | {
        guild_id: string
        channel_id: string
        retry_cnt?: number
        recall_duration?: number
        message: string
        autoEscape?: boolean
      }
  send_guild_channel_msg:
    | {
        guild_id: string
        channel_id: string
        retry_cnt?: number
        recall_duration?: number
        message: string | MessageObject | MessageArray
      }
    | {
        guild_id: string
        channel_id: string
        retry_cnt?: number
        recall_duration?: number
        message: string
        autoEscape?: boolean
      }
  send_msg:
    | {
        message_type: 'group'
        retry_cnt?: number
        recall_duration?: number
        group_id: number
        messages: MessageObject | MessageArray
      }
    | {
        message_type: 'group'
        retry_cnt?: number
        recall_duration?: number
        group_id: number
        auto_escape?: boolean
        messages: string
      }
    | {
        detail_type: 'group'
        retry_cnt?: number
        recall_duration?: number
        group_id: number
        messages: MessageObject | MessageArray
      }
    | {
        detail_type: 'group'
        retry_cnt?: number
        recall_duration?: number
        group_id: number
        auto_escape?: boolean
        messages: string
      }
    | {
        message_type: 'private'
        retry_cnt?: number
        recall_duration?: number
        user_id: number
        messages: MessageObject | MessageArray
      }
    | {
        message_type: 'private'
        retry_cnt?: number
        recall_duration?: number
        user_id: number
        auto_escape?: boolean
        messages: string
      }
    | {
        detail_type: 'private'
        retry_cnt?: number
        recall_duration?: number
        user_id: number
        messages: MessageObject | MessageArray
      }
    | {
        detail_type: 'private'
        retry_cnt?: number
        recall_duration?: number
        user_id: number
        auto_escape?: boolean
        messages: string
      }
  send_message:
    | {
        message_type: 'group'
        retry_cnt?: number
        recall_duration?: number
        group_id: number
        messages: MessageObject | MessageArray
      }
    | {
        message_type: 'group'
        retry_cnt?: number
        recall_duration?: number
        group_id: number
        auto_escape?: boolean
        messages: string
      }
    | {
        detail_type: 'group'
        retry_cnt?: number
        recall_duration?: number
        group_id: number
        messages: MessageObject | MessageArray
      }
    | {
        detail_type: 'group'
        retry_cnt?: number
        recall_duration?: number
        group_id: number
        auto_escape?: boolean
        messages: string
      }
    | {
        message_type: 'private'
        retry_cnt?: number
        recall_duration?: number
        user_id: number
        messages: MessageObject | MessageArray
      }
    | {
        message_type: 'private'
        retry_cnt?: number
        recall_duration?: number
        user_id: number
        auto_escape?: boolean
        messages: string
      }
    | {
        detail_type: 'private'
        retry_cnt?: number
        recall_duration?: number
        user_id: number
        messages: MessageObject | MessageArray
      }
    | {
        detail_type: 'private'
        retry_cnt?: number
        recall_duration?: number
        user_id: number
        auto_escape?: boolean
        messages: string
      }
  send_msg_by_resid: {
    res_id: string
    peer_id: string
    message_type: 'group' | 'private'
  }
  send_private_forward_msg: {
    user_id: number
    messages:
      | { id: number }[]
      | {
          content: string
          uin?: number
          uid?: string
          name?: string
          seq?: number
          time?: number
        }[]
  }
  send_private_msg:
    | {
        user_id: number | 'self'
        group_id?: number
        retry_cnt?: number
        recall_duration?: number
        message: MessageObject | MessageArray
      }
    | {
        user_id: number | 'self'
        group_id?: number
        retry_cnt?: number
        recall_duration?: number
        auto_escape: boolean
        message: string
      }
  send_private_message:
    | {
        user_id: number | 'self'
        group_id?: number
        retry_cnt?: number
        recall_duration?: number
        message: MessageObject | MessageArray
      }
    | {
        user_id: number | 'self'
        group_id?: number
        retry_cnt?: number
        recall_duration?: number
        auto_escape: boolean
        message: string
      }
  send_friend_msg:
    | {
        user_id: number | 'self'
        group_id?: number
        retry_cnt?: number
        recall_duration?: number
        message: MessageObject | MessageArray
      }
    | {
        user_id: number | 'self'
        group_id?: number
        retry_cnt?: number
        recall_duration?: number
        auto_escape: boolean
        message: string
      }
  set_essence_msg: { message_id: number }
  set_essence_message: { message_id: number }
  set_friend_add_request: { flag: string; approve?: boolean; remark?: string; notSeen?: boolean }
  set_group_add_request: { flag: string; approve?: boolean; remark?: string; notSeen?: boolean }
  set_group_admin: { group_id: number; user_id: number; enable: boolean }
  set_group_comment_face:
    | {
        group_id: number
        message_id: number
        face_id: number
        is_set?: boolean
      }
    | {
        group_id: number
        msg_id: number
        face_id: number
        is_set?: boolean
      }
  set_group_special_title: { group_id: number; user_id: number; special_title: string }
  set_group_whole_ban: { group_id: number; enable: boolean }
  set_guild_member_role:
    | {
        guild_id: string
        role_id: string
        set?: boolean
        user_id: string
      }
    | {
        guild_id: string
        role_id: string
        set?: boolean
        users: string[]
      }
  _set_model_show:
    | {
        model: string
        manu: string
        modelshow?: string
        imei?: string
        show?: boolean
      }
    | {
        model: string
        model_show: string
        modelshow?: string
        imei?: string
        show?: boolean
      }
  set_qq_profile: {
    nickname: string
    company: string
    email: string
    college: string
    personal_note: string
    birthday?: number
    age?: number
  }
  sign_ark_message: { json: string }
  switch_account: { user_id: number }
  update_guild_role: { guild_id: string; role_id: string; name: string; color: number }
  upload_file_to_shamrock: {
    md5: string
    offset?: number | string
    chunk: string
    file_size?: string
  }
  upload_group_file: { group_id: number; file: string; name: string }
  upload_nt_resource: {
    file: string
    message_type: 'group' | 'private' | 'guild'
    file_type: 'file' | 'image' | 'pic' | 'video' | 'audio' | 'voice' | 'record' | string
  }
  upload_nt_res: {
    file: string
    message_type: 'group' | 'private' | 'guild'
    file_type: 'file' | 'image' | 'pic' | 'video' | 'audio' | 'voice' | 'record' | string
  }
  upload_private_file: {
    user_id: number
    file: string
    name: string
  }
}

export type WSSendReturn = {
  // get_login_info: LoginInfo
}

export interface LoginInfo {
  // 目标 QQ 号
  user_id: number
  // 昵称
  nickname: string
}

export interface Status {
  // 用户信息
  self: { platform: 'qq'; user_id: number }
  // 表示BOT是否在线
  online: boolean
  // 锁定为 true
  good: boolean
  // 锁定为 "正常"
  'qq.status': '正常'
}
