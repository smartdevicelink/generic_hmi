import React from 'react';
import AppHeader from '../../containers/Header';

class WebView extends React.Component {
    render() {
        return (
            <div className="webView">
                <AppHeader backLink="/" menuName="Apps" icon="false"/>
            </div>
        )
    }
}

export default WebView;