// import css
import '../css/main.scss';

// import react and js
import MediaPlayer from './MediaPlayer';
import NonMedia from './Templates/NonMedia/NonMedia'
import MediaCustom from './Templates/MediaCustom/MediaCustom'
import { CMenu } from './containers/Menu'
import MediaCustomPerformInteraction from './Templates/MediaCustom/MediaCustomPerformInteraction'
import CustomNonMedia from './Templates/CustomNonMedia/CustomNonMedia'
import LargeGraphicOnly from './Templates/LargeGraphicOnly/LargeGraphicOnly'
import LargeGraphicWithSoftbuttons from './Templates/LargeGraphicWithSoftbuttons/LargeGraphicWithSoftbuttons'
import CustomLargeGraphicWithSoftbuttons from './Templates/CustomLargeGraphicWithSoftbuttons/CustomLargeGraphicWithSoftbuttons'
import GraphicWithTextButtons from './Templates/GraphicWithTextButtons/GraphicWithTextButtons'
import TextButtonsWithGraphic from './Templates/TextButtonsWithGraphic/TextButtonsWithGraphic'
import TextButtonsOnly from './Templates/TextButtonsOnly/TextButtonsOnly'
import TilesOnly from './Templates/TilesOnly/TilesOnly';
import CustomTilesOnly from './Templates/CustomTilesOnly/CustomTilesOnly';
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

import { Provider } from 'react-redux'
import store from './store'

import Controller from './Controllers/Controller'
import bcController from './Controllers/BCController'
import {setTheme} from './actions'
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
        var theme = !this.state.dark
        this.setState({ dark: theme})
        store.dispatch(setTheme(theme))
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
        this.sdl.connectToSDL()
    }
    componentWillUnmount() {
        this.sdl.disconnectFromSDL()
    }
}

// render
ReactDOM.render((
    <Provider store={store}>
    <HMIApp>
        <Router history={hashHistory}>
            <Route path="/" component={HMIMenu} />
            <Route path="/media" component={MediaPlayer} />
            <Route path="/nonmedia" component={NonMedia} />
            <Route path="/text-and-softbuttos-with-graphic" component={NonMedia} />
            <Route path="/nonmedia-custom" component={CustomNonMedia} />
            <Route path="/large-graphic-only" component={LargeGraphicOnly} />
            <Route path="/large-graphic-with-softbuttons" component={LargeGraphicWithSoftbuttons} />
            <Route path="/large-graphic-with-softbuttons-custom" component={CustomLargeGraphicWithSoftbuttons} />
            <Route path="/graphic-with-text-buttons" component={GraphicWithTextButtons} />
            <Route path="/text-buttons-with-graphic" component={TextButtonsWithGraphic} />
            <Route path="/tiles-only" component={TilesOnly} />         
            <Route path="/tiles-only-custom" component={CustomTilesOnly} />        
            <Route path="/text-buttons-only" component={TextButtonsOnly} />
            <Route path="/text-with-graphic" component={TextWithGraphic}/>
            <Route path="/graphic-with-text" component={GraphicWithText}/>
            <Route path="/double-graphic-with-softbuttons" component={DoubleGraphicWithSoftbuttons}/>
            <Route path="/inappmenu" component={InAppMenu} />
            <Route path="/inapplist" component={InAppList} />
            <Route path="/media-custom" component={MediaCustom} />
            <Route path="/media-custom-pi" component={MediaCustomPerformInteraction} />
            <Route path="/media-custom-menu" component={CMenu} />
            <Route path="/custom-nonmedia" component={CustomNonMedia} />
        </Router>
    </HMIApp>
    </Provider>
), document.getElementById('app'));
