import React from 'react';
import AppHeader from '../../containers/Header';

import store from '../../store';
import { appStoreWebViewActive, appStoreWebViewInactive } from '../../actions';
import RpcFactory from '../../Controllers/RpcFactory';

class WebView extends React.Component {
    componentWillMount() {
        store.dispatch(appStoreWebViewActive());
        this.props.controller.send(RpcFactory.NonSdlUpdateWebViewVisible(true));
    }

    componentWillUnmount() {
        store.dispatch(appStoreWebViewInactive());
        this.props.controller.send(RpcFactory.NonSdlUpdateWebViewVisible(false));
    }

    render() {
        return (
            <div className="webView">
                <AppHeader backLink="/" menuName="Apps" icon="false"/>
            </div>
        )
    }
}

export default WebView;