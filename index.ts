import { readdirSync } from 'node:fs'
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const appsDir = join(__dirname, 'apps');
// 写入不想要的文件
const IncludeFile = []
// 如不想要添加表情   const IncludeFile = [' add.ts']
const files = readdirSync(appsDir).filter(file => (!IncludeFile.includes(file) && (/(.js|.ts)$/.test(file))))
const arr = []
files.forEach((file) => {
  arr.push(import(`./apps/${file}`))
})
const ret = await Promise.allSettled(arr)
const apps = {}
for (const i in files) {
  // 得到插件名
  const name = files[i].replace(/(.js|.ts)/, '')
  //
  if (ret[i].status !== 'fulfilled') {
    logger.error(`载入插件错误：${logger.chalk.red(name)}`)
    continue
  }
  const key = Object.keys(ret[i].value)[0]
  apps[name] = ret[i].value[key]
}
export { apps }
