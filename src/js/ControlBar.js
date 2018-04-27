import React from 'react';
import ControlBarItem from './ControlBarItem'


export default class ControlBar extends React.Component {
    constructor(props) {
        super(props);
    }

    getColorScheme() {
        if (this.props.colorScheme) {
            var redInt = this.props.colorScheme.red;
            var blueInt = this.props.colorScheme.blue;
            var greenInt = this.props.colorScheme.green;
            var cssColorScheme = {
                backgroundColor: `rgb(${redInt}, ${blueInt}, ${greenInt})`
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
