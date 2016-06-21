import React from 'react';

import iconMenu from '../img/icons/icon-menu.svg';

export default class AppIcon extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <span className="app-icon"></span>
                <span className="svg-wrap" dangerouslySetInnerHTML={{__html: iconMenu}} />
            </div>
        )
    }
}
