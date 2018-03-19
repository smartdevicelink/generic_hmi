import React from 'react';
import StaticIcon from './StaticIcon'


export default class LargeGraphicBody extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.graphic) {
            if(this.props.graphic.imageType === "STATIC") {
                return (
                    <div className={this.props.class}>            
                        <StaticIcon class="large-graphic" image={this.props.graphic.value} />
                    </div>
                )
            } else {
                return (
                    <div className={this.props.class}>            
                            <img className="large-graphic" src={this.props.graphic.value} />
                    </div>
                )
            }

        } else {
            return (null)
        }
    }
}