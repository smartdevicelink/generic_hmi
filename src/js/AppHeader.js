import React from 'react';
import { Link } from 'react-router';

import MenuIcon from './containers/MenuIcon';
import Name from './containers/Name';
import MenuLink from './AppMenuLink'

export default class AppHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const icon = this.props.appIcon == 'false' ? (<div />) : <MenuIcon /> ;
        return (

            <div className="app__header">
                <MenuLink menuName={this.props.menuName} backLink={this.props.backLink}/>
                <Name />
                { icon }
            </div>
        )
    }
}
