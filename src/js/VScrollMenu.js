import React from 'react';

import VScrollMenuItem from './VScrollMenuItem';

export default class VScrollMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let menuItems = this.props.data.map((menuItem) => {
            return (<div key={menuItem.cmdID + menuItem.name}>
                        <VScrollMenuItem
                            appID={menuItem.appID}
                            cmdID={menuItem.cmdID}
                            menuID={menuItem.menuID}
                            menuItem={menuItem} 
                            isPerformingInteraction={this.props.isPerformingInteraction}
                            interactionId={this.props.interactionId ? this.props.interactionId : 0}
                            onSelection={this.props.onSelection}/>
                    </div>)
        })
        return (
            <div className="vscrollmenu">
                { menuItems }
            </div>
        )
    }
}
