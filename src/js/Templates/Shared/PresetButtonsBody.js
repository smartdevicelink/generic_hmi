import React from 'react';
import Radium from 'radium'

class PresetButtonsBody extends React.Component {
    getSecondaryColorScheme() {
        if (this.props.colorScheme && this.props.colorScheme.secondary) {
            var redInt = this.props.colorScheme.secondary.red;
            var blueInt = this.props.colorScheme.secondary.blue;
            var greenInt = this.props.colorScheme.secondary.green;
            var cssColorScheme = {
                backgroundColor: `rgb(${redInt}, ${greenInt}, ${blueInt})`
            }
            return cssColorScheme;
        } else {
            return null;
        } 
    }

    getPrimaryColorScheme() {
        if (this.props.colorScheme && this.props.colorScheme.primary) {
            var redInt = this.props.colorScheme.primary.red;
            var blueInt = this.props.colorScheme.primary.blue;
            var greenInt = this.props.colorScheme.primary.green;
            var cssColorScheme = {
                ':active': {
                    backgroundColor: `rgb(${redInt}, ${greenInt}, ${blueInt})`
                  }
                
            }
            return cssColorScheme;
        } else {
            return null;
        } 
    }

    render() {
        var items;
        var presets = this.props.presets.slice(0, 6)

        var secondaryStyle = this.getSecondaryColorScheme();
        var primaryStyle = this.getPrimaryColorScheme();
        var cssColorStyle = Object.assign(primaryStyle ? primaryStyle : {}, 
                                            secondaryStyle ? secondaryStyle : {});
        
        var mouseDown = (preset) => this.props.onButtonDown(this.props.appID, preset.name);
        var mouseUp = (preset) => this.props.onButtonUp(this.props.appID, preset.name);
        items = presets.map((preset) => {
            return (<div className='soft-button-tile-small th-f-color t-small t-light th-soft-buttons soft-button th-bg-color'
                        style={cssColorStyle}
                        key={preset.name}
                        onMouseDown={() => mouseDown(preset)}
                        onMouseUp={() => mouseUp(preset)}>
                        {preset.label}
                    </div>)
        })
        return (
            <div className={this.props.class}>
                <div className="soft-buttons">
                    {items}
                </div>
            </div>
        )
    }
}


export default Radium(PresetButtonsBody);