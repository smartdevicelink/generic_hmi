import React from 'react';
import { Link, withRouter } from 'react-router';
import Modal from 'react-modal'
import Alert from './Alert';
import MenuIcon from './containers/MenuIcon';
import Name from './containers/Name';
import MenuLink from './containers/AppsButton'





class AppHeader extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        const themeClass = this.props.theme ? 'dark-theme' : 'light-theme';
        var modalClass = themeClass + " alertOverlay"
        var isShowingMenu = this.props.router.isActive('/inappmenu')
        const icon = this.props.appIcon == 'false' ? (<div />) : <MenuIcon isShowingMenu={isShowingMenu}/> ;
        return (
            <div className="app__header">
                <MenuLink menuName={this.props.menuName} backLink={this.props.backLink}/>
                <Name />
                { icon }
                <Modal
                isOpen={this.props.showAlert}
                className="alertModal app-body"
                overlayClassName={modalClass}
                contentLabel="Example Modal"
                >
                    <Alert alertName={this.props.alertName}/>
                </Modal>
            </div>
            
        )
    }
    componentWillReceiveProps (nextProps) {
        // TODO: this will not allow performInteraction while browsing a submenu
        // not sure if that's okay
        console.log("Components will receive props");
        if (nextProps.isDisconnected) {
            console.log("pushing /")
            this.props.router.push("/")
        }
        else if (!nextProps.router.isActive("/inapplist")
            && nextProps.isPerformingInteraction) {
                console.log("pushing /inapplist")
                this.props.router.push("/inapplist")
        }
        // We are in the app list and previously performing interaction but not anymore. This means time to switch out
        // this happens currently when the perform interaction times out, the prop isPerformingInteraction goes to false
        else if (nextProps.router.isActive("/inapplist")
            && this.props.isPerformingInteraction
            && !nextProps.isPerformingInteraction) {
                console.log("pushing /media")
                // TODO: probably go back instead of pushing media - needs investigation
                this.props.router.push("/media")
        }
        else if (this.props.displayLayout != nextProps.displayLayout) {
            if(nextProps.activeApp) {
                console.log("pushing newlayout /" + nextProps.displayLayout)
                this.props.router.push("/" + nextProps.displayLayout)
            }
        }
        
        else if(this.props.activeApp != nextProps.activeApp) {            
            if(!this.props.activeApp && nextProps.activeApp) {
                console.log("active app! push /" +nextProps.displayLayout)
                this.props.router.push("/" + nextProps.displayLayout)
            }
        }

    }
}

export default withRouter(AppHeader)