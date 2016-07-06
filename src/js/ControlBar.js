import React from 'react';
import ControlBarItem from './ControlBarItem'


export default class ControlBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var buttons = this.props.subscribedButtons
        var id = 0
        var items = buttons.map((button) => {
            return (<ControlBarItem
                class={button.class}
                icon={button.icon}
                key={button.name + id++}/>)
        })
        return (
            <div className="control-bar th-bg-color">
                {items}
            </div>
        )
    }
}
