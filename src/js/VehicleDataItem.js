import React from 'react';
import { Link } from 'react-router';


export default class VehicleDataItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = { x: 0, y: 0 , mouseClick: 0, value: props.value};
    }

    onMouseMoveCoords(e) {
        //console.log(this.props)
        //console.log(e)
        if((this.state.mouseClick % 2) != 0) { //Odd number of events, so mouse is down
            this.setState({ x: e.pageX, y: e.pageY });
            console.log(this.state)
            this.props.onMouseMove(e.pageX, e.pageY);
        }
        
    }

    onMouseDown() {
        console.log("OnMouseDown set state")
        var inc = this.state.mouseClick+1;
        this.setState({mouseClick: inc});
        this.props.onMouseDown();
    }

    onMouseUp(dataValue) {
        console.log("Mouse Up set state")
        var inc = this.state.mouseClick+1;
        this.setState({mouseClick: inc, value: dataValue});
        console.log(this.state)
        this.props.onMouseUp(this.props.name, dataValue, this.props.formType);
    }

    onMouseLeave(dataValue) {
        if ((this.state.mouseClick % 2) != 0 ) {
            this.onMouseUp(dataValue); // User was holding down the mouse when leaving the div. Call this to reset state.
        }
    }

    render() {
        var slider = {} 
        var dataValue = "";
        var index=0;
        if(this.props.formType == "SLIDER") {
            var percent = (1-(800 - this.state.x) / 800) * 100 //TODO: make width dynamic
            var relativeValue = this.props.range[1] * (percent / 100) // grab max value and calculate relative value
            relativeValue = relativeValue | 0; // Round down
            if (relativeValue > this.props.range[1]) { //Compare to max range
                relativeValue = this.props.range[1]
            }
            console.log("RelativeValue: " + relativeValue)
            dataValue = relativeValue.toString()

            slider = {
                width : percent.toString() + "%"            
            }
        } else if (this.props.formType == "RADIO") {
            index = ((this.state.mouseClick / 2) | 0) % (this.props.range.length)
            dataValue = this.props.range[index]

            var percent = ((index / (this.props.range.length-1)) * 100) | 0;
            slider = {
                width : percent.toString() + "%"
            }
            
        }

        if(this.props.formType == "SLIDER") {
            return (
                <div className="vscrollmenu-item th-b-color th-bb-color-secondary"
                onMouseDown={this.onMouseDown.bind(this)}
                onMouseUp={this.onMouseUp.bind(this, dataValue)}
                onMouseMove={this.onMouseMoveCoords.bind(this)}
                onMouseLeave={this.onMouseLeave.bind(this, dataValue)}
                onClick={() => this.props.onSelection(this.props.name, this.props.value, this.props.formType)}>
                    <div className="vdscrollmenu-item__name" >
                        <div className="vehicle-data-content">
                            <p className="t-large t-light th-f-color">{this.props.name}</p>
                            <p className="t-large t-light th-f-color-secondary">{dataValue}</p>
                        </div>
                        <div className="vehicle-data-slider" style={slider}/> 
                    </div>
                </div>
            )
        } else if(this.props.formType == "RADIO") {
            var range = this.props.range;
            return (
                <div className="vscrollmenu-item th-b-color th-bb-color-secondary"
                onMouseDown={this.onMouseDown.bind(this)}
                onMouseUp={this.onMouseUp.bind(this, range[(index+1) % range.length])}
                onMouseMove={this.onMouseMoveCoords.bind(this)}
                onMouseLeave={this.onMouseLeave.bind(this, range[(index+1) % range.length])} //Get next enum
                onClick={() => this.props.onSelection(this.props.name, this.props.value, this.props.formType)}>
                    <div className="vdscrollmenu-item__name" >
                        <div className="vehicle-data-content">
                            <p className="t-large t-light th-f-color">{this.props.name}</p>
                            <p className="t-large t-light th-f-color-secondary">{dataValue}</p>
                        </div>
                        <div className="vehicle-data-slider" style={slider}/> 
                    </div>
                </div>
            )            
        } else {
            return (
                <div className="vscrollmenu-item th-b-color th-bb-color-secondary"
                onMouseDown={() => this.props.onMouseDown()}
                onMouseUp={() => this.props.onMouseUp()}
                onMouseMove={this.onMouseMoveCoords.bind(this)}
                onClick={() => this.props.onSelection(this.props.name, this.props.value, this.props.formType)}>
                    <div className="vdscrollmenu-item__name" >
                        <div className="vehicle-data-content">
                            <p className="t-large t-light th-f-color">{this.props.name}</p>
                            <p className="t-large t-light th-f-color-secondary">{this.props.value}</p>
                        </div>
                    </div>
                </div>
            )            
        }
    }
}
