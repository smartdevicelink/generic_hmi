import React from 'react';
import { Link, withRouter } from 'react-router';
import Modal from 'react-modal'
import Alert from './Alert';
import MenuIcon from './containers/MenuIcon';
import Name from './containers/Name';
import MenuLink from './containers/AppsButton'
import store from './store'
import {resetShowAppMenu} from './actions'



class AppHeader extends React.Component {
    constructor(props) {
        super(props);

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
        var modalClass = themeClass + " alertOverlay";
        var isShowingMenu = this.props.router.isActive('/inappmenu');
        var isShowingSubMenu = this.props.router.isActive('/inapplist');
        
        const icon = this.props.appIcon == 'false' ? (<div />) 
            : <MenuIcon isShowingMenu={isShowingMenu || isShowingSubMenu} 
                        activeSubMenu={this.props.activeSubMenu ? true : false}/> ;

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
                    <Alert alertName={this.props.alertName} icon={this.props.alertIcon}/>
                </Modal>
            </div>
            
        )
    }
    componentWillReceiveProps (nextProps) {
        // TODO: this will not allow performInteraction while browsing a submenu
        // not sure if that's okay
        if (nextProps.isDisconnected) {
            this.props.router.push("/")
        }
        else if (!nextProps.router.isActive("/inapplist")
            && nextProps.isPerformingInteraction) {
                this.props.router.push("/inapplist")
        }
        // We are in the app list and previously performing interaction but not anymore. This means time to switch out
        // this happens currently when the perform interaction times out, the prop isPerformingInteraction goes to false
        else if (nextProps.router.isActive("/inapplist")
            && this.props.isPerformingInteraction
            && !nextProps.isPerformingInteraction) {
                this.props.router.push("/" + nextProps.displayLayout)
        }
        else if (this.props.displayLayout != nextProps.displayLayout) {
            if(nextProps.activeApp) {
                this.props.router.push("/" + nextProps.displayLayout)
            }
        }
   
        else if(this.props.activeApp != nextProps.activeApp) {            
            if(!this.props.activeApp && nextProps.activeApp) {
                this.props.router.push("/" + nextProps.displayLayout)
            }
        }
        else if(nextProps.triggerShowAppMenu){
            if(nextProps.activeSubMenu){
                // If menuID is specified, activate that sub menu
                if(!this.props.router.isActive("/inapplist")){
                    this.props.router.push('/inapplist')    
                }
            }
            else{
                // If NO menuID is specifed, show menu 
                if(!this.props.router.isActive("/inappmenu")){
                    this.props.router.push('/inappmenu')    
                }    
            }
            store.dispatch(resetShowAppMenu(nextProps.activeApp))
        }

    }
}

export default withRouter(AppHeader)