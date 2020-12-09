import './index.css';
import * as serviceWorker from './serviceWorker';

// import css
import './css/main.scss';

// import react and js
import MediaPlayer from './js/MediaPlayer';
import NonMedia from './js/Templates/NonMedia/NonMedia'
import WebView from './js/Templates/WebView/WebView'
import LargeGraphicOnly from './js/Templates/LargeGraphicOnly/LargeGraphicOnly'
import LargeGraphicWithSoftbuttons from './js/Templates/LargeGraphicWithSoftbuttons/LargeGraphicWithSoftbuttons'
import GraphicWithTextButtons from './js/Templates/GraphicWithTextButtons/GraphicWithTextButtons'
import TextButtonsWithGraphic from './js/Templates/TextButtonsWithGraphic/TextButtonsWithGraphic'
import TextButtonsOnly from './js/Templates/TextButtonsOnly/TextButtonsOnly'
import TilesOnly from './js/Templates/TilesOnly/TilesOnly';
import TextWithGraphic from './js/Templates/TextWithGraphic/TextWithGraphic'
import GraphicWithText from './js/Templates/GraphicWithText/GraphicWithText'
import DoubleGraphicWithSoftbuttons from './js/Templates/DoubleGraphicWithSoftbuttons/DoubleGraphicWithSoftbuttons'
import HMIMenu from './js/HMIMenu';
import InAppMenu from './js/InAppMenu';
import InAppList from './js/InAppList';
import AppStore from './js/AppStore';
import AppStoreMenu from './js/AppStoreMenu';
import WebEngineAppContainer from './js/WebEngineAppContainer';
import Keyboard from './js/Keyboard';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import { flags } from './js/Flags'

import { Route, HashRouter } from 'react-router-dom'

import { Provider } from 'react-redux'
import store from './js/store'

import Controller from './js/Controllers/Controller'
import FileSystemController from './js/Controllers/FileSystemController';
import bcController from './js/Controllers/BCController'
import {
    setTheme, 
    setPTUWithModem, 
    updateAppStoreConnectionStatus, 
    updateInstalledAppStoreApps, 
    setDDState
} from './js/actions'
class HMIApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dark: true
        }
        this.sdl = new Controller();
        this.handleClick = this.handleClick.bind(this);
        this.togglePTUWithModem = this.togglePTUWithModem.bind(this);
        this.handleDDToggle = this.handleDDToggle.bind(this);
    }
    handleClick() {
        var theme = !this.state.dark
        this.setState({ dark: theme})
        store.dispatch(setTheme(theme))
    }
    handleShutdown(){
        bcController.onIgnitionCycleOver()
        bcController.onExitAllApplications("IGNITION_OFF")
    }
    togglePTUWithModem(){
        store.dispatch(setPTUWithModem(!this.props.ptuWithModemEnabled))
    }
    handleDDToggle(){
        store.dispatch(setDDState(!this.props.dd));
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
                    <div className="toggle-ptu-with-modem-button" >
                        <input type="checkbox" onClick={this.togglePTUWithModem} checked={this.props.ptuWithModemEnabled}/>
                        <label>PTU using in-vehicle modem</label>
                    </div>
                    <div className="driver-distraction-button" >
                        <input type="checkbox" onClick={this.handleDDToggle} checked={this.props.dd}/>
                        <label>Driver Distraction</label>
                    </div>
                </div>
                {
                    this.props.webEngineApps.map((app) => {
                        let query = `?sdl-host=${flags.CoreHost}&sdl-port=${flags.CoreWebEngineAppPort}&sdl-transport-role=${app.transportType.toLowerCase()}-server`;
                        var style = { display: 'none' };
                        if (this.props.showWebView && app.runningAppId === this.props.activeAppId) {
                            style = {};
                        }
                        return (<WebEngineAppContainer key={app.policyAppID}
                            style={style}
                            policyAppID={app.policyAppID}
                            iframeUrl={app.appUrl + app.entrypoint + query} />);
                    })
                }
            </div>
        )
    }
    componentDidMount() {
        this.sdl.connectToSDL()
        if (window.performance.memory) { // chromium --enable-precise-memory-info
            this.memoryUsageInterval = setInterval(function(self) {
                var mem = window.performance.memory;
                if (mem.usedJSHeapSize / mem.jsHeapSizeLimit > 0.75) {
                    for (var app of self.props.webEngineApps) {
                        if (app.runningAppId) {
                            bcController.onExitApplication('RESOURCE_CONSTRAINT', app.runningAppId);
                        }
                    }
                }
            }, 10000, this);
        }

        var waitCoreInterval = setInterval(() => {
            var sdlSocket = this.sdl.socket
            if (sdlSocket.readyState === sdlSocket.OPEN) {
                setTimeout(() => { // give time to reply to IsReady
                    FileSystemController.connect(flags.FileSystemApiUrl).then(() => {
                        console.log('Connected to FileSystemController');
                        store.dispatch(updateAppStoreConnectionStatus(true));
                        FileSystemController.onDisconnect(() => { store.dispatch(updateAppStoreConnectionStatus(false)); });
            
                        FileSystemController.subscribeToEvent('GetInstalledApps', (success, params) => {
                            if (!success || !params.apps) {
                                console.error('error encountered when retrieving installed apps');
                                return;
                            }
            
                            params.apps.map((app) => {
                                FileSystemController.parseWebEngineAppManifest(app.appUrl).then((manifest) => {
                                    let appEntry = Object.assign(app, {
                                        entrypoint: manifest.entrypoint,
                                        version: manifest.appVersion
                                    });
                                    store.dispatch(updateInstalledAppStoreApps(appEntry));
                                    bcController.getAppProperties(app.policyAppID);
                                    return true;
                                });
                                return true;
                            });
                        });
            
                        FileSystemController.sendJSONMessage({
                            method: 'GetInstalledApps', params: {}
                        });
                    }, () => { store.dispatch(updateAppStoreConnectionStatus(false)); });
                }, 500); // setTimeout
                clearInterval(waitCoreInterval);
            }
        }, 500); // setInterval
    }
    componentWillUnmount() {
        this.sdl.disconnectFromSDL()
        clearInterval(this.memoryUsageInterval);
    }
}

const mapStateToProps = (state) => {
    return {
        ptuWithModemEnabled: state.system.ptuWithModemEnabled,
        webEngineApps: state.appStore.installedApps.filter(app => app.runningAppId),
        showWebView: state.appStore.webViewActive,
        activeAppId: state.activeApp,
        dd: state.ddState
    }
}
HMIApp = connect(mapStateToProps)(HMIApp)

// render
ReactDOM.render((
    <Provider store={store}>
    <HMIApp>
        <HashRouter>
            <Route path="/" exact component={HMIMenu} />
            <Route path="/media" component={MediaPlayer} />
            <Route path="/nonmedia" component={NonMedia} />
            <Route path="/web-view" component={WebView} />
            <Route path="/large-graphic-only" component={LargeGraphicOnly} />
            <Route path="/large-graphic-with-softbuttons" component={LargeGraphicWithSoftbuttons} />
            <Route path="/graphic-with-text-buttons" component={GraphicWithTextButtons} />
            <Route path="/text-buttons-with-graphic" component={TextButtonsWithGraphic} />
            <Route path="/tiles-only" component={TilesOnly} />            
            <Route path="/text-buttons-only" component={TextButtonsOnly} />
            <Route path="/text-with-graphic" component={TextWithGraphic}/>
            <Route path="/graphic-with-text" component={GraphicWithText}/>
            <Route path="/double-graphic-with-softbuttons" component={DoubleGraphicWithSoftbuttons}/>
            <Route path="/inappmenu" component={InAppMenu} />
            <Route path="/inapplist" component={InAppList} />
            <Route path="/appstore" component={AppStore} />
            <Route path="/appstoremenu" component={AppStoreMenu} />
            <Route path="/keyboard" component={Keyboard} />
        </HashRouter>
    </HMIApp>
    </Provider>
), document.getElementById('app'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: 
// https://create-react-app.dev/docs/making-a-progressive-web-app/
serviceWorker.unregister();
