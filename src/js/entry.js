// import css
import '../css/main.scss';

// import react and js
import MediaPlayer from './MediaPlayer';
import HMIMenu from './HMIMenu';
import InAppMenu from './InAppMenu';
import InAppList from './InAppList';
import TilesOnly from './TilesOnly';
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'

import { Provider } from 'react-redux'
import configureStore from './store'

import Controller from './Controllers/Controller'
import bcController from './Controllers/BCController'

import storage from './utils/storage';
import { SDL_HMI_STORAGE } from './constants';

class HMIApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dark: true
        }
        this.sdl = new Controller
        this.handleClick = this.handleClick.bind(this);
        this.initServiceWorker();
    }

    initServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            }).then(registration => {
                console.log('Registration was successful', registration.scope);
            }).catch(err => {
                console.log('Service worker registration failed', err);
            });
        }
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
                <div>
                    <div className="toggle-button" onClick={this.handleClick}>Toggle theme</div>
                    <div className="shutdown-button" onClick={this.handleShutdown}>Shutdown</div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.sdl.connectToSDL()
    }

    componentWillUnmount() {
        this.sdl.disconnectFromSDL()
    }
}

const TEN_MINUTES = 10 * 60 * 1000;
// Get any stored state if available
let initialState = storage.get(SDL_HMI_STORAGE);
// Make sure it's not older than ten minutes
const valid = initialState ? (Date.now() - initialState.ts) < TEN_MINUTES : false;
if (!initialState || !valid) {
    initialState = undefined;
} else {
    // Reset the timestamp on the storage key
    delete initialState.ts;
}

const store = configureStore(initialState);

// render
const entrypoint = document.getElementById('app');
if (entrypoint) {
    render(
        <Provider store={store}>
            <HMIApp>
                <Router history={hashHistory}>
                    <Route path="/" component={HMIMenu} />
                    <Route path="/media" component={MediaPlayer} />
                    <Route path="/inappmenu" component={InAppMenu} />
                    <Route path="/inapplist" component={InAppList} />
                    <Route path="/tilesonly" component={TilesOnly} />
                </Router>
            </HMIApp>
        </Provider>,
        entrypoint
    );
}
