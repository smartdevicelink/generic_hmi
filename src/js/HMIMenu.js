import React from 'react';

import AppHeader from './AppHeader';
import AppLauncher from './AppLauncher';

let apps = [
    { id: 1, name: 'Spotify', },
    { id: 2, name: 'Pandora', },
    { id: 3, name: 'VSCO', },
    { id: 4, name: 'Instagram', },
]

export default class HMIMenu extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <AppHeader appName="Menu" />
                <AppLauncher apps={apps} />
            </div>
        )
    }
}
