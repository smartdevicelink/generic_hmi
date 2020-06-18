import React from 'react';
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal'
import Alert from './Alert';
import MenuIcon from './containers/MenuIcon';
import Name from './containers/Name';
import MenuLink from './containers/AppsButton'
import store from './store'
import {resetShowAppMenu} from './actions'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';

import {ReactComponent as IconMenu} from '../img/icons/icon-menu.svg'
import {ReactComponent as IconCart} from '../img/icons/icon-cart.svg'

class AppStoreIcon extends React.Component {
    render() {
        return (<div>
                <Link to="/appstore">
                    <div className="app-icon">
                        <div className="static-icon">
                            <span className="svg-wrap">
                                <IconCart/>
                            </span>
                        </div>
                    </div>
                </Link>
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

class AppHeader extends React.Component {

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
        var modalClass = themeClass + " alertOverlay"
        var isShowingMenu = this.props.location.pathname === '/inappmenu';
        var icon = this.props.icon === 'false' ? (<div />) 
            : <MenuIcon 
                isShowingMenu={isShowingMenu}
                activeSubMenu={this.props.activeSubMenu ? true : false} /> ;

        if (this.props.icon === 'store') {
            if (this.props.isAppStoreConnected) {
                icon = this.props.location.pathname === '/appstore' ? (<AppStoreMenuIcon />) : (<AppStoreIcon />);
            }
            else{
                icon = (<div />)
            }
        }

        var colorScheme = null;
        colorScheme = this.getColorScheme();

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
                className="alertModal app-body"
                overlayClassName={modalClass}
                contentLabel="Example Modal"
                >
                    <Alert alertName={this.props.alertName} icon={this.props.alertIcon} theme={this.props.theme}/>
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
        else if (nextProps.location.pathname !== "/inapplist"
            && nextProps.isPerformingInteraction) {
                this.props.history.push("/inapplist")
        }
        // We are in the app list and previously performing interaction but not anymore. This means time to switch out
        // this happens currently when the perform interaction times out, the prop isPerformingInteraction goes to false
        else if (nextProps.location.pathname === "/inapplist"
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