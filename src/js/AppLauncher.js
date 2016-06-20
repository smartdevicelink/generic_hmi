import React from 'react';

import LauncherItem from './LauncherItem';

export default class AppLauncher extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let launchableApps = this.props.apps.map((app) => {
            return <div key={app.id + app.name}><LauncherItem app={app} /></div>;
        })
        return (
            <div className="app-launcher">
                { launchableApps }
            </div>
        )
    }
}
