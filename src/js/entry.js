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
import Alert from './Alert'
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import { Provider } from 'react-redux'
import store from './store'

import Controller from './Controllers/Controller'
import bcController from './Controllers/BCController'
import {setTheme, setDDState} from './actions'
class HMIApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dark: true,
            dd: false // Driver Distraction State
        }
        this.handleClick = this.handleClick.bind(this);
        this.sdl = new Controller(this.handleClick)
        this.togglePTUWithModem = this.togglePTUWithModem.bind(this);
        this.handleDDToggle = this.handleDDToggle.bind(this);
    }
    handleClick(newState) {
        var theme = newState
        this.setState({ dark: theme})
        store.dispatch(setTheme(theme))
    }
    handleShutdown(){
        bcController.onIgnitionCycleOver()
        bcController.onExitAllApplications("IGNITION_OFF")
    }
    handleDDToggle(){
        var ddState = !this.state.dd;
        this.setState({dd: ddState});
        store.dispatch(setDDState(ddState));
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
    }
    componentWillUnmount() {
        // this.sdl.disconnectFromSDL()
    }
}

const mapStateToProps = (state) => {
    return {
        ptuWithModemEnabled: state.system.ptuWithModemEnabled,
        webEngineApps: state.appStore.installedApps.filter(app => app.runningAppId)
    }
}
HMIApp = connect(mapStateToProps)(HMIApp)

const history = syncHistoryWithStore(hashHistory, store);

// render
ReactDOM.render((
    <Provider store={store}>
    <HMIApp>
        <Router history={history}>
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
        </Router>
    </HMIApp>
    </Provider>
), document.getElementById('app'));
