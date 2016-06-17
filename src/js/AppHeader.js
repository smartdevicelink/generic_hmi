import React from 'react';

import AppIcon from './AppIcon';

export default class AppHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="app__header">
                <div>
                    <a href="" className="t-small t-medium fc-white t-ls1">MENU</a>
                </div>
                <div>
                    <p className="t-small t-light fc-white">{this.props.appName}</p>
                </div>
                <AppIcon />
            </div>
        )
    }
}
