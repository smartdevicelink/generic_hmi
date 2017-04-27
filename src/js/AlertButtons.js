import React from 'react';


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
        if(softButton.systemAction == "STEAL_FOCUS") {
            action = this.props.onStealFocus(alert, this.props.appID)
        } else if (softButton.systemAction == "KEEP_CONTEXT") {
            action = this.props.onKeepContext(alert)
        } else {
            action = this.props.onDefaultAction(alert, this.props.appID)
        }

        return action
    }
    render() {
        var softButtons = this.props.alertButtons
        var id = 0
        var items;
        if(!softButtons){
            return (null)
        }
        var action
        if(softButtons.length == 1) {
            items = softButtons.map((softButton, index) => {               
                return (<div className="alert-button-tile-large th-f-color t-small t-light th-bg-color th-soft-buttons" 
                            key={softButton.softButtonID}
                            onClick={() => this.getAction(softButton)}>
                                {softButton.text}                                
                        </div>)
            })
        } else if (softButtons.length == 2) {
            items = softButtons.map((softButton, index) => {
                return (<div className="alert-button-tile-wide-large th-f-color t-small t-light th-bg-color th-soft-buttons" 
                            key={softButton.softButtonID}
                            onClick={() => this.getAction(softButton)}>
                                {softButton.text}                                
                        </div>)
            })
        } else if (softButtons.length == 3) {
            items = softButtons.map((softButton, index) => {
                return (<div className="alert-button-tile-wide th-f-color t-small t-light th-bg-color th-soft-buttons" 
                            key={softButton.softButtonID}
                            onClick={() => this.getAction(softButton)}>
                                {softButton.text}                                
                        </div>)
            })            
        } else if (softButtons.length == 4) {
            items = softButtons.map((softButton, index) => {
                return (<div className="alert-button-tile th-f-color t-small t-light th-bg-color th-soft-buttons" 
                            key={softButton.softButtonID}
                            onClick={() => this.getAction(softButton)}>
                                {softButton.text}                                
                        </div>)
            })         
        } else if (softButtons.length == 5) {
            items = softButtons.map((softButton, index) => {
                if (index == 4) {
                    return (<div className="alert-button-tile-wide th-f-color t-small t-light th-bg-color th-soft-buttons" 
                                key={softButton.softButtonID}
                            onClick={() => this.getAction(softButton)}>
                                {softButton.text}                                
                        </div>)
                } else {
                    return (<div className="alert-button-tile-small th-f-color t-small t-light th-bg-color th-soft-buttons" 
                                key={softButton.softButtonID}
                            onClick={() => this.getAction(softButton)}>
                                {softButton.text}                                
                        </div>)
                }
            })
        } else if (softButtons.length == 6) {
            items = softButtons.map((softButton, index) => {
                return (<div className="alert-button-tile-small th-f-color t-small t-light th-bg-color th-soft-buttons" 
                            key={softButton.softButtonID}
                            onClick={() => this.getAction(softButton)}>
                                {softButton.text}                                
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
