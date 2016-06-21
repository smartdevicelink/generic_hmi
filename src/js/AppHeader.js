import React from 'react';
import { Link } from 'react-router';

import AppIcon from './AppIcon';

export default class AppHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="app__header">
                <div>
                    <Link to="/" href="" className="t-small t-medium th-f-color t-ls1">{this.props.menuName}</Link>
                </div>
                <div>
                    <p className="t-small t-light th-f-color">{this.props.appName}</p>
                </div>
                <AppIcon />
            </div>
        )
    }
}
