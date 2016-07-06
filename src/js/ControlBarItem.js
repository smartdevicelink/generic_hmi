import React from 'react';

export default class ControlBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={`control-bar__control th-b-color-secondary control-bar__control--${ this.props.class }`}>
                <span className="svg-wrap" dangerouslySetInnerHTML={{__html: this.props.icon}} />
            </div>
        )
    }
}
