import React from 'react';
import StaticIcon from './Templates/Shared/StaticIcon'
export default class AlbumArt extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.image) {
            if(this.props.imageType === "STATIC") {
                return (
                    <div className="album-art">
                        <StaticIcon class="static-icon" image={this.props.image} />
                    </div>
                )
            } else {
                return (
                    <div className="album-art">
                        <img className="th-box-shadow" src={this.props.image} />
                    </div>
                )
            }
        } else {
            return(null)
        }
    }
}
