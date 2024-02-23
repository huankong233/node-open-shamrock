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
  message: object
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
  message: object
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
  message: object
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

export type WSSendParam = {
  get_login_info: {}
  // set_qq_profile: {
  //   nickname: string
  //   company: string
  //   email: string
  //   college: string
  //   personal_note: string
  // }
  // qidian_get_account_info: {}
  // _get_model_show: { model: string }
  // _set_model_show: { model: string; model_show: string }
  // get_online_clients: NoCache
  // get_stranger_info: NoCache & UserId
  // get_friend_list: {}
  // get_unidirectional_friend_list: {}
  // delete_friend: UserId
  // delete_unidirectional_friend: UserId
  // send_private_msg: { group_id?: number; auto_escape?: boolean } & UserId & Message
  // send_group_msg: { auto_escape?: boolean } & Message & GroupId
  // send_msg: PrivateData | GroupData
  // get_msg: MessageId
  // delete_msg: MessageId
  // mark_msg_as_read: MessageId
  // get_forward_msg: { message_id: string; id: string }
  // send_group_forward_msg: { messages: messageNode } & GroupId
  // send_private_forward_msg: { messages: messageNode } & UserId
  // get_group_msg_history: { message_seq?: int64 } & GroupId
  // get_image: FileStr
  // can_send_image: {}
  // ocr_image: { image: string }
  // get_record: { out_format: string } & FileStr
  // can_send_record: {}
  // set_friend_add_request: { flag: string; approve?: boolean; remark?: string }
  // set_group_add_request: {
  //   flag: string
  //   sub_type: string
  //   approve?: boolean
  //   reason?: string
  //   type?: string
  // }
  // get_group_info: NoCache & GroupId
  // get_group_list: NoCache
  // get_group_member_info: NoCache & GroupId & UserId
  // get_group_member_list: NoCache & GroupId
  // get_group_honor_info: { type: string } & GroupId
  // get_group_system_msg: {}
  // get_essence_msg_list: GroupId
  // get_group_at_all_remain: GroupId
  // set_group_name: { group_name?: string } & GroupId
  // set_group_portrait: { cache?: number } & GroupId & FileStr
  // set_group_admin: Enable & GroupId & UserId
  // set_group_card: { card?: string } & GroupId & UserId
  // set_group_special_title: { special_title?: string } & GroupId & UserId & Duration
  // set_group_ban: Duration & GroupId & UserId
  // set_group_whole_ban: Enable & GroupId
  // set_group_anonymous_ban: { anonymous: any; anonymous_flag?: string; flag?: string } & GroupId &
  //   Duration
  // set_essence_msg: MessageId
  // delete_essence_msg: MessageId
  // send_group_sign: {}
  // set_group_anonymous: Enable & GroupId
  // _send_group_notice: { image: string } & Content & GroupId
  // _get_group_notice: { group_id: int64 }
  // set_group_kick: { reject_add_request?: boolean } & GroupId & UserId
  // set_group_leave: { is_dismiss?: boolean } & GroupId
  // upload_group_file: { name: string; folder?: string } & GroupId & FileStr
  // delete_group_file: { file_id: string; busid: int32 } & GroupId
  // create_group_file_folder: { name: string; parent_id: '/' } & GroupId
  // delete_group_folder: { folder_id: string } & GroupId
  // get_group_file_system_info: GroupId
  // get_group_root_files: GroupId
  // get_group_files_by_folder: { folder_id: string } & GroupId
  // get_group_file_url: { file_id: string; busid: int32 } & GroupId
  // upload_private_file: { name: string } & FileStr & UserId
  // get_cookies: Domain
  // get_csrf_token: {}
  // get_credentials: Domain
  // get_version_info: {}
  // get_status: {}
  // set_restart: { delay?: number }
  // clean_cache: {}
  // reload_event_filter: { file: string }
  // download_file: { thread_count: int32; headers: string | string[] } & FileUrl
  // check_url_safely: FileUrl
  // '.get_word_slices': Content
  // '.handle_quick_operation': QuickOperationType<keyof QuickOperation>
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

export type WSSendReturn = {
  get_login_info: LoginInfo
  // set_qq_profile: void
  // qidian_get_account_info: QiDianAccountInfo
  // _get_model_show: Variants[]
  // _set_model_show: void
  // get_online_clients: Device[]
  // get_stranger_info: StrangerInfo
  // get_friend_list: FriendInfo[]
  // get_unidirectional_friend_list: SourceInfo[]
  // delete_friend: void
  // delete_unidirectional_friend: void
  // send_private_msg: MessageId
  // send_group_msg: MessageId
  // send_msg: MessageId
  // get_msg: MessageInfo
  // delete_msg: void
  // mark_msg_as_read: void
  // get_forward_msg: ForwardData
  // send_group_forward_msg: ForwardId
  // send_private_forward_msg: ForwardId
  // get_group_msg_history: message[]
  // get_image: QQImageData
  // can_send_image: CanSend
  // ocr_image: OCRImage
  // get_record: RecordFormatData
  // can_send_record: CanSend
  // set_friend_add_request: void
  // set_group_add_request: GroupAddRequest
  // get_group_info: GroupInfo
  // get_group_list: GroupInfo[]
  // get_group_member_info: GroupMemberInfo
  // get_group_member_list: GroupMemberInfo[]
  // get_group_honor_info: GroupHonorInfo
  // get_group_system_msg: GroupSystemMSG | null
  // get_essence_msg_list: EssenceMessage[]
  // get_group_at_all_remain: GroupAtAllRemain
  // set_group_name: void
  // set_group_portrait: void
  // set_group_admin: void
  // set_group_card: void
  // set_group_special_title: void
  // set_group_ban: void
  // set_group_whole_ban: void
  // set_group_anonymous_ban: void
  // set_essence_msg: void
  // delete_essence_msg: void
  // send_group_sign: void
  // set_group_anonymous: void
  // _send_group_notice: void
  // _get_group_notice: GroupNotice
  // set_group_kick: void
  // set_group_leave: void
  // upload_group_file: void
  // delete_group_file: void
  // create_group_file_folder: void
  // delete_group_folder: void
  // get_group_file_system_info: GroupFileSystemInfo
  // get_group_root_files: GroupRootFileSystemInfo
  // get_group_files_by_folder: GroupRootFileSystemInfo
  // get_group_file_url: FileUrl
  // upload_private_file: void
  // get_cookies: CookiesData
  // get_csrf_token: CSRFTokenData
  // get_credentials: CookiesData & CSRFTokenData
  // get_version_info: VersionInfo
  // get_status: Status
  // set_restart: void
  // clean_cache: void
  // reload_event_filter: void
  // download_file: DownloadFile
  // check_url_safely: URLSafely
  // '.get_word_slices': WordSlicesData
  // '.handle_quick_operation': void
}
