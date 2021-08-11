import React from 'react';
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal'
import Alert from './Alert';
import SubtleAlert from './SubtleAlert';
import Slider from './Slider';
import PerformAudioPassThru from './PerformAudioPassThru';
import MenuIcon from './containers/MenuIcon';
import Name from './containers/Name';
import MenuLink from './containers/AppsButton'
import store from './store'
import {closePerformAudioPassThru, resetOpenPermissionsView, resetShowAppMenu} from './actions'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import uiController from './Controllers/UIController'
import ScrollableMessage from './ScrollableMessage';

import {ReactComponent as IconMenu} from '../img/icons/icon-menu.svg'
import {ReactComponent as IconCart} from '../img/icons/icon-cart.svg'
import {ReactComponent as PermissionsIcon} from '../img/static/0x49.svg'
import {ReactComponent as UpdateNeeded} from '../img/static/0xE5.svg'
import {ReactComponent as Updating} from '../img/icons/updating.svg'
import {ReactComponent as UpToDate} from '../img/icons/up_to_date.svg'
import {ReactComponent as TitleSeparator} from '../img/static/0xFF.svg'

class MenuReveal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapseInfo: true
        }
    }
    render() {
        var infoClassName = "info-open";
        var revealClassName = "reveal-open";
        var statusUpdate = <div></div>;
        var appStoreIcon = null;
        if (this.state.collapseInfo) {
            infoClassName = "info-closed";
            revealClassName = "reveal-closed";
        }

        if (this.props.statusUpdate === "UPDATE_NEEDED") {
            statusUpdate = <UpdateNeededIcon msg={this.props.statusUpdateMsg}/>;
        } else if (this.props.statusUpdate === "UPDATING") {
            statusUpdate = <UpdatingIcon msg={this.props.statusUpdateMsg}/>;
        } else if (this.props.statusUpdate === "UP_TO_DATE") {
            statusUpdate = <UptoDateIcon msg={this.props.statusUpdateMsg}/>;
        }


        if (this.props.isAppStoreConnected) {
            appStoreIcon = (
            <Link to="/appstore" className="mr-10">
                <div className="app-icon">
                    <div className="static-icon">
                        <div className="svg-wrap">
                            <IconCart/>
                        </div>
                    </div>
                </div>
            </Link>)
        }
        return (<div className="flex-row-center">
                <div className={"flex-row-center " + infoClassName}>
                    { statusUpdate }
                    <Link to="/permissionapplist" style={{ marginRight: 10, marginLeft: 'auto' }}>
                        <div className="app-icon">
                            <div className="static-icon">
                                <div className="svg-wrap">
                                    <PermissionsIcon/>
                                </div>
                            </div>
                        </div>
                    </Link>
                    { appStoreIcon }
                </div>
                <span 
                    className={"svg-wrap-secondary flex-jc-center " + revealClassName}
                    onClick={() => {
                        this.setState({
                            collapseInfo: !this.state.collapseInfo
                        })
                    }}>
                    <TitleSeparator/>
                </span>
            </div>);
    }
}

class AppStoreMenuIcon extends React.Component {
    render() {
        return (<div>
                <Link to="/appstoremenu">
                    <span className="svg-wrap">
                        <IconMenu/>
                    </span>
                </Link>
            </div>);
    }
}

class UpdateNeededIcon extends React.Component {
    render() {
        var msg = this.props.msg ? this.props.msg : "Policy Update Needed";
        return (<div>
                    <span className="svg-wrap status-icon mr-10">
                        <UpdateNeeded/>
                        <span class="tooltiptext">{msg}</span>
                    </span>
            </div>);
    }
}

class UpdatingIcon extends React.Component {
    render() {
        var msg = this.props.msg ? this.props.msg : "Policy Update In Progress";
        return (<div>
                    <span className="svg-wrap status-icon mr-10">
                        <Updating/>
                        <span class="tooltiptext">{msg}</span>
                    </span>
            </div>);
    }
}

class UptoDateIcon extends React.Component {
    render() {
        var msg = this.props.msg ? this.props.msg : "Policy Table Updated";
        return (<div>
                    <span className="svg-wrap status-icon mr-10">
                        <UpToDate/>
                        <span class="tooltiptext">{msg}</span>
                    </span>
            </div>);
    }
}

class AppHeader extends React.Component {

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.closeSlider = this.closeSlider.bind(this);
        this.closeScrollable = this.closeScrollable.bind(this);
    }

    closeModal() {
        if (this.props.alertIsSubtle) {
            this.props.showAlert = false;
            this.forceUpdate();
            uiController.onDefaultAction({ msgID: this.props.alertMsgId, appID: this.props.alertAppId }, this.props.activeApp, true);
        }
    }

    closeSlider(options) {
        let closeReason = options?.closeReason ?? "ABORTED"
        uiController.onSliderClose(this.props.sliderData.msgID, this.props.sliderAppId, this.props.activeApp, closeReason);
    }

    closeScrollable() {
        uiController.onCloseScrollableMessage(this.props.scrollableMessageMsgId,
            this.props.scrollableMessageAppId, this.props.activeApp);
    }

    closeAudioPassThru(result) {
        uiController.onClosePerformAudioPassThru(
            this.props.aptMsgID, 
            this.props.aptAppID, 
            this.props.activeApp,
            result
        );
    }

    getColorScheme() {
        if (this.props.colorScheme) {
            var redInt = this.props.colorScheme.red;
            var blueInt = this.props.colorScheme.blue;
            var greenInt = this.props.colorScheme.green;
            var cssColorScheme = {
                backgroundColor: `rgb(${redInt}, ${greenInt}, ${blueInt})`,
                backgroundImage: `none`
            }
            return cssColorScheme;
        } else {
            return null;
        }
    }

    render() {
        const themeClass = this.props.theme ? 'dark-theme' : 'light-theme';
        var modalClass = themeClass + " " + (this.props.alertIsSubtle ? "subtleAlertOverlay" : "alertOverlay");
        var isShowingMenu = this.props.location.pathname === '/inappmenu';
        var isShowingSubMenu = this.props.location.pathname === '/inapplist';
        var icon = this.props.icon === 'false' ? (<div />) 
            : <MenuIcon 
                isShowingMenu={isShowingMenu || isShowingSubMenu}
                activeSubMenu={this.props.activeSubMenu ? true : false} /> ;

        if (this.props.icon === 'store') {
            icon = this.props.location.pathname === '/appstore' ? (<AppStoreMenuIcon />) : (
                <MenuReveal 
                    statusUpdate={this.props.statusUpdate} 
                    statusUpdateMsg={this.props.statusUpdateMsg}
                    isAppStoreConnected={this.props.isAppStoreConnected}
                />
            );
        } else if (this.props.icon === 'custom') {
            icon = this.props.jsxIcon;
        }

        var colorScheme = null;
        colorScheme = this.getColorScheme();

        var alertHtml = this.props.alertIsSubtle
                            ? (<SubtleAlert alertName={this.props.alertName} icon={this.props.alertIcon} theme={this.props.theme}/>)
                            : (<Alert alertName={this.props.alertName} icon={this.props.alertIcon} theme={this.props.theme}/>);

        // Determine backLink for special case when showing submenu
        var backLink = this.props.backLink;
        if (this.props.activeSubMenu) {
            backLink = (this.props.activeMenuDepth > 1) ? "/inapplist" : "/inappmenu";
        } else if (isShowingMenu) {
            backLink = this.props.activeLayout;
        }


        return (
            <div className="app__header" style={colorScheme}>
                <MenuLink menuName={this.props.menuName} backLink={backLink} parentID={this.props.parentID}/>
                <Name />
                { icon }
                <Modal
                isOpen={this.props.showAlert}
                className={`app-body ${this.props.alertIsSubtle ? 'subtleAlertModal' : 'alertModal'}`}
                overlayClassName={modalClass}
                contentLabel="Example Modal"
                onRequestClose={this.closeModal}
                >
                    {alertHtml}
                </Modal>
                <Modal
                isOpen={this.props.showSlider}
                className={`app-body sliderModal`}
                overlayClassName={`${themeClass} sliderOverlay`}
                contentLabel="Slider Modal"
                onRequestClose={this.closeSlider}
                >
                    <Slider 
                        sliderName={this.props.sliderName} 
                        sliderAppId={this.props.sliderAppId} 
                        sliderData={this.props.sliderData}
                        submitCallback={ () => { this.closeSlider({closeReason: "SUBMIT"}) } }
                        theme={this.props.theme}
                    />
                </Modal>
                <Modal
                isOpen={this.props.showScrollableMessage}
                className={'app-body scrollableMessageModal'}
                overlayClassName={`${themeClass} scrollableMessageOverlay`}
                contentLabel="Example Modal"
                onRequestClose={this.closeScrollable}
                >
                    <ScrollableMessage theme={this.props.theme}
                        body={this.props.scrollableMessageBody}
                        buttons={this.props.softButtons}
                        appName={this.props.scrollableMessageAppName}/>
                </Modal>
                <Modal
                isOpen={this.props.showPerformAudioPassThru}
                className={'app-body alertModal'}
                overlayClassName={`${themeClass} alertOverlay`}
                contentLabel="Example Modal"
                onRequestClose={() => {
                    this.closeAudioPassThru("ABORTED")
                }}
                >
                    <PerformAudioPassThru
                        theme={this.props.theme}
                        textFields={this.props.aptTextFields}
                        appName={this.props.aptAppName}
                        resultCallback={(result) => {
                            this.closeAudioPassThru(result)
                        }}
                    />
                </Modal>
            </div>
            
        )
    }
    componentWillReceiveProps (nextProps) {
        // TODO: this will not allow performInteraction while browsing a submenu
        // not sure if that's okay
        if (!this.props.isDisconnected 
            && nextProps.isDisconnected 
            && nextProps.location.pathname !== "/" 
            && nextProps.location.pathname !== "/appstore" 
            && nextProps.location.pathname !== "/appstoremenu") {
            this.props.history.push("/")
        }
        else if (nextProps.location.pathname !== "/keyboard"
            && nextProps.isPerformingInteraction && nextProps.interactionLayout === "KEYBOARD") {
                this.props.history.push("/keyboard")
        }
        else if (nextProps.location.pathname !== "/inapplist" && nextProps.interactionLayout !== "KEYBOARD"
            && nextProps.isPerformingInteraction) {
                this.props.history.push("/inapplist")
        }
        // We are in the app list and previously performing interaction but not anymore. This means time to switch out
        // this happens currently when the perform interaction times out, the prop isPerformingInteraction goes to false
        else if ((nextProps.location.pathname === "/inapplist" || nextProps.location.pathname === "/keyboard")
            && this.props.isPerformingInteraction
            && !nextProps.isPerformingInteraction) {
                this.props.history.push("/" + nextProps.displayLayout)                
        }
        else if (this.props.displayLayout !== nextProps.displayLayout) {
            if(nextProps.activeApp) {
                this.props.history.push("/" + nextProps.displayLayout)                
            }
        }
        else if(this.props.activeApp !== nextProps.activeApp) {            
            if(!this.props.activeApp && nextProps.activeApp) {
                this.props.history.push("/" + nextProps.displayLayout)
            }
        }
        else if(nextProps.triggerShowAppMenu){
            if(nextProps.activeSubMenu){
                // If menuID is specified, activate that sub menu
                if(this.props.location.pathname !== "/inapplist"){
                    this.props.history.push('/inapplist')    
                }
            }
            else{
                // If NO menuID is specifed, show menu 
                if(this.props.location.pathname !== "/inappmenu"){
                    this.props.history.push('/inappmenu')    
                }    
            }
            store.dispatch(resetShowAppMenu(nextProps.activeApp))
        } else if (nextProps.openPermissionsView) {
            store.dispatch(resetOpenPermissionsView());
            this.props.history.push('/apppermissions');
        }

    }
}

const mapStateToProps = (state) => {
    return {
        isAppStoreConnected: state.appStore.isConnected
    }
}
AppHeader = connect(mapStateToProps)(AppHeader)

export default withRouter(AppHeader)
