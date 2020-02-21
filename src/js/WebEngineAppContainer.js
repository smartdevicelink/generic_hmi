import React from 'react';

export default class WebEngineAppContainer extends React.Component {
    render() {
        return (<div className="webengine-app-container">
            <p>{`app running: ${this.props.policyAppID}`}</p>
            <iframe src={this.props.iframeUrl} 
                style={{
                    display: 'none'
                }}/>
        </div>);
    }
}