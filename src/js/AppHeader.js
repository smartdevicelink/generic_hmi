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
        const icon = this.props.appIcon == 'false' ? (<div />) : <MenuIcon /> ;
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
        //console.log(this.props)
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
                // TODO: probably go back instead of pushing media - needs investigation
                this.props.router.push("/media")
        }
        else if (this.props.displayLayout != nextProps.displayLayout) {
            this.props.router.push("/" + nextProps.displayLayout)
        }

        if(nextProps.showAlert) {
            //this.props.router.push("/alert")
        }
        else if (this.props.showAlert && !nextProps.showAlert) {
            //this.props.router.goBack()

        }
    }
}

export default withRouter(AppHeader)