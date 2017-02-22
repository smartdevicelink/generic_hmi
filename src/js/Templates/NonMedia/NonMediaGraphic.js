import React from 'react';

export default class NonMediaGraphic extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.image) {
            return (
                <div className="non-media-graphic">
                    <img className="th-box-shadow" src={this.props.image} />
                </div>
            )
        } else {
            return(null)
        }
    }
}