import React from 'react';

import AppHeader from './AppHeader';
import Menu from './containers/Menu';

export default class InAppMenu extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <AppHeader backLink="/" menuName="APPS" appName="Spotify" />
                <Menu />
            </div>
        )
    }
}
