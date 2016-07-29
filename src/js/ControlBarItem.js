import React from 'react';

export default class ControlBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var image = this.props.icon ?
            <span key="icon" className="svg-wrap" dangerouslySetInnerHTML={{__html: this.props.icon}} /> :
            <img key="image" src={this.props.image} />
        return (
            <div
                className={`control-bar__control th-b-color-secondary control-bar__control--${ this.props.class }`}
                onClick={() => this.props.onButtonPress(this.props.appID, this.props.id, this.props.name)}>
                    {image}
            </div>
        )
    }
}
