import { ClientOptions } from 'ws'
import { Receive, Send } from './Structs.js'

export interface SRWebsocketOptionsBaseUrl {
  baseUrl: string
}

export interface SRWebsocketOptionsHost {
  protocol: 'ws' | 'wss'
  host: string
  port: number
}

export type SRWebsocketOptions = (SRWebsocketOptionsBaseUrl | SRWebsocketOptionsHost) & {
  accessToken?: string
  ClientOptions?: ClientOptions
  receive?: 'CQCode' | 'JSON'
}

export interface WSCloseRes {
  code: number
  reason: string
}

export interface WSErrorRes {
  errno: number
  code: string
  syscall: string
  address: string
  port: number
}

export interface APIRequest<T> {
  action: string
  params: T
  echo: string
}

export interface APISuccessResponse<D> {
  status: 'ok'
  retcode: 0
  data: D
  message: undefined | '成功'
  echo: string
}

export interface APIErrorResponse<D> {
  status: 'failed'
  retcode: number // 返回码，0 为成功，非 0 为失败
  data: D
  message: string // 错误信息
  echo: string
}

export interface ResponseHandler {
  onSuccess: (response: any) => void
  onFailure: (reason: any) => void
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
  message: ReceiveMessageArray | string
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
  message: ReceiveMessageArray | string
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
  message: ReceiveMessageArray | string
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
  'socket.eventError': WSErrorRes
  'socket.apiError': WSErrorRes
  socket: void | WSCloseRes | WSErrorRes

  'api.preSend': APIRequest<any>
  'api.response': APISuccessResponse<any> | APIErrorResponse<any>
  api: APIRequest<any> | APISuccessResponse<any> | APIErrorResponse<any>

  'meta_event.lifecycle': LifeCycle
  'meta_event.heartbeat': HeartBeat
  meta_event: HeartBeat | LifeCycle

  'message.private': PrivateMessage
  'message.group': GroupMessage
  'message.guild': GuildMessage
  message: PrivateMessage | GroupMessage
  // | GuildMessage

  message_sent: PrivateMessage | GroupMessage
  // | GuildMessage

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
  'notice.notify':
    | NotifyPokeFriend
    | NotifyPokeGroup
    // | NotifyLuckyKing
    // | NotifyHonor
    | NotifyTitle

  notice:
    | FriendRecall
    | GroupRecall
    | GroupIncrease
    | GroupDecrease
    | GroupAdmin
    | GroupUpload
    | PrivateUpload
    | GroupBan
    // | GroupCard
    // | FriendAdd
    // | OfflineFile
    | Essence
    // | ClientStatus
    | NotifyPokeFriend
    | NotifyPokeGroup
    // | NotifyLuckyKing
    // | NotifyHonor
    | NotifyTitle
}

export interface Refresh {
  refresh?: boolean
  no_cache?: boolean
}

export type ReceiveMessageObject = Receive[keyof Receive]
export type ReceiveMessageArray = ReceiveMessageObject[]

export type SendMessageObject = Send[keyof Send]
export type SendMessageArray = SendMessageObject[]

export type WSSendParam = {
  set_group_ban: { group_id: number; user_id: number; duration?: number }
  clean_cache: {}
  clear_messages:
    | { message_type: 'group'; group_id: number }
    | { message_type: 'private'; user_id: number }
  create_group_file_folder: { group_id: number; name: string }
  create_guild_role: { guild_id: string; name: string; color: number; initial_users: string[] }
  delete_essence_message: { message_id: number }
  delete_group_file: { group_id: number; file_id: string; busid: number }
  delete_group_folder: { group_id: number; folder_id: string }
  delete_guild_role: { guild_id: string; role_id: number }
  delete_message: { message_id: number }
  download_file: {
    url?: string
    name?: string
    base64?: string
    thread_cnt?: number
    headers?: string[] | string
  }
  'fav.add_image_message': {
    user_id: number
    nick: string
    group_name?: string
    group_id?: number
    file: string
  }
  'fav.add_text_message': {
    user_id: number
    nick: string
    group_name?: string
    group_id?: number
    time?: number
    content: string
  }
  'fav.get_item_content': {
    id: string
  }
  'fav.get_item_list': {
    category: number
    start_pos: number
    page_size: number
  }
  get_cookies: { domain?: string }
  get_credentials: { domain?: string }
  get_csrf_token: { domain?: string }
  get_device_battery: {}
  get_essence_message_list: { group_id: number; page?: number; page_size?: number }
  get_forward_message: { id: string }
  get_friend_list: Refresh
  get_friend_system_message: {}
  get_guild_channel_list: { guild_id: string } & Refresh
  get_group_file_system_info: { group_id: number }
  get_group_file_url: { group_id: number; file_id: string; busid: number }
  get_group_message_history: { group_id: number; count?: number; message_seq?: number }
  get_group_notice: { group_id: number }
  get_group_at_all_remain: { group_id: number }
  get_group_root_files: { group_id: number }
  get_group_files_by_folder: { group_id: number; folder_id: string }
  get_group_system_message: {}
  get_guild_feeds: { guild_id: string; channel_id?: string; from?: number }
  get_guild_list: { old_sdk?: boolean } & Refresh
  get_guild_member_list: { guild_id: string; all?: boolean; next_token?: string }
  get_guild_member_profile: { guild_id: string; user_id: number }
  get_guild_meta_by_guest: { guild_id: string }
  get_guild_roles: { guild_id: string }
  get_guild_service_profile: {}
  get_history_message:
    | {
        message_type: 'group'
        group_id: number
        count?: number
        message_id?: number
        message_seq?: number
      }
    | {
        message_type: 'private'
        user_id: number
        count?: number
        message_id?: number
        message_seq?: number
      }
  get_http_cookies: { appid: string; daid: string; jumpurl: string }
  get_image: { file: string }
  get_latest_events: {}
  get_login_info: {}
  get_model_show: { user_id?: number }
  _get_model_show: { model: string }
  get_message: { message_id: number }
  get_not_joined_group_info: { group_id: number }
  _get_online_clients: {}
  get_user_info: { user_id: number } & Refresh
  get_prohibited_member_list: { group_id: number }
  get_record: { file: string; out_format: string }
  get_self_info: {}
  get_status: {}
  get_stranger_info: { user_id: number }
  get_supported_actions: {}
  get_group_honor_info: { group_id: number } & Refresh
  get_group_info: { group_id: number } & Refresh
  get_group_list: Refresh
  get_group_member_info: { user_id: number; group_id: number } & Refresh
  get_group_member_list: { group_id: number } & Refresh
  get_uid: { uin_list: number[] }
  get_uin_by_uid: { uid_list: string[] }
  get_version: {}
  get_weather: { code: number } | { city: string }
  get_weather_city_code: { city: string }
  poke: { group_id: number; user_id: number }
  is_blacklist_uin: { user_id: number }
  set_group_kick: {
    group_id: number
    user_id: number
    kick_message?: string
    reject_add_request?: boolean
  }
  set_group_leave: { group_id: number }
  set_group_card: { group_id: number; user_id: number; card?: string }
  set_group_name: { group_id: number; group_name: string }
  set_group_remark: { group_id: number; remark?: string }
  '.handle_quick_operation_async': {
    self_id: number
    context: SocketHandle['message']
    operation?: (
      | {
          reply?: SendMessageObject | SendMessageArray
        }
      | {
          reply?: string
          auto_escape?: boolean
        }
    ) & {
      at_sender?: boolean
      auto_reply?: boolean
      delete?: boolean
      delay?: number
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
  scan_qrcode: { pic: string }
  send_forward_message:
    | {
        message_type: 'group'
        group_id: number
        retry_cnt?: number
        messages: {
          type: 'node'
          data:
            | { id: number }
            | {
                content: string | SendMessageObject | SendMessageArray
                uin?: number
                uid?: string
                name?: string
                seq?: number
                time?: number
              }
        }[]
      }
    | {
        message_type: 'private'
        user_id: number
        retry_cnt?: number
        messages: {
          type: 'node'
          data:
            | { id: number }[]
            | {
                content: string | SendMessageObject | SendMessageArray
                uin?: number
                uid?: string
                name?: string
                seq?: number
                time?: number
              }
        }[]
      }
  send_group_forward_message: {
    group_id: number
    retry_cnt?: number
    messages: {
      type: 'node'
      data:
        | { id: number }
        | {
            content: string | SendMessageObject | SendMessageArray
            uin?: number
            uid?: string
            name?: string
            seq?: number
            time?: number
          }
    }[]
  }
  send_group_message: (
    | {
        message: SendMessageObject | SendMessageArray
      }
    | {
        message: string
        auto_escape?: boolean
      }
  ) & {
    group_id: number
    retry_cnt?: number
    recall_duration?: number
  }
  send_group_announcement: { group_id: number; content: string; image?: string }
  send_group_sign: { group_id: number }
  send_guild_message: (
    | {
        message: SendMessageObject | SendMessageArray
      }
    | {
        message: string
        auto_escape?: boolean
      }
  ) & {
    guild_id: string
    channel_id: string
    retry_cnt?: number
    recall_duration?: number
  }
  send_like: {
    times: number
    user_id: number
  }
  send_message: (
    | {
        message: SendMessageObject | SendMessageArray
      }
    | {
        message: string
        auto_escape?: boolean
      }
  ) &
    (
      | {
          message_type: 'group'
          retry_cnt?: number
          recall_duration?: number
          group_id: number
        }
      | {
          message_type: 'private'
          retry_cnt?: number
          recall_duration?: number
          user_id: number
        }
    )
  send_message_by_resid: {
    res_id: string
    peer_id: number
    message_type: 'group' | 'private'
  }
  send_private_forward_message: {
    user_id: number
    group_id?: number
    retry_cnt?: number
    messages: {
      type: 'node'
      data:
        | { id: number }
        | {
            content: string | SendMessageObject | SendMessageArray
            uin?: number
            uid?: string
            name?: string
            seq?: number
            time?: number
          }
    }[]
  }
  send_private_message:
    | {
        user_id: number | 'self'
        group_id?: number
        retry_cnt?: number
        recall_duration?: number
        message: SendMessageObject | SendMessageArray
      }
    | {
        user_id: number | 'self'
        group_id?: number
        retry_cnt?: number
        recall_duration?: number
        auto_escape?: boolean
        message: string
      }
  set_essence_message: { message_id: number }
  set_friend_add_request: { flag: string; approve?: boolean; reason?: string; notSeen?: boolean }
  set_group_add_request: {
    flag: string
    approve?: boolean
    notSeen?: boolean
    reason?: string
    sub_type: 'add' | 'invite'
  }
  set_group_admin: { group_id: number; user_id: number; enable: boolean }
  set_group_comment_face: {
    group_id: number
    message_id: number
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
  upload_multi_message:
    | {
        message_type: 'group'
        group_id: number
        retry_cnt?: number
        messages: {
          data:
            | { id: number }
            | {
                content: string | SendMessageObject | SendMessageArray
                uin?: number
                uid?: string
                name?: string
                seq?: number
                time?: number
              }
        }[]
      }
    | {
        message_type: 'private'
        user_id: number
        retry_cnt?: number
        messages: {
          data:
            | { id: number }[]
            | {
                content: string | SendMessageObject | SendMessageArray
                uin?: number
                uid?: string
                name?: string
                seq?: number
                time?: number
              }
        }[]
      }
  upload_nt_res: {
    file: string
    message_type?: 'group' | 'private' | 'guild'
    file_type?: 'file' | 'image' | 'pic' | 'video' | 'audio' | 'voice' | 'record' | string
  }
  upload_private_file: {
    user_id: number
    file: string
    name: string
  }
}

export type WSSendReturn = {
  set_group_ban: {}
  clean_cache: {}
  clear_messages: {}
  create_group_file_folder: {
    folder_id: string
    parent_folder_id: string
    folder_name: string
    create_time: number
    modify_time: number
    creator_uin: number
    modifier_uin: number
  }
  create_guild_role: undefined
  delete_essence_message: {}
  delete_group_file: {}
  delete_group_folder: {}
  delete_guild_role: undefined
  delete_message: {}
  download_file: { file: string; md5: string }
  'fav.add_image_message': { picUrl: string; picId: string; id: string }
  'fav.add_text_message': { id: string }
  'fav.get_item_content': { content: string }
  'fav.get_item_list': {
    items: {
      id: string
      authorType: number
      author: number
      authorName: string
      groupName: string
      groupId: number
      clientVersion: string
      time: number
    }[]
  }
  get_cookies: {
    cookies: string
    bigdata_ticket: {
      key: string
      sig: string
    }
  }
  get_credentials: { token: string; cookies: string }
  get_csrf_token: { token: string }
  get_device_battery: { battery: number; scale: number; status: number }
  get_essence_message_list: {
    sender_id: number
    sender_nick: string
    sender_time: number
    operator_id: number
    operator_nick: string
    operator_time: number
    message_id: number
    message_seq: number
    real_id: number
    message_content: ReceiveMessageArray
  }[]
  get_forward_message: {
    messages: {
      time: number
      message_type: 'group' | 'private'
      message_id: number
      message_id_qq: number
      message_seq: number
      real_id: number
      sender: {
        user_id: number
        nickname: string
        sex: 'male' | 'female' | 'unknown'
        age: number
        uid: string
        tiny_id: string
      }
      message: ReceiveMessageArray
      group_id: number
      peer_id: number
    }[]
  }
  get_friend_list: {
    user_id: number
    user_name: string
    user_displayname: string
    user_remark: string
    age: number
    gender: number
    group_id: number
    platform: string
    term_type: number
  }[]
  get_friend_system_message: {
    request_id: number
    requester_uin: number
    requester_nick: string
    source: string
    sub_id: number
    sub_src_id: number
    message: string
    source_group_name: string
    source_group_id: number
    flag: string
    sex: 'male' | 'female' | 'unknown'
    age: number
    msg_detail: string
    status: string
  }[]
  get_guild_channel_list: undefined
  get_group_file_system_info: {
    file_count: number
    limit_count: number
    used_space: number
    total_space: number
  }
  get_group_file_url: {
    url: string
  }
  get_group_message_history: {
    messages: {
      time: number
      message_type: 'group'
      message_id: number
      message_id_qq: bigint
      message_seq: number
      real_id: number
      sender: {
        user_id: number
        nickname: string
        sex: 'male' | 'female' | 'unknown'
        age: number
        uid: string
        tiny_id: string
      }
      message: ReceiveMessageArray
      group_id: number
      peer_id: number
    }[]
  }
  get_group_notice: {
    sender_id: number
    publish_time: number
    message: {
      text: string
      images: {
        height: string
        width: string
        id: string
      }[]
    }
  }[]
  get_group_at_all_remain: {
    can_at_all: boolean
    remain_at_all_count_for_group: number
    remain_at_all_count_for_uin: number
  }
  get_group_root_files: FileAndFolder
  get_group_files_by_folder: FileAndFolder
  get_group_system_message: {
    invited_requests: {
      request_id: number
      invitor_uin: number
      invitor_nick: string
      group_id: number
      group_name: string
      checked: boolean
      actor: number
      requester_uin: number
      requester_nick: string
      message: string
      flag: string
    }[]
    join_requests: {
      request_id: number
      invitor_uin: number
      invitor_nick: string
      group_id: number
      group_name: string
      checked: boolean
      actor: number
      requester_uin: number
      requester_nick: string
      message: string
      flag: string
    }[]
  }
  get_guild_feeds: undefined
  get_guild_list: undefined
  get_guild_member_list: undefined
  get_guild_member_profile: undefined
  get_guild_meta_by_guest: undefined
  get_guild_roles: undefined
  get_guild_service_profile: undefined
  get_history_message: {
    messages: ((
      | {
          message_type: 'group'
          group_id: number
        }
      | {
          message_type: 'private'
          target_id: number
        }
    ) & {
      time: number
      message_id: number
      message_id_qq: bigint
      message_seq: number
      real_id: number
      sender: {
        user_id: number
        nickname: string
        sex: 'male' | 'female' | 'unknown'
        age: number
        uid: string
        tiny_id: string
      }
      message: ReceiveMessageArray
      peer_id: number
    })[]
  }
  get_http_cookies: {
    token: string
    cookies: string
    bigdata_ticket: {
      key: string
      sig: string
    }
  }
  get_image: { size: number; filename: string; url: string }
  get_latest_events: {}
  get_login_info: { user_id: number; nickname: string }
  get_model_show: undefined
  _get_model_show: { variants: { model_show: string; need_pay: boolean }[] }
  get_message: {
    time: number
    message_type: 'group' | 'private'
    message_id: number
    message_id_qq: bigint
    message_seq: number
    real_id: number
    sender: {
      user_id: number
      nickname: string
      sex: 'male' | 'female' | 'unknown'
      age: number
      uid: string
      tiny_id: string
    }
    message: ReceiveMessageArray
    group_id: number
    peer_id: number
  }
  get_not_joined_group_info: {
    group_id: number
    max_member_cnt: number
    member_count: number
    group_name: string
    group_desc: string
    owner: number
    create_time: number
    group_flag: number
    group_flag_ext: number
  }
  _get_online_clients: {
    clients: {
      app_id: number
      device_name: string
      device_kind: string
    }[]
  }
  get_user_info: undefined
  get_prohibited_member_list: {
    user_id: number
    time: number
  }[]
  get_record: {
    file: string
    url: string
  }
  get_self_info: {
    user_id: number
    user_name: string
    user_displayname: string
  }
  get_status: Status[]
  get_stranger_info: {
    user_id: number
    nickname: string
    age: number
    sex: 'male' | 'female' | 'unknown'
    level: number
    login_days: number
    qid: string
    vote: number
    wzry_honor: string
    ext: {
      add_src_id: number
      add_src_name: string
      add_sub_src_id: number
      allow_cal_interactive: boolean
      allow_click: boolean
      allow_people_see: boolean
      auth_state: number
      big_club_vip_open: number
      hollywood_vip_open: number
      qq_vip_open: number
      super_qq_open: number
      super_vip_open: number
      voted: number
      baby_q_switch: boolean
      bind_phone_info: string
      card_id: number
      card_type: number
      category: number
      clothes_id: number
      cover_url: string
      declaration: null
      default_card_id: number
      diy_complicated_info: string
      diy_default_text: string
      diy_text: string
      diy_text_degree: number
      diy_text_font_id: number
      diy_text_height: number
      diy_text_width: number
      diy_text_loc_x: number
      diy_text_loc_y: number
      dress_up_is_on: boolean
      enc_id: null
      enlarge_qzone_pic: number
      extend_friend_entry_add_friend: number
      extend_friend_entry_contact: number
      extend_friend_flag: number
      extend_friend_question: number
      extend_friend_voice_duration: number
      favorite_source: number
      feed_preview_time: number
      font_id: number
      font_type: number
      qid_bg_url: string
      qid_color: string
      qid_logo_url: string
      qq_card_is_on: boolean
      school_id: null
      school_name: null
      school_verified_flag: boolean
      show_publish_button: boolean
      singer: string
      song_dura: number
      song_id: string
      song_name: string
    }
  }
  get_supported_actions: string[]
  get_group_honor_info: {
    group_id: number
    current_talkative: {
      user_id: number
      nickname: string
      avatar: string
      day_count: number
      id: number
      description: string
    }
    talkative_list: {
      user_id: number
      nickname: string
      avatar: string
      day_count: number
      id: number
      description: string
    }[]
    performer_list: {
      user_id: number
      nickname: string
      avatar: string
      day_count: number
      id: number
      description: string
    }[]
    legend_list: []
    strong_newbie_list: []
    emotion_list: {
      user_id: number
      nickname: string
      avatar: string
      day_count: number
      id: number
      description: string
    }[]
    all: {
      user_id: number
      nickname: string
      avatar: string
      day_count: number
      id: number
      description: string
    }[]
  }
  get_group_info: {
    group_id: number
    group_name: string
    group_remark: string
    group_uin: number
    admins: number[]
    class_text: null
    is_frozen: boolean
    max_member: number
    member_num: number
    member_count: number
    max_member_count: number
  }
  get_group_list: {
    group_id: number
    group_name: string
    group_remark: string
    group_uin: number
    admins: number[]
    class_text: null
    is_frozen: boolean
    max_member: number
    member_num: number
    member_count: number
    max_member_count: number
  }[]
  get_group_member_info: GroupMemberInfo
  get_group_member_list: GroupMemberInfo[]
  get_uid: { [key: string]: string }
  get_uin_by_uid: { [key: string]: string }
  get_version: {
    app_full_name: string
    app_name: 'Shamrock'
    app_version: string
    impl: 'shamrock'
    version: string
    onebot_version: '11'
  }
  get_weather: {
    posterStore: {
      weatherInfo: WeatherResponse
      qrcode: string
      poster: string
      swiperIndex: number
    }
    weeklyStore: {
      festivals: [
        {
          type: number
          name: string
          date: number
          summary: string
          pic: number
        }
      ]
      weekBegin: number
      weekEnd: number
      weather: WeatherResponse
    }
  }
  get_weather_city_code: { adcode: number; province: string; city: string }[]
  poke: {}
  is_blacklist_uin: { is: boolean }
  set_group_kick: {}
  set_group_leave: {}
  set_group_card: {}
  set_group_name: {}
  set_group_remark: {}
  '.handle_quick_operation_async': {}
  rename_group_folder: {}
  request_upload_group_image: {
    ukey: []
    exist: boolean
    file_id: number
    up_ip: number[]
    up_port: number[]
  }
  restart_me: undefined
  scan_qrcode: undefined
  send_forward_message: {
    message_id: number
    res_id: string
  }
  send_group_forward_message: {
    message_id: number
    res_id: string
  }
  send_group_message: {
    message_id: number
    time: number
  }
  send_group_announcement: boolean
  send_group_sign: {}
  send_guild_message: undefined
  send_like: {}
  send_message: { message_id: number; time: number }
  send_message_by_resid: { message_id: number; res_id: string }
  send_private_forward_message: { message_id: number; res_id: string }
  send_private_message: { message_id: number; res_id: string }
  set_essence_message: {}
  set_friend_add_request: {}
  set_group_add_request: {}
  set_group_admin: {}
  set_group_comment_face: {}
  set_group_special_title: {}
  set_group_whole_ban: {}
  set_guild_member_role: undefined
  _set_model_show: {}
  set_qq_profile: {}
  sign_ark_message: undefined
  switch_account: {}
  update_guild_role: undefined
  upload_file_to_shamrock: {
    file_size: number
    finish: boolean
    path: string
  }
  upload_group_file: FileAndFolder
  upload_multi_message: {
    resId: string
    filename: string
    summary: string
    desc: string
  }
  upload_nt_res: {
    files: {
      mode_id: number
      name: string
      size: number
      md5: string
      uuid: string
      sub_id: string
      sha: string
    }[]
  }
  upload_private_file: {
    msg_id: number
    bizid: number
    md5: string
    sha: string
    sha3: string
    file_id: string
  }
}

// & {
//   [key: string]: undefined
// }

export interface FileAndFolder {
  files: {
    group_id: number
    file_id: string
    file_name: string
    file_size: number
    busid: number
    upload_time: number
    dead_time: number
    modify_time: number
    download_times: number
    uploader: number
    upload_name: string
    sha: string
    sha3: string
    md5: string
  }[]
  folders: {
    group_id: number
    folder_id: string
    folder_name: string
    total_file_count: number
    create_time: number
    creator: number
    creator_name: string
  }[]
}

export interface WeatherResponse {
  all_astro: []
  lifeindex_forecast_list: []
  weekly_astro: {
    fortunes: { type: string; content: string; title: string }[]
    astro: string
    score: number
    keyword: string
    summary: string
  }[]
  ret: number
  weather_info: null
  air_info: null
  forecast_list: {
    weatherForecast: {
      day_weather: string
      night_weather: string
      day_temper: string
      night_temper: string
      day_wind_direct: string
      night_wind_direct: string
      day_wind_power: string
      night_wind_power: string
      sunrise_time: string
      sunset_time: string
      pubtime: string
      day: number
      day_weather_type: string
      night_weather_type: string
      day_weather_type_id: string
      night_weather_type_id: string
      day_type_id_new: number
      day_concrete_type: number
      night_type_id_new: number
      night_concrete_type: number
      pm: string
      wind_power_desc: string
    }[]
    updatetime: number
    tomorrowPrompt: string
    weeklyPrompt: string
  }
  forecast: null
  hourinfo_list: null
  almanac: string
  warning_list: null
  astro: null
  city: string
  area: string
  adcode: number
  area_id: number
  en_name: string
  update_time: number
  tips_list: null
  lifeindex_list: null
  current_time: number
  user_weekly_astro: {
    fortunes: { type: string; content: string; title: string }[]
    astro: string
    score: number
    keyword: string
    summary: string
  }
  weekly_summary: {
    title: string
    sub_title: string
    pic: number
    lifeindex_list: {
      allergy: null
      clothing: {
        summary: string
        link: string
        highlight: number
        name: string
        tips: string
        display_order: number
        rank: number
      }
      morning_workout: null
      common_cold: {
        summary: string
        link: string
        highlight: number
        name: string
        tips: string
        display_order: number
        rank: number
      }
      sundry_cloth: null
      makeup: null
      uv_light: {
        summary: string
        link: string
        highlight: number
        name: string
        tips: string
        display_order: number
        rank: number
      }
      sport: null
      updatetime: number
      date: string
    }
    umbrella_reminder: {
      timestamps: [number]
      text: string
    }
    tag_value: string
  }
}

export interface GroupMemberInfo {
  user_id: number
  group_id: number
  user_name: string
  sex: 'male' | 'female' | 'unknown'
  age: number
  title: string
  title_expire_time: number
  nickname: string
  user_displayname: string
  card: string
  distance: number
  honor: [number, number]
  join_time: number
  last_active_time: number
  last_sent_time: number
  unique_name: string
  area: string
  level: number
  role: 'owner' | 'admin' | 'member'
  unfriendly: boolean
  card_changeable: boolean
  shut_up_timestamp: number
}

export interface Status {
  // 用户信息
  self: { platform: 'qq'; user_id: number }
  // 表示BOT是否在线
  online: boolean
  // 锁定为 true
  good: true
  // 锁定为 "正常"
  'qq.status': '正常'
}
