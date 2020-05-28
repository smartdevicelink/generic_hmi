import React from 'react';

export default class Tile extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="tile">
                <img src={this.props.tile.image} className="th-box-shadow" />
            </div>
        )
    }
}
