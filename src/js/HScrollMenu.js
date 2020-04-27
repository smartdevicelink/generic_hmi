import React from 'react';
import store from './store'
import { setPendingAppLaunch } from './actions'
import HScrollMenuItem from './HScrollMenuItem'

export default class HScrollMenu extends React.Component {
    constructor(props) {
        super(props);
        this.onSelection = this.onSelection.bind(this);
    }

    onSelection(appID, cmdID, menuID) {
        if (this.props.pendingAppLaunch) {
            return;
        }

        this.props.onSelection(appID, cmdID, menuID);
        store.dispatch(setPendingAppLaunch(appID));
    }

    render() {
        let menuItems = this.props.data.map((menuItem) => {
            if (menuItem.appID === this.props.pendingAppLaunch) {
                menuItem.name = 'Loading...';
                menuItem.greyOut = true;
            }

            return (<div className="hscrollmenu-block"
                key={menuItem.cmdID + menuItem.name}>
                    <HScrollMenuItem
                        menuItem={menuItem}
                        theme={this.props.theme}
                        onSelection={this.onSelection}/>
                </div>)
        })
        return (
            <div className="hscrollmenu">
                { menuItems }
            </div>
        )
    }
}
