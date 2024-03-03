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
  // 不支持 share
  // share: {
  //   type: 'share'
  //   data: {}
  // }
  contact: {
    type: 'contact'
    data: {
      type: 'private' | 'group'
      id: string
    }
  }
  location: {
    type: 'location'
    data: {
      lon: string
      title: string
      lat: string
      content: string
    }
  }
  // 不支持 music
  // music: {
  //   type: 'music'
  //   data: {}
  // }
  reply: {
    type: 'reply'
    data: {
      id: number
    }
  }
  // 不支持 touch
  // touch: {
  //   type: 'touch'
  //   data: {}
  // }
  // 不支持 weather
  // weather: {
  //   type: 'weather'
  //   data: {}
  // }
  json: {
    type: 'json'
    data: {
      data: string
    }
  }
  forward: {
    type: 'forward'
    data: {
      id: string
      filename?: string
      summary?: string
      desc?: string
    }
  }
  new_dice: {
    type: 'new_dice'
    data: {}
  }
  new_rps: {
    type: 'new_rps'
    data: {
      id: number
    }
  }
  basketball: {
    type: 'basketball'
    data: {
      id: number
    }
  }
  bubble_face: {
    type: 'bubble_face'
    data: {
      id: number
      count: number
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
  contact: {
    type: 'contact'
    data: {
      type: 'private' | 'group'
      id: number
    }
  }
  location: {
    type: 'location'
    data: {
      lat: number
      lon: number
    }
  }
  music: {
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
  reply: {
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
  touch: {
    type: 'touch'
    data: {
      id: number
    }
  }
  weather: {
    type: 'weather'
    data:
      | {
          code: number
        }
      | {
          city: string
        }
  }
  json: {
    type: 'json'
    data: {
      data: string
    }
  }
  forward: {
    type: 'forward'
    data: {
      id: string
      filename?: string
      summary?: string
      desc?: string
    }
  }
  new_dice: {
    type: 'new_dice'
    data: {}
  }
  new_rps: {
    type: 'new_rps'
    data: {}
  }
  basketball: {
    type: 'basketball'
    data: {}
  }
  bubble_face: {
    type: 'bubble_face'
    data: {
      id: number
      count: number
      text?: string
    }
  }
  // button: {
  //   type: 'button'
  //   data: Send['inline_keyboard']['data']
  // }
  // inline_keyboard: {
  //   type: 'inline_keyboard'
  //   data: {
  //     data: {
  //       rows: {
  //         buttons: {
  //           id?: string
  //           render_data: {
  //             label: string
  //             visited_label: string
  //             style: number
  //           }
  //           action: {
  //             type: number
  //             click_limit: number
  //             unsupport_tips: string
  //             data: string
  //             at_bot_show_channel_list?: boolean
  //             permission: {
  //               type: number
  //               specify_role_ids?: string[]
  //               specify_user_ids?: string[]
  //             }
  //           }
  //         }[]
  //       }[]
  //       bot_app_id: number
  //     }
  //   }
  // }
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

export function Contact(data: Send['contact']['data']): Send['contact'] {
  return { type: 'contact', data }
}

export function Location(data: Send['location']['data']): Send['location'] {
  return { type: 'location', data }
}

export function Music(data: Send['music']['data']): Send['music'] {
  return { type: 'music', data }
}

export function Reply(data: Send['reply']['data']): Send['reply'] {
  return { type: 'reply', data }
}

export function Touch(data: Send['touch']['data']): Send['touch'] {
  return { type: 'touch', data }
}

export function Weather(data: Send['weather']['data']): Send['weather'] {
  return { type: 'weather', data }
}

export function Json(data: Send['json']['data']): Send['json'] {
  return { type: 'json', data }
}

export function Forward(data: Send['forward']['data']): Send['forward'] {
  return { type: 'forward', data }
}

export function NewDice(): Send['new_dice'] {
  return { type: 'new_dice', data: {} }
}

export function NewRps(): Send['new_rps'] {
  return { type: 'new_rps', data: {} }
}

export function Basketball(): Send['basketball'] {
  return { type: 'basketball', data: {} }
}

export function BubbleFace(data: Send['bubble_face']['data']): Send['bubble_face'] {
  return { type: 'bubble_face', data }
}

// export function Button(data: Send['button']['data']): Send['button'] {
//   return { type: 'button', data }
// }

// export function InlineKeyboard(data: Send['inline_keyboard']['data']): Send['inline_keyboard'] {
//   return { type: 'inline_keyboard', data }
// }
