// import css
import '../css/main.scss';

// import react and js
import MediaPlayer from './MediaPlayer';
import HMIMenu from './HMIMenu';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'

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
                <div className="toggle-button" onClick={this.handleClick}>Click to toggle theme.</div>
            </div>
        )
    }
}

// render
ReactDOM.render((
    <HMIApp>
        <Router history={hashHistory}>
            <Route path="/" component={HMIMenu} />
            <Route path="/media" component={MediaPlayer} />
        </Router>
    </HMIApp>
), document.getElementById('app'));
