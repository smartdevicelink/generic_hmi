import React from 'react';

import { Link } from 'react-router-dom'
import { slide as Menu } from 'react-burger-menu';

import { ReactComponent as IconHome } from '../img/static/0x55.svg'
import { ReactComponent as IconCart } from '../img/icons/icon-cart.svg'
import { ReactComponent as IconVR } from '../img/static/0xE8.svg'
import { ReactComponent as PermissionsIcon } from '../img/static/0x49.svg'

export default class ScreenMenu extends React.Component {
    render() {
        return (
            <div>
                <Menu left width={ '350px' } outerContainerId={ "main-body" } >
                    <Link to="/">
                        <div className="menu-item">
                            <div className="menu-icon">
                                <div className="static-icon">
                                    <span className="svg-wrap">
                                        <IconHome/>
                                    </span>
                                </div>
                            </div>
                            <p className="t-small t-light th-f-color">Home</p>
                        </div>
                    </Link>
                    <Link to="/appstore">
                        <div className="menu-item">
                            <div className="menu-icon">
                                <div className="static-icon">
                                    <span className="svg-wrap">
                                        <IconCart/>
                                    </span>
                                </div>
                            </div>
                            <p className="t-small t-light th-f-color">App Store</p>
                        </div>
                    </Link>
                    <Link to="/permissionapplist" style={{ marginRight: 10, marginLeft: 'auto' }}>
                        <div className="menu-item">
                            <div className="app-icon">
                                <div className="static-icon">
                                    <div className="svg-wrap">
                                        <PermissionsIcon/>
                                    </div>
                                </div>
                            </div>
                            <p className="t-small t-light th-f-color">App Permissions</p>
                        </div>
                    </Link>
                    {window.flags.VRPlugin.MenuEnabled && <Link to="/vr">
                        <div className="menu-item">
                            <div className="menu-icon">
                                <div className="static-icon">
                                    <span className="svg-wrap">
                                        <IconVR/>
                                    </span>
                                </div>
                            </div>
                            <p className="t-small t-light th-f-color">
                                {window.flags.VRPlugin.MenuName ? window.flags.VRPlugin.MenuName : "Voice Recognition"}
                            </p>
                        </div>
                    </Link>}
                </Menu>
            </div>
        );
    }
}