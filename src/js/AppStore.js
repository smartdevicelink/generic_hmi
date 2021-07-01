import React from 'react';
import Modal from 'react-modal'
import { connect } from 'react-redux';
import store from './store';

import AppHeader from './containers/Header';
import HScrollMenu from './HScrollMenu';
import AppServices from './containers/AppServices';
import ConfirmAlert from './ConfirmAlert';

import BCController from './Controllers/BCController';
import FileSystemController from './Controllers/FileSystemController'

import { updateAvailableAppStoreApps, addAppPendingSetAppProperties, appStoreBeginInstall } from './actions';

class AppStore extends React.Component {
    constructor() {
        super();

        this.state = {
            confirmID: null,
            confirmApp: null
        }

        this.onSelection = this.onSelection.bind(this);
    }

    cancelInstall() {
        this.setState((state, props) => {
            return {
                confirmID: null,
                confirmApp: null
            }
        });
    }

    confirmInstall() {
        FileSystemController.subscribeToEvent('InstallApp', (success, params) => {
            if (!success || !params.appUrl) {
                console.error('error encountered when installing app');
            }

            FileSystemController.parseWebEngineAppManifest(params.appUrl).then((manifest) => {
                var appProperties = {
                    policyAppID: manifest.appId,
                    enabled: true
                }

                let state = store.getState();
                var appDirEntry = state.appStore.availableApps.find(x => x.policyAppID === manifest.appId);

                if (!appDirEntry) {
                    console.error('no app found in app store directory with policyAppID ', manifest.appId);
                    return;
                }

                store.dispatch(addAppPendingSetAppProperties(Object.assign(appDirEntry, { 
                    policyAppID: manifest.appId,
                    version: manifest.appVersion,
                    entrypoint: manifest.entrypoint,
                    appUrl: params.appUrl
                }), true));

                let addIfExists = (key) => {
                    if (appDirEntry[key]) {
                        appProperties[key] = appDirEntry[key];
                    }
                }

                addIfExists('nicknames');
                addIfExists('authToken');
                addIfExists('transportType');
                addIfExists('hybridAppPreference');

                BCController.setAppProperties(appProperties);
            });
        });

        store.dispatch(appStoreBeginInstall(this.state.confirmID))
        FileSystemController.sendJSONMessage({
            method: 'InstallApp',
            params: {
                policyAppID: this.state.confirmID,
                packageUrl: this.state.confirmApp.package.url
            }
        });

        this.setState((state, props) => {
            return {
                confirmID: null,
                confirmApp: null
            }
        });
    }

    onSelection(appID) {
        this.setState((state, props) => {
            return {
                confirmID: appID,
                confirmApp: props.apps.find(app => { return app.policyAppID === appID; })
            }
        })
    }

    componentDidMount() {
        fetch(window.flags.AppStoreDirectoryUrl).then((res) => {
            if (!res.ok) {
                console.error('could not contact app store server');
                return [];
            }

            return res.json();
        }).then((json) => {
            var apps = [];
            if (json.data && json.data.applications) {
                apps = json.data.applications
            } else {
                apps = json
            }
            store.dispatch(updateAvailableAppStoreApps(apps.map((app) => {
                if ('icon_url' in app) {
                    app.iconUrl = app.icon_url;
                    delete app.icon_url;
                }
                return app;
            })));
        });
    }

    render() {
        const themeClass = this.props.theme ? 'dark-theme' : 'light-theme';
        var modalClass = themeClass + " alertOverlay"

        var pendingInstallApp = this.state.confirmApp ? this.state.confirmApp : {
            name: null,
            description: null,
            iconUrl: null
        };

        var menuData = this.props.apps.map((app) => {
            return {
                    image: app.iconUrl,
                    appID: app.policyAppID,
                    cmdID: app.package.url,
                    name: app.pendingInstall ? `Installing...` : app.name,
                    greyOut: app.installed
                }
            });

        return (
            <div>
                <Modal
                isOpen={!!this.state.confirmID}
                className="alertModal app-body"
                overlayClassName={modalClass}
                contentLabel="Example Modal">
                    <ConfirmAlert appID={this.state.confirmID} name={pendingInstallApp.name}
                        description={pendingInstallApp.description} iconUrl={pendingInstallApp.iconUrl}
                        leftText="Cancel" leftCallback={() => this.cancelInstall()} rightText="Download" rightCallback={() => this.confirmInstall()} />
                </Modal>
                <AppHeader icon='store' backLink="" />
                {<HScrollMenu data={menuData}
                        theme={this.props.theme}
                        onSelection={this.onSelection}
                        isPerformingInteraction={false} />}
                <AppServices />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    var props = {
        theme: state.theme,
        apps: state.appStore.availableApps
    }

    props.apps = props.apps.map((app) => {
        app.installed = !!state.appStore.installedApps.find((iApp) => {
            return app.policyAppID === iApp.policyAppID;
        });
        return app;
    });

    return props;
}

export default connect(
    mapStateToProps
)(AppStore)
