import React from 'react';


export default class SoftButtons extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var softButtons = this.props.softButtons
        var id = 0
        var items = softButtons.map((softButton) => {
            return (<div key = {softButton.softButtonID}>{softButton.text}</div>)
        })
        return (
            <div>
                {items}
            </div>
        )
    }
}
