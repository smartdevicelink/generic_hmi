import React from 'react';

import AppHeader from './AppHeader';
import AppList from './containers/AppList';

export default class HMIMenu extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <AppHeader appIcon="false" backLink="" appName="Menu" />
                <AppList />
            </div>
        )
    }
}
