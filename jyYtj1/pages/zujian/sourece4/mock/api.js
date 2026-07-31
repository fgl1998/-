import rootData from './root.json'
import data140000000000 from './140000000000.json'
import data140100000000 from './140100000000.json'
import data140200000000 from './140200000000.json'
import data140105000000 from './140105000000.json'
import data140106000000 from './140106000000.json'
import data140212000000 from './140212000000.json'
import data130000000000 from './130000000000.json'
import data130100000000 from './130100000000.json'
import data130102000000 from './130102000000.json'

const database = {
  root: rootData,
  '140000000000': data140000000000,
  '140100000000': data140100000000,
  '140200000000': data140200000000,
  '140105000000': data140105000000,
  '140106000000': data140106000000,
  '140212000000': data140212000000,
  '130000000000': data130000000000,
  '130100000000': data130100000000,
  '130102000000': data130102000000,
}

function clone(data) {
  return JSON.parse(JSON.stringify(data || []))
}

export function getRootAddressList() {
  return clone(database.root)
}

export function fetchAddressChildren(node) {
  const key = node && (node.areaid || node.areacode || node.value || node._value)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(clone(database[key] || []))
    }, 300)
  })
}
