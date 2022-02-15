import React from 'react';

import AppHeader from './containers/Header';

export default class VIPlugin extends React.Component {
    render() {
        return (
            <div>
                <AppHeader icon="store" backLink="/settings" menuName="Back" title={window.flags.VIPlugin.MenuNavTitle ? window.flags.VIPlugin.MenuNavTitle : "Vehicle Info"} />
                {
                    //Add your Vehicle Data controls here
                }
            </div>
        )
    }
}
