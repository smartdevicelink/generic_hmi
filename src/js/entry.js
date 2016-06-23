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

import { createStore } from 'redux'
import { hmi } from './reducers'
let store = createStore(hmi)

import { Provider } from 'react-redux'

class HMIApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dark: true
        }
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        this.setState({ dark: !this.state.dark })
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
                <div className="toggle-button" onClick={this.handleClick}>Toggle theme</div>
            </div>
        )
    }
}

// render
ReactDOM.render((
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
    </Provider>
), document.getElementById('app'));
