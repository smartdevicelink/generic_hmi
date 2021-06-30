import React from 'react';
import StaticIcon from './Templates/Shared/StaticIcon'
export default class PerformAudioPassThru extends React.Component {
    render() {
        // Use Static Microphone Image
        var icon = "0xE8";
        var iconElement = (<StaticIcon class="alert-icon" image={icon} />);
        var aptTextFields = [];
        for (const textField of this.props.textFields) {
            aptTextFields.push(
                <p className="t-small t-medium th-f-color">{textField.fieldText}</p>
            );
        }

        return (
            <div className="alert">
                <div className="alert-title">
                    <p className="t-small t-light th-f-color">
                        {this.props.appName}
                    </p>
                </div>
                <div className="alert-top">
                    <div className="alert-text-fields">
                        {aptTextFields}
                    </div>
                    { iconElement }
                </div>
                <div className="alert-buttons">
                    <div className="alert-button-3 th-f-color t-small t-light th-bg-color th-soft-buttons"
                        key="aptDoneButton"
                        onClick={() => 
                            this.props.resultCallback("SUCCESS")
                        }
                    >
                        <p>Done</p>                                  
                    </div>
                    <div className="alert-button-3 th-f-color t-small t-light th-bg-color th-soft-buttons"
                        key="aptRetryButton"
                        onClick={() => 
                            this.props.resultCallback("RETRY")
                        }
                    >
                        <p>Retry</p>                                  
                    </div>
                    <div className="alert-button-3 th-f-color t-small t-light th-bg-color th-soft-buttons"
                        key="aptCancelButton"
                        onClick={() => 
                            this.props.resultCallback("ABORTED")
                        }
                    >
                        <p>Cancel</p>                                  
                    </div>
                </div>
            </div>
        )
    }
}