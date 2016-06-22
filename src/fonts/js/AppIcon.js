import React from 'react';
import { Link } from 'react-router';

import iconMenu from '../img/icons/icon-menu.svg';

export default class AppIcon extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Link to="/inappmenu">
                    <span className="app-icon"></span>
                    <span className="svg-wrap" dangerouslySetInnerHTML={{__html: iconMenu}} />
                </Link>
            </div>
        )
    }
}
