export interface Receive {
  text: {
    type: 'text'
    data: {
      text: string
    }
  }
  face: {
    type: 'face'
    data: {
      id: number
      big: boolean
    }
  }
  image: {
    type: 'image'
    data: (
      | {
          file: string
        }
      | {
          url: string
        }
    ) & {
      type: 'original' | 'flash' | 'show'
      subType: number
    }
  }
  record: {
    type: 'record'
    data: {
      file: string
      url: string
    }
  }
  at: {
    type: 'at'
    data: {
      qq: number | '0' | 'all' | 'admin' | 'online'
    }
  }
  video: {
    type: 'video'
    data: {
      file: string
      url: string
    }
  }
  markdown: {
    type: 'markdown'
    data: {
      content: string
    }
  }
  poke: {
    type: 'poke'
    data: {
      type: number
      id: number
      strength: number
    }
  }
}

export interface Send {
  text: {
    type: 'text'
    data: {
      text: string
    }
  }
  face: {
    type: 'face'
    data: {
      id: number
    }
  }
  pic: {
    type: 'pic'
    data: Send['image']['data']
  }
  image: {
    type: 'image'
    data: (
      | {
          file: string
        }
      | {
          url: string
        }
    ) & {
      type?: 'original' | 'flash' | 'show'
      subType?: number
    }
  }
  voice: {
    type: 'voice'
    data: Send['record']['data']
  }
  record: {
    type: 'record'
    data: (
      | {
          file: string
        }
      | {
          url: string
        }
    ) & {
      magic?: boolean
    }
  }
  at: {
    type: 'at'
    data: {
      qq: number | 'all' | 'admin' | 'online'
      name?: string
    }
  }
  video: {
    type: 'video'
    data:
      | {
          file: string
        }
      | {
          url: string
        }
  }
  markdown: {
    type: 'markdown'
    data: {
      content: string
    }
  }
  poke: {
    type: 'poke'
    data: {
      type: number
      id: number
      strength?: number
    }
  }
  share: {
    type: 'share'
    data: {
      title: string
      url: string
      image?: string
      content?: string
    }
  }
}

export function Text(data: Send['text']['data']): Send['text'] {
  return { type: 'text', data }
}

export function Face(data: Send['face']['data']): Send['face'] {
  return { type: 'face', data }
}

export function Pic(data: Send['pic']['data']): Send['pic'] {
  return { type: 'pic', data }
}

export function Image(data: Send['image']['data']): Send['image'] {
  return { type: 'image', data }
}

export function Voice(data: Send['voice']['data']): Send['voice'] {
  return { type: 'voice', data }
}

export function Record(data: Send['record']['data']): Send['record'] {
  return { type: 'record', data }
}

export function At(data: Send['at']['data']): Send['at'] {
  return { type: 'at', data }
}

export function Video(data: Send['video']['data']): Send['video'] {
  return { type: 'video', data }
}

export function Markdown(data: Send['markdown']['data']): Send['markdown'] {
  return { type: 'markdown', data }
}

export function Poke(data: Send['poke']['data']): Send['poke'] {
  return { type: 'poke', data }
}

export function Share(data: Send['share']['data']): Send['share'] {
  return { type: 'share', data }
}

export interface Contact {
  type: 'contact'
  data: {
    type: 'private' | 'group'
    id: number
  }
}

export function Contact(data: Contact['data']): Contact {
  return { type: 'contact', data }
}

export interface Location {
  type: 'location'
  data: {
    lat: number
    lon: number
  }
}

export function Location(data: Location['data']): Location {
  return { type: 'location', data }
}

export interface Music {
  type: 'music'
  data:
    | {
        type: 'qq' | '163'
        id: number
      }
    | {
        type: 'custom'
        title: string
        singer?: string
        url: string
        image?: string
        audio: string
      }
}

export function Music(data: Music['data']): Music {
  return { type: 'music', data }
}

export interface Reply {
  type: 'reply'
  data:
    | {
        id: number
      }
    | {
        id: number
        seq: number
        text: string
        time: number
        qq: number
      }
}

export function Reply(data: Reply['data']): Reply {
  return { type: 'reply', data }
}

export interface Touch {
  type: 'touch'
  data: {
    id: number
  }
}

export function Touch(data: Touch['data']): Touch {
  return { type: 'touch', data }
}

export interface Weather {
  type: 'weather'
  data:
    | {
        code: number
      }
    | {
        city: string
      }
}

export function Weather(data: Weather['data']): Weather {
  return { type: 'weather', data }
}

export interface Json {
  type: 'json'
  data: string
}

export function Json(data: Json['data']): Json {
  return { type: 'json', data }
}

export interface Forward {
  type: 'forward'
  data: {
    id: number
    filename?: string
    summary?: string
    desc?: string
  }
}

export function Forward(data: Forward['data']): Forward {
  return { type: 'forward', data }
}

export interface NewDice {
  type: 'new_dice'
  data: {}
}

export function NewDice(): NewDice {
  return { type: 'new_dice', data: {} }
}

export interface NewRps {
  type: 'new_rps'
  data: {}
}

export function NewRps(): NewRps {
  return { type: 'new_rps', data: {} }
}

export interface Basketball {
  type: 'basketball'
  data: {}
}

export function Basketball(): Basketball {
  return { type: 'basketball', data: {} }
}

export interface BubbleFace {
  type: 'bubble_face'
  data: {
    id: number
    count: number
    text?: string
  }
}

export function BubbleFace(data: BubbleFace['data']): BubbleFace {
  return { type: 'bubble_face', data }
}

export interface Button {
  type: 'button'
  data: InlineKeyboard['data']
}

export interface InlineKeyboard {
  type: 'inline_keyboard'
  data: {
    data: {
      rows: {
        buttons: {
          id?: string
          render_data: {
            label: string
            visited_label: string
            style: number
          }
          action: {
            type: number
            click_limit: number
            unsupport_tips: string
            data: string
            at_bot_show_channel_list?: boolean
            permission: {
              type: number
              specify_role_ids: string[]
              specify_user_ids: string[]
            }
          }
        }[]
      }[]
      bot_app_id: number
    }
  }
}

export function InlineKeyboard(data: InlineKeyboard['data']): InlineKeyboard {
  return { type: 'inline_keyboard', data }
}
