import React from 'react';
import { connect } from 'react-redux';
import store from './store';

import VScrollMenu from './VScrollMenu';
//import BCController from './Controllers/BCController';
//import FileSystemController from './Controllers/FileSystemController'
import vrController from './Controllers/VRController'

import { toggleVR } from './actions';

let TOGGLE_VR_COMMAND = 1;

class VRControls extends React.Component {
    constructor() {
        super();

        this.state = {
            vrActive: false
        }

        this.onSelection = this.onSelection.bind(this);
    }

    onSelection(appID, cmdID) {
        if (cmdID === TOGGLE_VR_COMMAND) {
            store.dispatch(toggleVR());
            let state = store.getState().vr;
            if (state.active) {
                console.log("Send VR.Started")
                vrController.startVR();
            }
            else {
                console.log("Send VR.Stopped")
                vrController.stopVR();
            }
        }
    }

    componentDidMount() {

    }

    render() {
        let state = store.getState();
        var menuData = [
            {
                image: state.vr.active ? '0x90' : '0x91',
                imageType: 'STATIC',
                appID: 0,
                cmdID: TOGGLE_VR_COMMAND,
                name: state.vr.active ? 'Stop VR' : 'Start VR'
            }
        ]

        return (
            <div>
                {<VScrollMenu data={menuData}
                        theme={this.props.theme}
                        onSelection={this.onSelection}
                        isPerformingInteraction={false} />}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    var props = { vrActive: state.vr.active }

    return props;
}

export default connect(
    mapStateToProps
)(VRControls)
