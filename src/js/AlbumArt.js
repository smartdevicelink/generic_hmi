import React from 'react';
import StaticIcon from './Templates/Shared/StaticIcon'
import Image from './Templates/Shared/Image'

export default class AlbumArt extends React.Component {
    render() {
        if(this.props.image) {
            if(this.props.imageType === "STATIC") {
                return (
                    <div className="album-art">
                        <StaticIcon class="static-icon" image={this.props.image} />
                    </div>
                )
            } else {
                
                var fillColor = null;
                if (this.props.theme) {
                    fillColor = "#FFFFFF"
                } else {
                    fillColor = "#000000"
                }

                return (
                    <div className="album-art">
                        <Image class="th-box-shadow" 
                            image={this.props.image} 
                            isTemplate={this.props.isTemplate}
                            fillColor={fillColor}/>
                    </div>
                )
            }
        } else {
            return(null)
        }
    }
}
