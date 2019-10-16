import './index.css';
import * as serviceWorker from './serviceWorker';

// import css
import './css/main.scss';

// import react and js
import MediaPlayer from './js/MediaPlayer';
import NonMedia from './js/Templates/NonMedia/NonMedia'
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
import React from 'react';
import ReactDOM from 'react-dom';
import { Route, HashRouter } from 'react-router-dom'

import { Provider } from 'react-redux'
import store from './js/store'

import Controller from './js/Controllers/Controller'
import bcController from './js/Controllers/BCController'
import {setTheme} from './js/actions'
class HMIApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dark: true
        }
        this.sdl = new Controller();
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

// render
ReactDOM.render((
    <Provider store={store}>
    <HMIApp>
        <HashRouter>
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
        </HashRouter>
    </HMIApp>
    </Provider>
), document.getElementById('app'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
