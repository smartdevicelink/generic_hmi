import React from 'react';
import { Link } from 'react-router';

import iconMenu from '../img/icons/icon-menu.svg';

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
                    <p className="t-small t-light th-f-color">
                        <span className="svg-wrap" dangerouslySetInnerHTML={{__html: iconMenu}} />
                        {this.props.appName}
                    </p>
                </div>
                <AppIcon />
            </div>
        )
    }
}
