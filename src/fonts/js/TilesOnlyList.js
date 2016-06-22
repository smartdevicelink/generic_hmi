import React from 'react';

import Tile from './Tile';

export default class TilesOnlyList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let tiles = this.props.data.map((tile) => {
            return <Tile key={tile.id} tile={tile} />;
        })
        return (
            <div className="tiles-only-list">
                { tiles }
            </div>
        )
    }
}
