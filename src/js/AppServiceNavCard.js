import React from 'react';
import NavInstructionImage from "./NavInstructionImage";
export default class AppServiceNavCard extends React.Component {

    constructor() {
        super();
    }

    render() {
        if (!this.props.navActive || !this.props.navData) {
            return null;
        }        
        var navData = this.props.navData;
        var streetLine = navData.location ? 
            (<p className="t-large t-medium th-f-color ">
                {navData.location}
            </p>) : null;

        var actionBearingLine = navData.actionBearing ? 
            (<p className="t-light t-small th-f-color">
                {navData.actionBearing + (navData.distance ? " | " + navData.distance : "")}
            </p>) : null;

        var instructionLines = null;
        if (streetLine || actionBearingLine) {
            instructionLines = (<div className="location-instruction">
                {streetLine}
                {actionBearingLine}
            </div>);
        }

        var nextActionLine = navData.nextActionBearing ?
            (<p className="t-light th-f-color">
                {navData.nextActionBearing}
            </p>) : null;

        return (
            <div className="app-service-nav-card app-service-medium-tab">
                <NavInstructionImage image={navData.image} theme={this.props.theme} parent="nav-card"/>
                {instructionLines}
                {nextActionLine}
                <p className="app-service-card-footer th-f-color">
                    NAVIGATION
                </p>
            </div>
        )
    }
}