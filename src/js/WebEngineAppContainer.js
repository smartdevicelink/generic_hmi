import React from 'react';

export default class WebEngineAppContainer extends React.Component {
    render() {
        return (<div className="webengine-app-container">
            <iframe src={this.props.iframeUrl} style={{ display: 'none' }} />
        </div>);
    }
}