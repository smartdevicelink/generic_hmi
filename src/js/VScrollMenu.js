import React from 'react';

import VScrollMenuItem from './VScrollMenuItem';
import {UseDarkText} from './calculate_text_color';
export default class VScrollMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    getColorScheme() {
        var activeApp = this.props.activeApp
        var colorScheme = null;
        if (activeApp) {
            if (this.props.theme === true) { //Dark Theme
                if (this.props.ui[activeApp].nightColorScheme && this.props.ui[activeApp].nightColorScheme.backgroundColor) {
                    colorScheme = this.props.ui[activeApp].nightColorScheme.backgroundColor
                }
            } else { //Light Theme
                if (this.props.ui[activeApp].dayColorScheme && this.props.ui[activeApp].dayColorScheme.backgroundColor) {
                    colorScheme = this.props.ui[activeApp].dayColorScheme.backgroundColor
                }
            }
        }

        if (colorScheme) {
            var redInt = colorScheme.red;
            var blueInt = colorScheme.blue;
            var greenInt = colorScheme.green;
            var cssColorScheme = {
                backgroundColor: `rgb(${redInt}, ${greenInt}, ${blueInt})`
            }
            if (UseDarkText(colorScheme) && this.props.theme === true) {
                cssColorScheme = {
                    backgroundColor: `rgb(${redInt}, ${greenInt}, ${blueInt})`,
                    color: '#000000'
                }                
            }
            console.log(cssColorScheme)
            return cssColorScheme;
        } else {
            return null;
        }
    }

    render() {
        var colorScheme = null;
        colorScheme = this.getColorScheme()
        let menuItems = this.props.data.map((menuItem) => {
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
                            style={colorScheme}
                        />
                    </div>)
        })
        return (
            <div className="vscrollmenu" style={colorScheme}>
                { menuItems }
            </div>
        )
    }
}
