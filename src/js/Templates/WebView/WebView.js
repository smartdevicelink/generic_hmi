import React from 'react';
import AppHeader from '../../containers/Header';

import store from '../../store';
import { appStoreWebViewActive, appStoreWebViewInactive } from '../../actions';

class WebView extends React.Component {
    componentWillMount() {
        console.log("web view mounted")
        console.log(this.props);

        store.dispatch(appStoreWebViewActive());
    }

    componentWillUnmount() {
        store.dispatch(appStoreWebViewInactive());
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