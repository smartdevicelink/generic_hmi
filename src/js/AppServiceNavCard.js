import React from 'react';
import navIcon from "../img/app_services/navigation.svg";
export default class AppServiceNavCard extends React.Component {

    constructor() {
        super();
    }

    render() {
        if (!this.props.navActive || !this.props.navData) {
            return null;
        }

        
        var navData = this.props.navData;
        console.log("Nav Card Render: " + JSON.stringify(navData, null, 2))
        var streetLine = navData.location ? 
            (<p className="t-large t-medium th-f-color ">
                {navData.location}
            </p>) : null;

        var actionBearingLine = navData.actionBearing ? 
            (<p className="t-light t-small th-f-color">
                {navData.actionBearing}
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
                <span className="svg-size  nav-color svg-fill-important" 
                    dangerouslySetInnerHTML={{__html: navIcon}} />
                {instructionLines}
                {nextActionLine}
                <p className="app-service-card-footer th-f-color">
                    NAVIGATION
                </p>
            </div>
        )
    }

}