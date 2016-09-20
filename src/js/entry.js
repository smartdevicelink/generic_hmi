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
                <div>
                    <div className="toggle-button" onClick={this.handleClick}>Toggle theme</div>
                    <div className="shutdown-button" onClick={this.handleShutdown}>Shutdown</div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        // Install service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            }).then(registration => {
                console.log('Registration was successful', registration.scope);
                this.sdl.connectToSDL()
                .then(data => {
                    this.sdl.addSWListener();
                })
                .then(res => {
                    this.sdl.registerComponents();
                })
            }).catch(err => {
                console.log('Service worker registration failed', err);
            });
        }
    }

    componentWillUnmount() {
        this.sdl.disconnectFromSDL()
    }
}

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
