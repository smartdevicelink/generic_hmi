import React from 'react';
import StaticIcon from '../Shared/StaticIcon'

export default class DoubleGraphicBody extends React.Component {
    constructor(props) {
        super(props);
    }

    primaryGraphic() {
        if(this.props.graphic) {
            if(this.props.graphic.imageType === "STATIC") {
                return <StaticIcon class="double-graphic" image={this.props.graphic.value} />
            } else {
                return <img className="double-graphic" src={this.props.graphic.value} />
            }
        } else {
            return null
        }
    }

    secondaryGraphic() {
        if(this.props.secondaryGraphic) {
            if(this.props.secondaryGraphic.imageType === "STATIC") {
                return <StaticIcon class="double-graphic" image={this.props.secondaryGraphic.value} />
            } else {
                return <img className="double-graphic" src={this.props.secondaryGraphic.value} />
            }
        } else {
            return null
        }
    }

    render() {
        return (
            <div className={this.props.class}>            
                    {this.primaryGraphic()}
                    {this.secondaryGraphic()}
            </div>
        )
    }
}