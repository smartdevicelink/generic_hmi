// import css
import '../css/main.scss';

// import react and js
import MediaPlayer from './MediaPlayer';
import HMIMenu from './HMIMenu';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'

// render
ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={HMIMenu} />
        <Route path="/media" component={MediaPlayer} />
    </Router>
), document.getElementById('app'));
