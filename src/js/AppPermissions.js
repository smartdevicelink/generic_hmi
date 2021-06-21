import React from 'react';
import { connect } from 'react-redux'

import AppHeader from './containers/Header';
import sdlController from './Controllers/SDLController';
import { Link } from 'react-router-dom';
import store from './store';
import { closePermissionsView } from './actions'

const mapStateToProps = (state) => {
    var theme = state.theme
    var editingAppID = state.system.editingPermissionsAppId;
    var allowedFunctions = state.system.allowedFunctions;

    return {
        theme: theme,
        editingAppID: editingAppID,
        allowedFunctions: allowedFunctions,
        activeLayout: state.ui[editingAppID]?.displayLayout,
        appOptions: state.appList
    };
}

class Permissions extends React.Component {
    constructor(props) {
        super(props);

        this.toggleFunction = this.toggleFunction.bind(this);
        this.savePermissions = this.savePermissions.bind(this);

        this.state = {
            allowedFunctions: props.allowedFunctions
        }
    }

    toggleFunction(name) {
        var functions = [ ...this.state.allowedFunctions ]
        for (var f of functions) {
            if (f.name === name) {
                f.allowed = !f.allowed;
                this.setState({ allowedFunctions: functions });
                return;
            }
        }
    }

    savePermissions() {
        var different = []
        for (var f_changed of this.state.allowedFunctions) {
            for (var f_original of this.props.allowedFunctions) {
                if (f_changed.name === f_original.name) {
                    if (f_changed.allowed !== f_original.allowed) {
                        different.push({ id: f_changed.id, name: f_changed.name, allowed: f_changed.allowed });
                    }
                    break;
                }
            }
        }

        if (different.length > 0) {
            sdlController.onAppPermissionConsent(this.props.editingAppID, different);
        }
    }

    componentWillUnmount() {
        store.dispatch(closePermissionsView());
    }

    render() {
        var options =this.state.allowedFunctions.map((f) => (
                <div className="vscrollmenu-item th-b-color th-bb-color-secondary" key={f.id}
                    onClick={(e) => this.toggleFunction(f.name)} style={{ height: 'auto' }}>
                    <div className={"vscrollmenu-item__primary th-f-color"}>
                        <div class="form-check form-switch permissionsToggle">
                            <input class="form-check-input" type="checkbox" checked={f.allowed} style={{ width: '5em' }} />
                        </div>
                        <div className={"vscrollmenu-item__name th-f-color"}>
                            <p class="t-large t-light th-f-color">{f.title || f.name}</p>
                            <p className="t-small t-light th-f-color-secondary">{f.body}</p>
                        </div>
                    </div>
                </div>
            ));

        return (
            <div>
                <AppHeader backLink={'/permissions'} menuName="Back"
                    icon='custom' 
                    jsxIcon={<div><Link to={'/'}
                        className="t-small t-medium th-f-color t-ls1"
                        onClick={() => { this.savePermissions(); }}>SAVE</Link></div>} />
                <div className="vscrollmenu">
                    { options }
                </div>
            </div>
        )
    }
}

const PermissionsView = connect(mapStateToProps)(Permissions);
export default PermissionsView;
