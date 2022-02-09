import React from 'react';

import AppHeader from './containers/Header';
import VRControls from './VRControls';

export default class VRPlugin extends React.Component {
    //constructor(props) {
    //    super(props);
    //}

    render() {
        return (
            <div>
                <AppHeader icon="store" backLink="/settings" menuName="Back" title={window.flags.VRPlugin.MenuNavTitle ? window.flags.VRPlugin.MenuNavTitle : "Voice Recognition"} />
                {
                    //Add your Voice Recognition controls here
                }
                <VRControls />
            </div>
        )
    }
}
