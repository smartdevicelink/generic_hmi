import React from 'react';
import SoftButtonImage from './Templates/Shared/SoftButtonImage'

export default class AlertButtons extends React.Component {
    constructor(props) {
        super(props);
        this.getAction = this.getAction.bind(this)
    }
    getAction(softButton) {
        var action = null
        var alert = {
            msgID: softButton.msgID,
            appID: softButton.appID,
            buttonID: softButton.softButtonID,
            buttonName: "CUSTOM_BUTTON",
            duration: softButton.duration
        }
        if(softButton.systemAction === "STEAL_FOCUS") {
            action = this.props.onStealFocus(alert, this.props.appID)
        } else if (softButton.systemAction === "KEEP_CONTEXT") {
            action = this.props.onKeepContext(alert)
        } else {
            action = this.props.onDefaultAction(alert, this.props.appID)
        }

        return action
    }
    render() {
        var softButtons = this.props.alertButtons
        var items;
        if(!softButtons){
            return (null)
        }

        if(softButtons.length === 1) {
            items = softButtons.map((softButton, index) => {               
                return (<div className="alert-button-1 th-f-color t-small t-light th-bg-color th-soft-buttons" 
                            key={softButton.softButtonID}
                            onClick={() => this.getAction(softButton)}>
                                {softButton.text}
                                <SoftButtonImage image={softButton.image ? softButton.image.value : null} 
                                    imageType={softButton.image ? softButton.image.imageType : null}
                                    isTemplate={softButton.image ? softButton.image.isTemplate : null}
                                    theme={this.props.theme}
                                />                                   
                        </div>)
            })
        } else if (softButtons.length === 2) {
            items = softButtons.map((softButton, index) => {
                return (<div className="alert-button-2 th-f-color t-small t-light th-bg-color th-soft-buttons" 
                            key={softButton.softButtonID}
                            onClick={() => this.getAction(softButton)}>
                                {softButton.text}
                                <SoftButtonImage image={softButton.image ? softButton.image.value : null} 
                                    imageType={softButton.image ? softButton.image.imageType : null}
                                    isTemplate={softButton.image ? softButton.image.isTemplate : null}
                                    theme={this.props.theme}
                                />                                    
                        </div>)
            })
        } else if (softButtons.length === 3) {
            items = softButtons.map((softButton, index) => {
                return (<div className="alert-button-3 th-f-color t-small t-light th-bg-color th-soft-buttons" 
                            key={softButton.softButtonID}
                            onClick={() => this.getAction(softButton)}>
                                {softButton.text}
                                <SoftButtonImage image={softButton.image ? softButton.image.value : null} 
                                    imageType={softButton.image ? softButton.image.imageType : null}
                                    isTemplate={softButton.image ? softButton.image.isTemplate : null}
                                    theme={this.props.theme}
                                />                                    
                        </div>)
            })            
        } else if (softButtons.length === 4) {
            items = softButtons.map((softButton, index) => {
                return (<div className="alert-button-4 th-f-color t-small t-light th-bg-color th-soft-buttons" 
                            key={softButton.softButtonID}
                            onClick={() => this.getAction(softButton)}>
                                {softButton.text}
                                <SoftButtonImage image={softButton.image ? softButton.image.value : null} 
                                    imageType={softButton.image ? softButton.image.imageType : null}
                                    isTemplate={softButton.image ? softButton.image.isTemplate : null}
                                    theme={this.props.theme}
                                />                                    
                        </div>)
            })         
        }

        return (
            <div className="alert-buttons">
                {items}
            </div>
        )        
    }
}
