import React from 'react';

import {ScrollableButtons} from './containers/Buttons';

export default class ScrollableMessage extends React.Component {
    render() {
        return (
            <div className="scrollableMessage">
                <div className="scrollableTitle">
                    <p className="t-large th-f-color">
                        {this.props.appName}
                    </p>
                </div>
                <div className="scrollableBody">
                    <ScrollableButtons/>
                    <div className="scrollableText">
                        <p className="scrollbar t-small t-light th-f-color">{this.props.body}</p>
                    </div>
                </div>
            </div>
        )
    }
}