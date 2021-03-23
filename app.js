/**
 * 入口文件
 */

/**
 * 开发依赖
 */
let path = require('path')
let util = require('./util')
let base64 = util.base64
let readSync = util.readSync
let writeSync = util.writeSync
let mkDir = util.mkDir
let existsDir = util.existsDir

let requestSync = require('sync-request');

let BUILD_DIR = 'dist' // 构建目录
let ENTRY_FILE = './node.txt' // SS(R)入口
let PASSWORD_DIR = 'dist/123456' // 新建一个目录，防止他人直接访问

let str = readSync(ENTRY_FILE)


if (!existsDir(PASSWORD_DIR)){
    mkDir(PASSWORD_DIR);
}

let checker = item => {
    return item => item.includes('ssr://') || item.includes('ss"//')
}

// Map all the item include `ssr://` and serialize those items
let result = str.split('\n\n')
                .filter(item => checker(item))
                .join('\r\n')

writeSync(path.resolve(__dirname, PASSWORD_DIR, 'index.html'), base64(result))


let resultForClash = encodeURIComponent(str.split('\n')
                .filter(item => checker(item))
                .join('|'))
const url = 'https://api.mcmz.xyz/sub?target=clash&url=' + resultForClash;
let res = requestSync('GET', url);
writeText1 =  res.getBody('utf-8')
writeSync(path.resolve(__dirname, PASSWORD_DIR, 'clash.yaml'), writeText1)

let dns = `

dns:
  enable: true
  enhanced-mode: redir-host
  listen: 0.0.0.0:53
  nameserver:
    - 223.5.5.5

`

writeText2 = res.getBody('utf-8').slice(0, res.getBody('utf-8').indexOf("proxies:")) + dns + res.getBody('utf-8').slice(res.getBody('utf-8').indexOf("proxies:"));

writeSync(path.resolve(__dirname, PASSWORD_DIR, 'clash_global.yaml'), writeText2)
