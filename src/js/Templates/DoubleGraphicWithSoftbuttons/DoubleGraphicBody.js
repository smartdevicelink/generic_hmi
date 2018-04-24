import React from 'react';

export default class DoubleGraphicBody extends React.Component {
    constructor(props) {
        super(props);
    }

    primaryGraphic() {
        if(this.props.graphic) {
            return <img className="double-graphic" src={this.props.graphic} />
        } else {
            return null
        }
    }

    secondaryGraphic() {
        if(this.props.secondaryGraphic) {
            return <img className="double-graphic" src={this.props.secondaryGraphic} />
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