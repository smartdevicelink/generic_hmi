import React from 'react';
import { Link } from 'react-router';

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
