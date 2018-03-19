import React from 'react';
import StaticIcon from '../Shared/StaticIcon'
export default class NonMediaGraphic extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.image) {
            if(this.props.image.imageType === "STATIC") {
                return (
                    <div className="non-media-graphic">
                       <StaticIcon class="static-icon" image={this.props.image.value} />
                    </div>
                )
            } else {
                return (
                    <div className="non-media-graphic">
                        <img className="th-box-shadow" src={this.props.image.value} />
                    </div>
                )
            }
        } else {
            return(null)
        }
    }
}