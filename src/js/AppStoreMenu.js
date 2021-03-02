import React from 'react';
import Modal from 'react-modal'
import { connect } from 'react-redux';
import store from './store';
import { addAppPendingSetAppProperties } from './actions'

import AppHeader from './AppHeader';
import StaticIcon from './Templates/Shared/StaticIcon';
import ConfirmAlert from './ConfirmAlert';

import BCController from './Controllers/BCController';
import FileSystemController from './Controllers/FileSystemController';

class AppStoreMenuItem extends React.Component {

    render() {
        return (
            <div className="appstore-menu-item th-b-color th-bb-color-secondary" key={this.props.appName} >
                <div className="appstore-menu-item__image" >
                    <img src={this.props.appIcon} alt=""/>
                </div>
                <h2 className="t-large t-medium">{this.props.appName}</h2>
                <h4 className="t-large t-light">{this.props.appSize}</h4>
                <div className="svg-wrap" onClick={this.props.onSelect}>
                    <StaticIcon class="static-icon" image="0x0F" />
                </div>
            </div>
        )
    }
}

class AppStoreMenu extends React.Component {
    constructor() {
        super();

        this.state = {
            confirmID: null,
            appName: null,
            appIcon: null,
            appDescription: null
        };
    }

    onSelection(appID, name, icon, description) {
        this.setState((state, props) => {
            return {
                confirmID: appID,
                appName: name,
                appIcon: icon,
                appDescription: description
            }
        });
    }

    cancelUninstall() {
        this.setState((state, props) => {
            state.confirmID = null;
            return state;
        });
    }

    confirmUninstall() {
        FileSystemController.subscribeToEvent('UninstallApp', (success, params) => {
            if (!success || !params.policyAppID) {
                console.error('error encountered when uninstalling app');
                return;
            }

            store.dispatch(addAppPendingSetAppProperties({'policyAppID': params.policyAppID}, false));
            BCController.setAppProperties({ 
                policyAppID: params.policyAppID,
                enabled: false
            });
        });

        FileSystemController.sendJSONMessage({
            method: 'UninstallApp',
            params: {
                policyAppID: this.state.confirmID
            }
        });

        this.setState((state, props) => {
            return {
                confirmID: null,
                appName: null,
                appIcon: null,
                appDescription: null
            };
        });
    }

    render() {
        // these 2 vars used to calculate app size displayed in uninstall list
        const postFixes = [ "KB", "MB", "GB" ]
        const postFixSizes = [ 1024, 1048576, 1073741824 ]

        const themeClass = this.props.theme ? 'dark-theme' : 'light-theme';
        var modalClass = themeClass + " alertOverlay"

        return (
            <div>
                <Modal
                isOpen={!!this.state.confirmID}
                className="alertModal app-body"
                overlayClassName={modalClass}
                contentLabel="Example Modal">
                    <ConfirmAlert appID={this.state.confirmID} name={`Uninstall ${this.state.appName}?`}
                        description={this.state.appDescription} iconUrl={this.state.appIcon}
                        leftText="Cancel" leftCallback={() => this.cancelUninstall()} rightText="Uninstall" rightCallback={() => this.confirmUninstall()} />
                </Modal>
                <AppHeader icon='false' backLink="/appstore" menuName="STORE"/>
                <div className="appstore-menu">
                    {this.props.apps.map((app) => {

                        var postFixIndex = 0;
                        var size;
                        if (app.package && app.package.size_decompressed_bytes) {
                            while (app.package.size_decompressed_bytes > postFixSizes[postFixIndex + 1]) {
                                postFixIndex++;
                            }    
                            size = app.package.size_decompressed_bytes / postFixSizes[postFixIndex];
                        }
                        var appSize = size ? size.toFixed(1).toString() + " " + postFixes[postFixIndex] : null;

                        return <AppStoreMenuItem key={app.policyAppID}
                            onSelect={() => this.onSelection(app.policyAppID, app.name, app.iconUrl, app.description)}
                            appIcon={app.iconUrl}
                            appName={app.name}
                            appSize={appSize}
                        />
                    })}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        theme: state.theme,
        apps: state.appStore.installedApps
    }
}

export default connect(
    mapStateToProps
)(AppStoreMenu)
