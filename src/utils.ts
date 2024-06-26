import { randomUUID } from 'crypto'
import {
  ReceiveMessageArray,
  ReceiveMessageObject,
  SendMessageArray,
  SendMessageObject
} from './Interfaces.js'

export const getTime = () => new Date().toLocaleString()

export const logger = {
  log: (...args: any[]) => {
    console.log(`[${getTime()}]`, ...args)
  },
  warn: (...args: any[]) => {
    console.warn(`[${getTime()}]`, ...args)
  },
  debug: (...args: any[]) => {
    console.debug(`[${getTime()}]`, ...args)
  },
  dir: (json: any) => {
    console.dir(json, { depth: null })
  }
}

/**
 * ----------------------------------------------------------------
 * https://github.com/Ivan-Korolenko/json-with-bigint/
 * JSONStringify and JSONParse are from there ↑
 * */

export const JSONStringify = (data: any) => {
  const bigInts = /([\[:])?"(\d+)n"([,\}\]])/g
  const preliminaryJSON = JSON.stringify(data, (_, value) =>
    typeof value === 'bigint' ? value.toString() + 'n' : value
  )
  const finalJSON = preliminaryJSON.replace(bigInts, '$1$2$3')

  return finalJSON
}

export const JSONParse = (json: string) => {
  const numbersBiggerThanMaxInt =
    /(?<=:|:\[|:\[.*)(\d{17,}|(?:[9](?:[1-9]07199254740991|0[1-9]7199254740991|00[8-9]199254740991|007[2-9]99254740991|007199[3-9]54740991|0071992[6-9]4740991|00719925[5-9]740991|007199254[8-9]40991|0071992547[5-9]0991|00719925474[1-9]991|00719925474099[2-9])))(?=[,\}\]])/g
  let serializedData = json.replace(numbersBiggerThanMaxInt, '"$1n"')

  if (json.includes('CQ:json')) {
    // 寻找 JSON 中的 JSON
    const foundJSON: { [key: string]: string } = {}
    let start = serializedData.indexOf('"{')
    let end = serializedData.indexOf('}"')
    while (start !== -1 && end !== -1) {
      const uuid = randomUUID({ disableEntropyCache: true })
      const data = serializedData.substring(start + 1, end + 1)
      serializedData = serializedData.replace(data, `${uuid}`)
      foundJSON[uuid] = data.replace(/\\"/g, '"')
      start = serializedData.indexOf('"{')
      end = serializedData.indexOf('}"')
    }

    // 寻找 JSON 中的 JSON
    const foundJSON2: { [key: string]: string } = {}
    let start2 = serializedData.indexOf('={')
    let end2 = serializedData.indexOf('}]')
    while (start2 !== -1 && end2 !== -1) {
      const uuid = randomUUID({ disableEntropyCache: true })
      const data = serializedData.substring(start2 + 1, end2 + 1)
      serializedData = serializedData.replace(data, `${uuid}`)
      foundJSON2[uuid] = data.replace(/\\"/g, '"')
      start2 = serializedData.indexOf('={')
      end2 = serializedData.indexOf('}]')
    }

    return JSON.parse(serializedData, (_, value) => {
      if (typeof value === 'string') {
        if (value.match(/^\d+n$/)) {
          return BigInt(value.substring(0, value.length - 1))
        }

        if (foundJSON[value]) {
          return foundJSON[value]
        }

        let uuid: boolean | string = false
        Object.keys(foundJSON2).forEach((key) => (value.match(key) ? (uuid = key) : null))
        if (uuid) return `[CQ:json,data=${foundJSON2[uuid]}]`
      }

      return value
    })
  }

  return JSON.parse(serializedData, (_, value) => {
    const isCustomFormatBigInt = typeof value === 'string' && value.match(/^\d+n$/)
    if (isCustomFormatBigInt) return BigInt(value.substring(0, value.length - 1))

    return value
  })
}

export const SPLIT = /(?=\[CQ:)|(?<=])/
export const CQ_TAG_REGEXP = /^\[CQ:([a-z]+)(?:,([^\]]+))?]$/
export const CQ_TAG_JSON_REGEXP = /^\[CQ:json,data=(\{.*\})\]$/

/**
 * CQ码转JSON
 */
export function convertCQCodeToJSON(msg: string) {
  let msgArr: string[] = []
  msg.split(SPLIT).forEach((value) => {
    if (value.at(0) !== '[' && value.at(value.length - 1) === ']' && msgArr.length > 0) {
      msgArr[msgArr.length - 1] += value
    } else {
      msgArr.push(value)
    }
  })

  return msgArr.map((tagStr) => {
    const json = CQ_TAG_JSON_REGEXP.exec(tagStr)
    if (json !== null) return { type: 'json', data: { data: json[1] } }

    const match = CQ_TAG_REGEXP.exec(tagStr)
    if (match === null) return { type: 'text', data: { text: tagStr } }

    const [, tagName, value] = match
    if (value === undefined) return { type: tagName, data: {} }

    const data = Object.fromEntries(
      value.split(',').map((v) => {
        const index = v.indexOf('=')
        return [v.slice(0, index), v.slice(index + 1)]
      })
    )

    return { type: tagName, data }
  })
}

/**
 * JSON转CQ码
 */
export function convertJSONToCQCode(
  json: SendMessageObject | SendMessageArray | ReceiveMessageObject | ReceiveMessageArray
): string {
  const conver = (json: SendMessageObject | ReceiveMessageObject) => {
    if (json.type === 'text') return json.data.text
    return `[CQ:${json.type}${Object.entries(json.data)
      .map(([k, v]) => (v ? `,${k}=${v}` : ''))
      .join('')}]`
  }

  if (Array.isArray(json)) {
    return json.map((item) => conver(item)).join('')
  } else {
    return conver(json)
  }
}

export function CQCodeUnescape(str: string): string {
  return str
    .replace(/&#44;/g, ',')
    .replace(/&#91;/g, '[')
    .replace(/&#93;/g, ']')
    .replace(/&amp;/g, '&')
}
