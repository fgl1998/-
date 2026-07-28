import { areaCode } from './city'
import configCities from './citys/index'

let name = 'config' + areaCode
let config = { ...configCities[name] }
export default config
