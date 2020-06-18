import React from 'react';

import AppHeader from './containers/Header';
import AppList from './containers/AppList';
import AppServices from './containers/AppServices';

export default class HMIMenu extends React.Component {
    render() {
        return (
            <div>
                <AppHeader icon="store" backLink="" appName="Menu" />
                <AppList />
                <AppServices />
            </div>
        )
    }
}
