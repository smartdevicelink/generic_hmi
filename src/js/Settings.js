import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';

import sdlController from './Controllers/SDLController';
import AppHeader from './containers/Header';
import StaticIcon from './Templates/Shared/StaticIcon'
import {ReactComponent as IconCart} from '../img/icons/icon-cart.svg'
// import {ReactComponent as PermissionsIcon} from '../img/static/0x22.svg'
// import {ReactComponent as UpdateNeeded} from '../img/static/0xE5.svg'
import {ReactComponent as Updating} from '../img/icons/updating.svg'
import {ReactComponent as UpToDate} from '../img/icons/up_to_date.svg'
import {ReactComponent as IconArrowRight} from '../img/icons/icon-arrow-right.svg'

const staticIconId = {
    permissions: "0x22",
    updateNeeded: "0xE5",
    cart: "0x32"
};

const mapStateToProps = (state) => { 
    return { 
        isAppStoreConnected: state.appStore.isConnected,
        policyStatus: state.system.policyStatus,
        policyStatusMsg: state.system.policyStatusMsg
    };
};

class Settings extends React.Component {
    render() {
        var statusInfo = {};
        var settingsButtons = [
            <div className="hscrollmenu-block">
                <Link to="/permissionapplist">
                    <div
                        className="hscrollmenu-item th-b-color th-tile-background-color">
                        <div className="hscrollmenu-item__image">
                            <StaticIcon class="static-icon" image={staticIconId.permissions} />
                        </div>
                        <div className="hscrollmenu-item__name">
                            <p className="t-small t-light th-f-color">App Permissions</p>
                        </div>
                        <span className="hscrollmenu-item__arrow svg-wrap" > 
                            <IconArrowRight/>
                        </span>
                    </div>
                </Link>
            </div>

        ]

        if (this.props.isAppStoreConnected) {
            settingsButtons.push(
                <div className="hscrollmenu-block">
                    <Link to="/appstore">
                        <div
                            className="hscrollmenu-item th-b-color th-tile-background-color">
                            <div className="hscrollmenu-item__image">
                            <StaticIcon class="static-icon" image={staticIconId.cart} />
                            </div>
                            <div className="hscrollmenu-item__name">
                                <p className="t-small t-light th-f-color">App Store</p>
                            </div>
                            <span className="hscrollmenu-item__arrow svg-wrap" > 
                                <IconArrowRight/>
                            </span>
                        </div>
                    </Link>
                </div>
            );
        }

        if (this.props.policyStatus === "UPDATE_NEEDED") {
            statusInfo = {
                text: this.props.policyStatusMsg ? this.props.policyStatusMsg : "Update Needed",
                image: <StaticIcon class="static-icon" image={staticIconId.updateNeeded} />
            };
        } else if (this.props.policyStatus === "UPDATING") {
            statusInfo = {
                text: this.props.policyStatusMsg ? this.props.policyStatusMsg : "Updating",
                image: <Updating/>
            };
        } else if (this.props.policyStatus === "UP_TO_DATE") {
            statusInfo = {
                text: this.props.policyStatusMsg ? this.props.policyStatusMsg : "SDL Up To Date",
                image: <UpToDate/>
            };
        } else {
            statusInfo = {
                text: "Update SDL",
                image: <StaticIcon class="static-icon" image={staticIconId.updateNeeded} />
            };
        }

        settingsButtons.push(
            <div 
                className="hscrollmenu-block"
                onClick={() => {
                    sdlController.updateSDL();
                }}    
            >
                <div
                    className="hscrollmenu-item th-b-color th-tile-background-color">
                    <div className="hscrollmenu-item__image svg-wrap">
                        {statusInfo.image}
                    </div>
                    <div className="hscrollmenu-item__name">
                        <p className="t-small t-light th-f-color">{statusInfo.text}</p>
                    </div>
                </div>
            </div>
        )
        

        return (
            <div>
                <AppHeader backLink="/" menuName="Apps" icon="false" title="Settings"/>
                <div class="hscrollmenu">
                    {settingsButtons}
                </div>
            </div>
        )
    }
}

const SettingsView = connect(mapStateToProps)(Settings);
export default SettingsView;
