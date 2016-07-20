import React from 'react';

import AppHeader from './AppHeader';
import SubMenu from './containers/SubMenu';

export default class InAppMenu extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <AppHeader backLink="/" menuName="APPS"/>
                <SubMenu />
            </div>
        )
    }
}
