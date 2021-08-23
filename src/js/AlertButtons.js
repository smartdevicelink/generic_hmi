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
            let okButton = {
                appID: this.props.appID,
                type: "BOTH",
                text: "OK",
                image: {
                    value: "0xD5",
                    imageType: "STATIC",
                    isTemplate: false
                },
                isHighlighted: false,
                systemAction: "DEFAULT_ACTION"
            }
            softButtons = [ okButton ]
        }

        if(softButtons.length === 1) {
            items = softButtons.map((softButton, index) => {               
                return (<div className={`${this.props.classPrefix}-button-1 th-f-color t-small t-light th-soft-buttons ${softButton.isHighlighted ? 'bg-highlighted' : 'th-bg-color'}`}
                            key={softButton.softButtonID}
                            onClick={() => this.getAction(softButton)}>
                                <p>{softButton.text}</p>
                                <SoftButtonImage image={softButton.image ? softButton.image.value : null} 
                                    imageType={softButton.image ? softButton.image.imageType : null}
                                    isTemplate={softButton.image ? softButton.image.isTemplate : null}
                                    theme={this.props.theme}
                                />                                   
                        </div>)
            })
        } else if (softButtons.length === 2) {
            items = softButtons.map((softButton, index) => {
                return (<div className={`${this.props.classPrefix}-button-2 th-f-color t-small t-light th-soft-buttons ${softButton.isHighlighted ? 'bg-highlighted' : 'th-bg-color'}`}
                            key={softButton.softButtonID}
                            onClick={() => this.getAction(softButton)}>
                                <p>{softButton.text}</p>
                                <SoftButtonImage image={softButton.image ? softButton.image.value : null} 
                                    imageType={softButton.image ? softButton.image.imageType : null}
                                    isTemplate={softButton.image ? softButton.image.isTemplate : null}
                                    theme={this.props.theme}
                                />                                    
                        </div>)
            })
        } else if (softButtons.length === 3) {
            items = softButtons.map((softButton, index) => {
                return (<div className={`${this.props.classPrefix}-button-3 th-f-color t-small t-light th-soft-buttons ${softButton.isHighlighted ? 'bg-highlighted' : 'th-bg-color'}`}
                            key={softButton.softButtonID}
                            onClick={() => this.getAction(softButton)}>
                                <p>{softButton.text}</p>
                                <SoftButtonImage image={softButton.image ? softButton.image.value : null} 
                                    imageType={softButton.image ? softButton.image.imageType : null}
                                    isTemplate={softButton.image ? softButton.image.isTemplate : null}
                                    theme={this.props.theme}
                                />                                    
                        </div>)
            })            
        } else if (softButtons.length === 4) {
            items = softButtons.map((softButton, index) => {
                return (<div className={`${this.props.classPrefix}-button-4 th-f-color t-small t-light th-soft-buttons ${softButton.isHighlighted ? 'bg-highlighted' : 'th-bg-color'}`}
                            key={softButton.softButtonID}
                            onClick={() => this.getAction(softButton)}>
                                <p>{softButton.text}</p>
                                <SoftButtonImage image={softButton.image ? softButton.image.value : null} 
                                    imageType={softButton.image ? softButton.image.imageType : null}
                                    isTemplate={softButton.image ? softButton.image.isTemplate : null}
                                    theme={this.props.theme}
                                />                                    
                        </div>)
            })         
        }

        return (
            <div className={`${this.props.classPrefix}-buttons`}>
                {items}
            </div>
        )        
    }
}
