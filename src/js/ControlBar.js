import React from 'react';
import ControlBarItem from './ControlBarItem'


export default class ControlBar extends React.Component {
    getColorScheme() {
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

    intToHexString(value) {
        var str = value.toString(16);
        if (str.length === 1) {
            return "0" + str;
        } else {
            return str
        }
    }

    getHighlightColor(button) {
        if(button.isHighlighted) {
            if (this.props.colorScheme && this.props.colorScheme.primary) {
                var redInt = this.props.colorScheme.primary.red;
                var greenInt = this.props.colorScheme.primary.green;
                var blueInt = this.props.colorScheme.primary.blue;

                var hex = "#";
                hex += this.intToHexString(redInt).toUpperCase();
                hex += this.intToHexString(greenInt).toUpperCase();
                hex += this.intToHexString(blueInt).toUpperCase();
                return hex;
            } else {
                return "#65a0ff" //bright blue
            }
        } else {
            return null
        }
    }

    render() {
        var buttons = this.props.buttons
        var id = 0
        var items = buttons.map((button) => {
            return (<ControlBarItem
                class={button.class}
                icon={button.icon}
                image={button.image}
                imageType={button.imageType}
                key={button.name + id++}
                name={button.name}
                id={button.id}
                appID={this.props.appID}
                onButtonPress={this.props.onButtonPress}
                onButtonDown={this.props.onButtonDown}
                onButtonUp={this.props.onButtonUp}
                theme={this.props.theme}
                isTemplate={button.isTemplate}
                highlightColor={this.getHighlightColor(button)}/>)
        })
        return (
            <div className="control-bar th-bg-color" style={this.getColorScheme()}>
                {items}
            </div>
        )
    }
}
