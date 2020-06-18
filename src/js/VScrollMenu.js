import React from 'react';

import VScrollMenuItem from './VScrollMenuItem';
import MenuFooter from './MenuFooter'

export default class VScrollMenu extends React.Component {
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
            return (<div key={menuItem.cmdID + menuItem.name}>
                        <VScrollMenuItem
                            appID={menuItem.appID}
                            cmdID={menuItem.cmdID}
                            menuID={menuItem.menuID}
                            menuItem={menuItem} 
                            isPerformingInteraction={this.props.isPerformingInteraction}
                            interactionId={this.props.interactionId ? this.props.interactionId : 0}
                            onSelection={this.props.onSelection}
                            image={menuItem.image}
                            imageType={menuItem.imageType}
                            isTemplate={menuItem.isTemplate}
                            theme={this.props.theme}
                            enabled={menuItem.enabled}
                        />
                    </div>)
        });

        var hiddenCommands = null;
        if (this.hiddenNames.length) {
            hiddenCommands = <MenuFooter/>
        }

        return (
            <div className="vscrollmenu">
                { menuItems }
                { hiddenCommands }
            </div>
        )
    }
}
