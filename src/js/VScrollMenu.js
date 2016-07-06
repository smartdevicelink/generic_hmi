import React from 'react';

import VScrollMenuItem from './VScrollMenuItem';

export default class VScrollMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log('VScrollMenu props', this.props)
        let menuItems = this.props.data.map((menuItem) => {
            return (<div key={menuItem.cmdID + menuItem.name}>
                        <VScrollMenuItem
                            appID={menuItem.appID}
                            cmdID={menuItem.cmdID}
                            menuItem={menuItem} 
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
