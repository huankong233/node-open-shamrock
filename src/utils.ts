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
  const serializedData = json.replace(numbersBiggerThanMaxInt, '"$1n"')

  return JSON.parse(serializedData, (_, value) => {
    const isCustomFormatBigInt = typeof value === 'string' && value.match(/^\d+n$/)

    if (isCustomFormatBigInt) return BigInt(value.substring(0, value.length - 1))

    return value
  })
}
