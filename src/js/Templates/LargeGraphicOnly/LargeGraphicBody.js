import React from 'react';



export default class LargeGraphicBody extends React.Component {
    render() {
        if(this.props.graphic) {
            return (
                <div className={this.props.class}>            
                        <img className="large-graphic" src={this.props.graphic} />
                </div>
            )
        } else {
            return (null)
        }
    }
}