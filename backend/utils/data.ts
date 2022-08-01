import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import jsonfile from 'jsonfile'
// import { json } from 'stream/consumers'

let dir = 'data'

mkdirSync(dir, { recursive: true })

export class DataFile<T> {
  // file = data/user.json
  // data = []
  constructor(private file: string, public data: T) {}
  save(): void {
    jsonfile.writeFile(this.file, this.data)
  }
}
// 'users.json', []
export function loadDataFile<T>(filename: string, defaultValue: T): DataFile<T> {
  let file = join(dir, filename);
  let data: T
  if (existsSync(file)) {
    data = jsonfile.readFileSync(file)
  } else {
    data = defaultValue
  }
  return new DataFile(file, data)
}

