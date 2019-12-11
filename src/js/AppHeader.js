import React from 'react';
import { Link, withRouter } from 'react-router';
import Modal from 'react-modal'
import Alert from './Alert';
import MenuIcon from './containers/MenuIcon';
import Name from './containers/Name';
import MenuLink from './containers/AppsButton'
import store from './store'
import {resetShowAppMenu} from './actions'
import {UseDarkText} from './calculate_text_color';



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
            if (UseDarkText(this.props.colorScheme) && this.props.theme === true) {
                cssColorScheme = {
                    backgroundColor: `rgb(${redInt}, ${greenInt}, ${blueInt})`,
                    backgroundImage: `none`,
                    color: '#000000'
                }
            }
            return cssColorScheme;
        } else {
            return null;
        }
    }

    render() {
        const themeClass = this.props.theme ? 'dark-theme' : 'light-theme';
        var modalClass = themeClass + " alertOverlay"
        var isShowingMenu = this.props.router.isActive('/inappmenu')

        var colorScheme = null;
        colorScheme = this.getColorScheme();

        if (this.props.router.isActive('/media-custom-pi')
            || this.props.router.isActive('/media-custom-menu')) {
            return null;
        }

        const icon = this.props.appIcon == 'false' ? (<div />) : <MenuIcon isShowingMenu={isShowingMenu} style={colorScheme}/> ;

        return (
            <div className="app__header" style={colorScheme}>
                <MenuLink menuName={this.props.menuName} backLink={this.props.backLink} style={colorScheme}/>
                <Name style={colorScheme}/>
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
        if (nextProps.isDisconnected) {
            this.props.router.push("/")
        }
        else if (!nextProps.router.isActive("/inapplist")
            && nextProps.isPerformingInteraction
            && !nextProps.router.isActive("/media-custom-pi")) {
                this.props.router.push(this.props.router.isActive("/media-custom") ? "/media-custom-pi" : "/inapplist")
        }
        // We are in the app list and previously performing interaction but not anymore. This means time to switch out
        // this happens currently when the perform interaction times out, the prop isPerformingInteraction goes to false
        else if ((nextProps.router.isActive("/inapplist") || nextProps.router.isActive("/media-custom-pi"))
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
                    this.props.router.push(this.props.router.isActive("/media-custom") ? "/media-custom-menu" : "/inapplist");
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