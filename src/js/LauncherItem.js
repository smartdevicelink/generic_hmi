import React from 'react';

export default class AppLauncher extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="launcher-item">
                <div className="launcher-item__image">
                    <img src="" />
                </div>
                <div className="launcher-item__name">
                    <p className="t-small t-light">{this.props.app.name}</p>
                </div>
            </div>
        )
    }
}
