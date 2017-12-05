import React from 'react';
import { Link } from 'react-router';

import iconMenu from '../img/icons/icon-menu.svg';

export default class AppIcon extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        //While viewing menu, pressing menu button takes user back to app screen
        var path = this.props.isShowingMenu ? this.props.backLink : "/inappmenu" 
        var icon = this.props.icon ?
            (<img className="app-icon" src={this.props.icon} />)
            : (<span className="app-icon"></span>)
        return (
            <div>
                <Link to={path} onClick={() => this.props.onSelection(this.props.appID, path)}>
                    {icon}
                    <span className="svg-wrap" dangerouslySetInnerHTML={{__html: iconMenu}} />
                </Link>
            </div>
        )
    }
}
