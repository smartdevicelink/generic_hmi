import React from 'react';
import { Link } from 'react-router';

import MenuIcon from './containers/MenuIcon';
import AppName from './AppName';

export default class AppHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const icon = this.props.appIcon == 'false' ? (<div />) : <MenuIcon /> ;
        return (

            <div className="app__header">
                <div>
                    <Link to={this.props.backLink} href="" className="t-small t-medium th-f-color t-ls1">{this.props.menuName}</Link>
                </div>
                <AppName name={this.props.appName}/>
                { icon }
            </div>
        )
    }
}
