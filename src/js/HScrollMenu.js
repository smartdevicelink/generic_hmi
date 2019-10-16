import React from 'react';
import HScrollMenuItem from './HScrollMenuItem'

export default class HScrollMenu extends React.Component {

    render() {
        let menuItems = this.props.data.map((menuItem) => {
            return (<div className="hscrollmenu-block"
                key={menuItem.cmdID + menuItem.name}>
                    <HScrollMenuItem
                        appID={menuItem.appID}
                        cmdID={menuItem.cmdID}
                        menuID={menuItem.menuID}
                        menuItem={menuItem} 
                        onSelection={this.props.onSelection}/>
                </div>)
        })
        return (
            <div className="hscrollmenu">
                { menuItems }
            </div>
        )
    }
}
