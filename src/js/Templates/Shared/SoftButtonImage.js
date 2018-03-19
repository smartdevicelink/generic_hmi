import React from 'react';
import StaticIcon from './StaticIcon'

export default class SoftButtonImage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.image) {
            var className = this.props.class ? this.props.class : "soft-button-image";
            if(this.props.imageType === "STATIC") {
                return (
                    <div className={className}>
                        <StaticIcon image={this.props.image} />
                    </div>
                )
            } else {
                return (
                    <div className={className}>
                        <img src={this.props.image} />
                    </div>
                )
            }
        } else {
            return(null)
        }
    }
}
