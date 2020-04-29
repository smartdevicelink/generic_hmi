// import css
import '../css/main.scss';

// import react and js
import MediaPlayer from './MediaPlayer';
import NonMedia from './Templates/NonMedia/NonMedia'
import LargeGraphicOnly from './Templates/LargeGraphicOnly/LargeGraphicOnly'
import LargeGraphicWithSoftbuttons from './Templates/LargeGraphicWithSoftbuttons/LargeGraphicWithSoftbuttons'
import GraphicWithTextButtons from './Templates/GraphicWithTextButtons/GraphicWithTextButtons'
import TextButtonsWithGraphic from './Templates/TextButtonsWithGraphic/TextButtonsWithGraphic'
import TextButtonsOnly from './Templates/TextButtonsOnly/TextButtonsOnly'
import TilesOnly from './Templates/TilesOnly/TilesOnly';
import TextWithGraphic from './Templates/TextWithGraphic/TextWithGraphic'
import GraphicWithText from './Templates/GraphicWithText/GraphicWithText'
import DoubleGraphicWithSoftbuttons from './Templates/DoubleGraphicWithSoftbuttons/DoubleGraphicWithSoftbuttons'
import HMIMenu from './HMIMenu';
import InAppMenu from './InAppMenu';
import InAppList from './InAppList';
import AppStore from './AppStore';
import AppStoreMenu from './AppStoreMenu';
import WebEngineAppContainer from './WebEngineAppContainer'
import Alert from './Alert'
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import { flags } from './Flags'

import { Router, Route, hashHistory } from 'react-router'

import { Provider } from 'react-redux'
import store from './store'

import Controller from './Controllers/Controller'
import FileSystemController from './Controllers/FileSystemController';
import bcController from './Controllers/BCController'
import {setTheme, setPTUWithModem, updateAppStoreConnectionStatus, updateInstalledAppStoreApps} from './actions'
class HMIApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dark: true
        }
        this.sdl = new Controller
        this.handleClick = this.handleClick.bind(this);
        this.togglePTUWithModem = this.togglePTUWithModem.bind(this);
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
                </div>
                {
                    this.props.webEngineApps.map((app) => {
                        let query = `?sdl-host=${flags.CoreHost}&sdl-port=${flags.CoreWebEngineAppPort}&sdl-transport-role=${app.transportType.toLowerCase()}-server`;
                        return (<WebEngineAppContainer key={app.policyAppID} policyAppID={app.policyAppID} iframeUrl={app.appUrl + app.entrypoint + query} />);
                    })
                }
            </div>
        )
    }
    componentDidMount() {
        this.sdl.connectToSDL()

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
                    FileSystemController.parseWebEngineAppManifest(app.appUrl).then((manifest) =>{
                        let appEntry = Object.assign(app, {
                            entrypoint: manifest.entrypoint,
                            version: manifest.appVersion
                        });
                        store.dispatch(updateInstalledAppStoreApps(appEntry));
                        bcController.getAppProperties(app.policyAppID);
                    });
                });
            });
    
            FileSystemController.sendJSONMessage({
                method: 'GetInstalledApps', params: {}
            });
        }, () => { store.dispatch(updateAppStoreConnectionStatus(false)); });
    }
    componentWillUnmount() {
        this.sdl.disconnectFromSDL()
    }
}

const mapStateToProps = (state) => {
    return {
        ptuWithModemEnabled: state.system.ptuWithModemEnabled,
        webEngineApps: state.appStore.installedApps.filter(app => app.runningAppId)
    }
}
HMIApp = connect(mapStateToProps)(HMIApp)

// render
ReactDOM.render((
    <Provider store={store}>
    <HMIApp>
        <Router history={hashHistory}>
            <Route path="/" component={HMIMenu} />
            <Route path="/media" component={MediaPlayer} />
            <Route path="/nonmedia" component={NonMedia} />
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
        </Router>
    </HMIApp>
    </Provider>
), document.getElementById('app'));
