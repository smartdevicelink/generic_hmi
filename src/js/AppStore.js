import React from 'react';
import Modal from 'react-modal'
import { connect } from 'react-redux';
import store from './store';
import { flags } from './Flags'

import AppHeader from './containers/Header';
import HScrollMenu from './HScrollMenu';
import AppServices from './containers/AppServices';
import ConfirmAlert from './ConfirmAlert';

import BCController from './Controllers/BCController';
import fileSystemController from './Controllers/FileSystemController'

import { updateAvailableAppStoreApps, addAppPendingSetAppProperties } from './actions';

class AppStore extends React.Component {
    constructor() {
        super();

        this.state = {
            confirmID: null,
            confirmApp: null
        }

        this.cancel = this.cancel.bind(this);
        this.confirm = this.confirm.bind(this);
        this.onSelection = this.onSelection.bind(this);
    }

    cancel() {
        this.setState((state, props) => {
            return {
                confirmID: null,
                confirmApp: null
            }
        });
    }

    confirm() {
        fileSystemController.subscribeToEvent('InstallApp', (success, params) => {
            if (!success || !params.appUrl) {
                console.error('error encountered when installing app');
            }

            fetch(params.appUrl + 'manifest.js')
                .then(x => x.text())
                .then((manifestJS) => {
                let jsonStart = manifestJS.indexOf('{');
                let jsonEnd = manifestJS.lastIndexOf('}') + 1;
                var manifest = {};

                try {
                    manifest = JSON.parse(manifestJS.substring(jsonStart, jsonEnd));
                } catch (e) {
                    console.error('failed to parse manifest as JSON: ', e);
                    return;
                }

                var appProperties = {
                    policyAppID: manifest.appId,
                    enabled: true
                }

                let state = store.getState();
                var appDirEntry = state.appStore.availableApps.find(x => x.policyAppID == manifest.appId);

                if (!appDirEntry) {
                    console.error('no app found in app store directory with policyAppID ', manifest.appId);
                    return;
                }

                store.dispatch(addAppPendingSetAppProperties(Object.assign(appDirEntry, { 
                    policyAppID: manifest.appId,
                    version: manifest.appVersion,
                    baseUrl: params.appUrl
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

        fileSystemController.sendJSONMessage({
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
        fetch(flags.AppStoreDirectoryUrl).then((res) => {
            if (!res.ok) {
                console.error('could not contact app store server');
                return [];
            }

            return res.json();
        }).then((json) => {
            store.dispatch(updateAvailableAppStoreApps(json.map((app) => {
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

        return (
            <div>
                <Modal
                isOpen={!!this.state.confirmID}
                className="alertModal app-body"
                overlayClassName={modalClass}
                contentLabel="Example Modal">
                    <ConfirmAlert appID={this.state.confirmID} name={pendingInstallApp.name}
                        description={pendingInstallApp.description} iconUrl={pendingInstallApp.iconUrl}
                        leftText="Cancel" leftCallback={this.cancel} rightText="Download" rightCallback={this.confirm} />
                </Modal>
                <AppHeader icon='store' backLink="/" menuName="APPS"/>
                {this.props.apps ? <HScrollMenu data={this.props.apps.map((app) => {
                        return {
                                image: app.iconUrl,
                                appID: app.policyAppID,
                                cmdID: app.package_url,
                                name: app.name
                            }
                        })}
                        theme={this.props.theme}
                        onSelection={this.onSelection}
                        isPerformingInteraction={false} /> : null}
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

    if (state.appStore.installedApps && state.appStore.availableApps) {
        props.apps = props.apps.filter((app) => {
            return !state.appStore.installedApps.find((iApp) => {
                return app.policyAppID === iApp.policyAppID;
            });
        });
    }

    return props;
}

export default connect(
    mapStateToProps
)(AppStore)