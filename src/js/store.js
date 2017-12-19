import { createStore, applyMiddleware } from 'redux'
import { hmi } from './reducers'
import thunk from 'redux-thunk';
let store = createStore(
    hmi,
    applyMiddleware(thunk))
export default store