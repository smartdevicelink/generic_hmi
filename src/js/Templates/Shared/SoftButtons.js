import React from 'react';


export default class SoftButtonsBody extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var softButtons = []
        if(this.props.softButtons.length > 6) {
            softButtons = this.props.softButtons.slice(0, 6)
        } else {
            softButtons = this.props.softButtons
        }
        var id = 0
        var items;
        if(softButtons.length == 1) {
            items = softButtons.map((softButton, index) => {
                return (<div className="soft-button-tile-large th-f-color t-small t-light th-bg-color th-soft-buttons" 
                            key={softButton.softButtonID}
                            onClick={() => this.props.onButtonPress(this.props.appID, softButton.softButtonID, "CUSTOM_BUTTON")}>
                                {softButton.text}                                
                        </div>)
            })
        } else if (softButtons.length == 2) {
            items = softButtons.map((softButton, index) => {
                return (<div className="soft-button-tile-wide-large th-f-color t-small t-light th-bg-color th-soft-buttons" 
                            key={softButton.softButtonID}
                            onClick={() => this.props.onButtonPress(this.props.appID, softButton.softButtonID, "CUSTOM_BUTTON")}>
                                {softButton.text}                                
                        </div>)
            })
        } else if (softButtons.length == 3) {
            items = softButtons.map((softButton, index) => {
                return (<div className="soft-button-tile-wide th-f-color t-small t-light th-bg-color th-soft-buttons" 
                            key={softButton.softButtonID}
                            onClick={() => this.props.onButtonPress(this.props.appID, softButton.softButtonID, "CUSTOM_BUTTON")}>
                                {softButton.text}                                
                        </div>)
            })            
        } else if (softButtons.length == 4) {
            items = softButtons.map((softButton, index) => {
                return (<div className="soft-button-tile th-f-color t-small t-light th-bg-color th-soft-buttons" 
                            key={softButton.softButtonID}
                            onClick={() => this.props.onButtonPress(this.props.appID, softButton.softButtonID, "CUSTOM_BUTTON")}>
                                {softButton.text}                                
                        </div>)
            })         
        } else if (softButtons.length == 5) {
            items = softButtons.map((softButton, index) => {
                if (index == 4) {
                    return (<div className="soft-button-tile-wide th-f-color t-small t-light th-bg-color th-soft-buttons" 
                                key={softButton.softButtonID}
                            onClick={() => this.props.onButtonPress(this.props.appID, softButton.softButtonID, "CUSTOM_BUTTON")}>
                                {softButton.text}                                
                        </div>)
                } else {
                    return (<div className="soft-button-tile-small th-f-color t-small t-light th-bg-color th-soft-buttons" 
                                key={softButton.softButtonID}
                            onClick={() => this.props.onButtonPress(this.props.appID, softButton.softButtonID, "CUSTOM_BUTTON")}>
                                {softButton.text}                                
                        </div>)
                }
            })
        } else if (softButtons.length == 6) {
            items = softButtons.map((softButton, index) => {
                return (<div className="soft-button-tile-small th-f-color t-small t-light th-bg-color th-soft-buttons" 
                            key={softButton.softButtonID}
                            onClick={() => this.props.onButtonPress(this.props.appID, softButton.softButtonID, "CUSTOM_BUTTON")}>
                                {softButton.text}                                
                        </div>)
            })
        }
        if (this.props.graphicPresent == true) {
            return (
                <div className={this.props.class}>
                    <div className="soft-buttons soft-buttons-with-graphic">
                        {items}
                    </div>
                </div>
            )
        } else {
            return (
                <div className={this.props.class}>
                    <div className="soft-buttons">
                        {items}
                    </div>
                </div>
            )
        } 
    }
}
