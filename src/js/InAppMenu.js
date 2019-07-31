import React from 'react';

import AppHeader from './containers/Header';
import Menu from './containers/Menu';

export default class InAppMenu extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <AppHeader backLink="/" menuName="Back"/>
                <Menu />
            </div>
        )
    }
}
