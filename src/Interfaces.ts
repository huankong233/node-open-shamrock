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

export type SocketHandle = {
  'socket.eventConnecting': void
  'socket.apiConnecting': void
  'socket.eventOpen': void
  'socket.apiOpen': void
  'socket.eventClose': { code: number; reason: Buffer }
  'socket.apiClose': { code: number; reason: Buffer }
  'socket.eventError': Error
  'socket.apiError': Error
  socket: void | { code: number; reason: Buffer } | Error

  'api.preSend': APIRequest<any>
  'api.response': APISuccessResponse<any> | APIErrorResponse<any>
  api: APIRequest<any> | APISuccessResponse<any> | APIErrorResponse<any>

  // 'meta_event.lifecycle': LifeCycle
  // 'meta_event.heartbeat': HeartBeat
  // meta_event: HeartBeat | LifeCycle

  // 'message.private': PrivateMessage
  // 'message.group': GroupMessage
  // message: PrivateMessage | GroupMessage

  // 'request.friend': RequestFriend
  // 'request.group': RequestGroup
  // request: RequestGroup | RequestFriend

  // 'notice.group_admin': GroupAdmin
  // 'notice.group_upload': GroupUpload
  // 'notice.group_decrease': GroupDecrease
  // 'notice.group_increase': GroupIncrease
  // 'notice.group_ban': GroupBan
  // 'notice.friend_add': FriendAdd
  // 'notice.group_recall': GroupRecall
  // 'notice.friend_recall': FriendRecall
  // 'notice.notify.poke.friend': NotifyPokeFriend
  // 'notice.notify.poke.group': NotifyPokeGroup
  // 'notice.notify.lucky_king': NotifyLuckyKing
  // 'notice.notify.honor': NotifyHonor
  // 'notice.notify': NotifyHonor | NotifyLuckyKing | NotifyPokeGroup | NotifyPokeFriend
  // 'notice.group_card': GroupCard
  // 'notice.offline_file': OfflineFile
  // 'notice.client_status': ClientStatus
  // 'notice.essence': Essence
  // notice:
  //   | Essence
  //   | ClientStatus
  //   | OfflineFile
  //   | GroupCard
  //   | NotifyHonor
  //   | NotifyLuckyKing
  //   | NotifyPokeGroup
  //   | NotifyPokeFriend
  //   | FriendRecall
  //   | GroupRecall
  //   | FriendAdd
  //   | GroupBan
  //   | GroupIncrease
  //   | GroupDecrease
  //   | GroupUpload
  //   | GroupAdmin
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
