import React from 'react';
import ControlBarItem from './ControlBarItem'


export default class ControlBar extends React.Component {
    constructor(props) {
        super(props);
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
            <div className="control-bar th-bg-color">
                {items}
            </div>
        )
    }
}
