import { createStore } from 'redux'
import { hmi } from './reducers'
let store = createStore(hmi)
export default store