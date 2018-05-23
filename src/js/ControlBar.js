import React from 'react';
import ControlBarItem from './ControlBarItem'


export default class ControlBar extends React.Component {
    constructor(props) {
        super(props);
    }

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
                onButtonPress={this.props.onButtonPress}/>)
        })
        return (
            <div className="control-bar th-bg-color" style={this.getColorScheme()}>
                {items}
            </div>
        )
    }
}
