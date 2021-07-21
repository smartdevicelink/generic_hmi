import React from 'react';
import SoftButtonImage from './Templates/Shared/SoftButtonImage';
import uiController from './Controllers/UIController';

export default class ScrollableMessageButtons extends React.Component {
    constructor(props) {
        super(props);
        this.getAction = this.getAction.bind(this);
    }
    getAction(softButton) {
        uiController.onButtonPress(softButton.appID, softButton.softButtonID, 'CUSTOM_BUTTON');
        if(softButton.systemAction === "STEAL_FOCUS") {
            uiController.onScrollableMessageStealFocus(softButton.msgID, softButton.appID);
        } else if (softButton.systemAction === "KEEP_CONTEXT") {
            uiController.onScrollableMessageKeepContext(softButton.msgID, softButton.appID, softButton.duration);
        } else {
            uiController.onCloseScrollableMessage(softButton.msgID, softButton.appID, this.props.appID);
        }
    }
    render() {
        var softButtons = this.props.scrollableMessageButtons;
        if(!softButtons){
            return (null)
        }

        return (
            <div className={`scrollableMessage-buttons`}>
                {softButtons.map((softButton, index) => {
                    return (<div className={`scrollableMessage-button th-f-color t-small t-light th-bg-color th-soft-buttons`}
                                key={softButton.softButtonID}
                                onClick={() => this.getAction(softButton)}>
                                    <SoftButtonImage image={softButton.image ? softButton.image.value : null}
                                        imageType={softButton.image ? softButton.image.imageType : null}
                                        isTemplate={softButton.image ? softButton.image.isTemplate : null}
                                        theme={this.props.theme}
                                    />
                                    <p>{softButton.text}</p>
                            </div>)
                })}
            </div>
        )
    }
}