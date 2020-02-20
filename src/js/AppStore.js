import React from 'react';
import Modal from 'react-modal'
import { connect } from 'react-redux';
import store from './store';

import AppHeader from './containers/Header';
import HScrollMenu from './HScrollMenu';
import AppServices from './containers/AppServices';
import ConfirmAlert from './ConfirmAlert';

import BCController from './Controllers/BCController';
import fileSystemController from './Controllers/FileSystemController'

import { updateAvailableAppStoreApps, updateInstalledAppStoreApps, appStoreAppInstalled } from './actions';

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
        console.log(`chose not to install app ${this.state.confirmID}`);

        this.setState((state, props) => {
            return {
                confirmID: null,
                confirmApp: null
            }
        });
    }

    confirm() {
        console.log(`installing app ${this.state.confirmID}`);

        fileSystemController.subscribeToEvent('InstallApp', (success, params) => {
            if (!success || !params.appUrl) {
                console.error('error encountered when installing app');
            }

            console.log('received app params: ', params);

            fetch(params.appUrl + 'manifest.js')
                .then(x => x.blob())
                .then(x => x.text())
                .then((manifestJS) => {
                let jsonStart = manifestJS.indexOf('{');
                let jsonEnd = manifestJS.lastIndexOf('}') + 1;
                let manifest = JSON.parse(manifestJS.substring(jsonStart, jsonEnd))

                console.log('parsed manifest: ', manifest);

                store.dispatch(appStoreAppInstalled({ 
                    policyAppID: manifest.appId,
                    version: manifest.appVersion,
                    baseURL: params.appUrl
                }));
                
                var appProperties = {
                    policyAppID: manifest.appId,
                    enabled: true
                }

                let state = store.getState();
                var appDirEntry = state.appStore.availableApps.find(x => x.policyAppID == manifest.appId);

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
        console.log(`AppStore onSelection(${appID})`);

        this.setState((state, props) => {
            return {
                confirmID: appID,
                confirmApp: props.apps.find(app => { return app.policyAppID === appID; })
            }
        })
    }

    componentDidMount() {
        fetch('https://sdl-webengine-app-store-example.s3.amazonaws.com/app-directory.json').then((res) => {
            if (!res.ok) {
                console.error('could not contact app store server');
                return [];
            }

            return res.json();
        }).then((json) => {
            console.log('retrieved available apps: ', json);
            store.dispatch(updateAvailableAppStoreApps(json));
        });

        fileSystemController.subscribeToEvent('GetInstalledApps', (success, params) => {
            if (!success || !params.apps) {
                console.error('error encountered when retrieving installed apps');
                return;
            }

            console.log('updating installed apps: ', params.apps);
            store.dispatch(updateInstalledAppStoreApps(params.apps))
        });

        fileSystemController.sendJSONMessage({
            method: 'GetInstalledApps', params: {}
        });
    }

    render() {
        const themeClass = this.props.theme ? 'dark-theme' : 'light-theme';
        var modalClass = themeClass + " alertOverlay"

        var pendingInstallApp = this.state.confirmApp ? this.state.confirmApp : {
            name: null,
            description: null,
            icon_url: null
        };

        return (
            <div>
                <Modal
                isOpen={!!this.state.confirmID}
                className="alertModal app-body"
                overlayClassName={modalClass}
                contentLabel="Example Modal">
                    <ConfirmAlert appID={this.state.confirmID} name={pendingInstallApp.name}
                        description={pendingInstallApp.description} icon_url={pendingInstallApp.icon_url}
                        leftText="Cancel" leftCallback={this.cancel} rightText="Download" rightCallback={this.confirm} />
                </Modal>
                <AppHeader appIcon='store' backLink="/" menuName="APPS"/>
                {this.props.apps ? <HScrollMenu data={this.props.apps.map((app) => {
                        return {
                                image: app.icon_url,
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