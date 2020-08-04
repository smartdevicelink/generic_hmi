import React from 'react';

import AlertButtons from './containers/SubtleAlertButtons';
import Image from './Templates/Shared/Image'
import StaticIcon from './Templates/Shared/StaticIcon'

import uiController from './Controllers/UIController'

import { connect } from 'react-redux';

class SubtleAlert extends React.Component {
    constructor(props) {
        super(props);
        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler() {
        uiController.onStealFocus(this.props.context, this.props.context.appID, true);
    }

    render() {
        var fill = this.props.theme ? "#FFFFFF" : "#000000";
        var icon = this.props.icon ? this.props.icon : { imageType: "STATIC", value: "0xFE" }

        var iconElement = (icon.imageType === "STATIC")
                 ? (<StaticIcon class="subtleAlert-icon" image={icon.value} onClick={this.clickHandler} />)
                 : (<div className="subtleAlert-icon"><Image class="icon" image={icon.value} isTemplate={icon.isTemplate} fillColor={fill} onClick={this.clickHandler} /></div>);

        var textFields = [];

        for (var alertString of this.props.context.alertStrings) {
            if (alertString.fieldName === 'subtleAlertText1') {
                textFields.push(<h4 className="t-large t-medium th-f-color">{alertString.fieldText}</h4>)
            } else if (alertString.fieldName === 'subtleAlertText2') {
                textFields.push(<p className="t-small t-light th-f-color">{alertString.fieldText}</p>)
            }
        }

        return (
            <div className="subtleAlert">
                { iconElement }
                <div className="subtleAlert-text" onClick={this.clickHandler}>
                    { textFields }
                </div>
                <AlertButtons classPrefix="subtleAlert"/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    var alertContext = {};

    for(var app in state.ui) {
        if(state.ui[app].alert.showAlert) {
            alertContext = {
                ...state.ui[app].alert,
                appID: parseInt(app)
            }
        }
    }

    return {
        context: alertContext
    }
}

export default connect(mapStateToProps)(SubtleAlert)