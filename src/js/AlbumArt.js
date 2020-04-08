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

                var style = {
                    height: "100%", 
                    width: "100%",
                    display: "flex",
                    alignItems: "center"
                }

                return (
                    <div className="album-art">
                        <div style={style} className="th-box-shadow">
                            <Image
                                image={this.props.image} 
                                isTemplate={this.props.isTemplate}
                                fillColor={fillColor}/>
                        </div>    
                    </div>
                )
            }
        } else {
            return(null)
        }
    }
}
