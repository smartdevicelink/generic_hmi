import React from 'react';
import HScrollMenuItem from './HScrollMenuItem'
import MenuFooter from './MenuFooter'

export default class HScrollMenu extends React.Component {
    constructor(props) {
        super(props);
        this.hiddenNames = [];
    }

    clearHiddenNames() {
        this.hiddenNames = [];
    }

    pushHiddenName(name) {
        this.hiddenNames.push(name)
    }

    render() {
        this.clearHiddenNames();
        let menuItems = this.props.data.map((menuItem) => {
            if (menuItem.hidden) {
                this.pushHiddenName(menuItem.name)
                return null;
            }
            return (<div className="hscrollmenu-block"
                key={menuItem.cmdID + menuItem.name}>
                    <HScrollMenuItem
                        appID={menuItem.appID}
                        cmdID={menuItem.cmdID}
                        menuID={menuItem.menuID}
                        menuItem={menuItem} 
                        onSelection={this.props.onSelection}/>
                </div>)
        });

        var hiddenCommands = null;
        if (this.hiddenNames.length) {
            hiddenCommands = <MenuFooter/>
        }

        return (
            <div className="hscrollmenu">
                { menuItems }
                { hiddenCommands }
            </div>
        )
    }
}
