import React from 'react';
import HScrollMenuItem from './HScrollMenuItem'
import {UseDarkText} from './calculate_text_color';
export default class HScrollMenu extends React.Component {
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
            return cssColorScheme;
        } else {
            return null;
        }
    }

    render() {
        var colorScheme = null;
        colorScheme = this.getColorScheme();
        let menuItems = this.props.data.map((menuItem) => {
            return (<div className="hscrollmenu-block"
                key={menuItem.cmdID + menuItem.name}>
                    <HScrollMenuItem
                        menuItem={menuItem}
                        theme={this.props.theme}
                        onSelection={this.props.onSelection}/>
                </div>)
        })
        return (
            <div className="hscrollmenu" style={colorScheme}>
                { menuItems }
            </div>
        )
    }
}
