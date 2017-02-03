// import css
import '../css/main.scss';

// import react and js
import MediaPlayer from './MediaPlayer';
import HMIMenu from './HMIMenu';
import InAppMenu from './InAppMenu';
import InAppList from './InAppList';
import TilesOnly from './TilesOnly';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import { Provider } from 'react-redux'
import store from './store'

import Controller from './Controllers/Controller'
import bcController from './Controllers/BCController'

class HMIApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dark: true
        }
        this.sdl = new Controller
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        this.setState({ dark: !this.state.dark })
    }
    handleShutdown(){
        bcController.onIgnitionCycleOver()
        bcController.onExitAllApplications("IGNITION_OFF")
    }
    render() {
        const themeClass = this.state.dark ? 'dark-theme' : 'light-theme';
        return(
            <div>
                <div className={themeClass}>
                    <div className="app-body">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
    componentDidMount() {
        console.log("Component did mount")
        window.addEventListener('beforeunload', this.handleShutdown);
        this.sdl.connectToSDL()
    }
    componentWillUnmount() {
        // this.sdl.disconnectFromSDL()
    }
}

const history = syncHistoryWithStore(hashHistory, store);

// render
ReactDOM.render((
    <Provider store={store}>
    <HMIApp>
        <Router history={history}>
            <Route path="/" component={HMIMenu} />
            <Route path="/media" component={MediaPlayer} />
            <Route path="/inappmenu" component={InAppMenu} />
            <Route path="/inapplist" component={InAppList} />
            <Route path="/tilesonly" component={TilesOnly} />
        </Router>
    </HMIApp>
    </Provider>
), document.getElementById('app'));
