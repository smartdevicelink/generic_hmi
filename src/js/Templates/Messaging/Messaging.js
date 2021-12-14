import React from 'react';
import { connect } from 'react-redux'
import AppHeader from '../../containers/Header';
import { SoftButtons } from '../../containers/Buttons';

var messageHistory = []

class Messaging extends React.Component {
    constructor(props) {
        super(props)
        this.firstRender = true;
    }
    getColorScheme() {
        var activeApp = this.props.activeApp
        var colorScheme = null;
        if (activeApp) {
            if (this.props.theme === true) { //Dark Theme
                if (this.props.ui[activeApp].nightColorScheme && this.props.ui[activeApp].nightColorScheme.backgroundColor) {
                    colorScheme = this.props.ui[activeApp].nightColorScheme.backgroundColor
                }
            } else { //Light Theme
                if (this.props.ui[activeApp].dayColorScheme && this.props.ui[activeApp].dayColorScheme.backgroundColor) {
                    colorScheme = this.props.ui[activeApp].dayColorScheme.backgroundColor
                }
            }
        }

        if (colorScheme) {
            var redInt = colorScheme.red;
            var blueInt = colorScheme.blue;
            var greenInt = colorScheme.green;
            var cssColorScheme = {
                backgroundColor: `rgb(${redInt}, ${greenInt}, ${blueInt})`
            }
            return cssColorScheme;
        } else {
            return null;
        }
    }

    render() {
        //console.log("render")
        var scrollBottom = false;
        const exists = (id) => {
            for (const item of messageHistory) {
                if (item.id === id) {
                    return true;
                }
            }
        }
        if (messageHistory.length === 0 ||
            (messageHistory.length > 0 && !exists(this.props.messageID))) {
                if (this.props.message && this.props.from && this.props.messageID) {
                    messageHistory.push({
                        message: this.props.message,
                        from: this.props.from,
                        id: this.props.messageID,
                        user: this.props.user
                    })
                    //console.log("Added message to internal history")
                    scrollBottom = true;
                }
        }
        var MessageArray = [];
        for (var message of messageHistory) {
            //console.log("Add message to display array: ", message )
            //console.log("Push: ", message.message)
            var className = "";
            if (message.from === message.user) {
                className = "message-sent"
                MessageArray.push(
                    <div key={"message_" + message.id} className={className}>
                        {message.message}
                    </div>
                )
            } else {
                className = "message-received"
                MessageArray.push(
                    <div key={"message_" + message.id} className="message-grouping">
                        <div className="message-avatar">
                            {message.from}
                        </div>
                        <div  className={className}>
                            {message.message}
                        </div>
                    </div>

                )
            }
        }

        setTimeout(()=> {
            var element = document.getElementById("mContainer");
            if (element && (scrollBottom || this.firstRender)) {
                //console.log("First render? : ", this.firstRender)
                element.scrollTop = element.scrollHeight;
                this.firstRender = false;
            }
        }, 10)

        var className = "";
        if(this.firstRender) {
            className = "messagingContainer"
        } else {
            className = "messagingContainer smooth-scroll"
        }

        return (
            <div className="messaging-template" style={this.getColorScheme()}>
                <AppHeader backLink="/" menuName="Apps"/>
                <div className="messaging-body">
                    <SoftButtons class="messaging-soft-buttons"/>
                    <div className={className} id="mContainer">
                        {MessageArray}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var messageData = state.ui[activeApp] ? state.ui[activeApp] : null;
    var message = "";
    var from = "";
    var id = "";
    var user = "";
    if(messageData) {
        Object.keys(messageData.showStrings).forEach((fieldName) => {
            switch (fieldName) {
                case "mainField1":
                    message = messageData.showStrings[fieldName]
                    break
                case "mainField2":
                    from = messageData.showStrings[fieldName]
                    break
                case "mainField3":
                    id = messageData.showStrings[fieldName]
                    break
                case "mainField4":
                    user = messageData.showStrings[fieldName]
                    break
                default:
                    break;
            }
        })
    }
    return { 
        activeApp: state.activeApp,
        theme: state.theme,
        ui: state.ui,
        message: message,
        from: from,
        messageID: id,
        user: user
    };
};


export default connect(mapStateToProps)(Messaging);