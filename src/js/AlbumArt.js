import React from 'react';

export default class AlbumArt extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="album-art">
                <img className="th-box-shadow" src={this.props.image} />
            </div>
        )
    }
}
