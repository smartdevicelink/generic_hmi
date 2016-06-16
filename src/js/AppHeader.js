import React from 'react';

export default class AppHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="app__header">
                <div>
                    <a href="">Menu Link</a>
                </div>
                <div>
                    <p>{this.props.appName}</p>
                </div>
                <div>
                    <p>app</p>
                </div>
            </div>
        )
    }
}
