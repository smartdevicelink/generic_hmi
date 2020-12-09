import React, { Component } from "react";
import SimpleKeyboard from "react-simple-keyboard";
import AppHeader from './containers/Header';
import "react-simple-keyboard/build/css/index.css";
import store from './store';
import uiController from './Controllers/UIController'
import { deactivateInteraction } from './actions'

export default class Keyboard extends Component {
  state = {
    layoutName: "default",
    input: ""
  };

  keyboardProperties = {};

  onChange = input => {
    // Changes from button presses
    this.setState({ input });
    this.handleInput(input);
  };

  onChangeInput = event => {
    // Changes from typing directly into input field
    const input = event.target.value;
    this.setState({ input });
    this.keyboard.setInput(input);
    this.handleInput(input)    
  };

  onKeyPress = button => {
    // Special handler for reserved buttons and single keypress mode
    if (button === "{shift}" || button === "{lock}") {
      this.handleShift();
    } else if (button === "{enter}")  {
      uiController.onKeyboardInput(this.state.input, 'ENTRY_SUBMITTED');
      uiController.onSystemContext("MAIN", this.appID)
      uiController.onChoiceSelection(null, this.appID, this.interactionId)
      store.dispatch(deactivateInteraction(this.appID))
    } else if (this.keyboardProperties.keypressMode === "SINGLE_KEYPRESS") {
      if (button === "{bksp}") {
        uiController.onKeyboardInput("BS", 'KEYPRESS');
      } else if (button === "{tab}") {
        uiController.onKeyboardInput("HT", 'KEYPRESS');
      } else {
        uiController.onKeyboardInput(button, 'KEYPRESS');
      }

    }
  };

  handleInput (input) {
    uiController.onResetInteractionTimeout(this.appID, this.interactionId)
    if (this.keyboardProperties.keypressMode === "SINGLE_KEYPRESS") {
      return;
    } else if (this.keyboardProperties.keypressMode === "QUEUE_KEYPRESS") {
      return;
    } else { //RESEND_CURRENT_ENTRY is the default if no specified keypressMode
      uiController.onKeyboardInput(input, 'KEYPRESS');
    }
  }

  handleShift = () => {
    const layoutName = this.state.layoutName;
    this.setState({
      layoutName: layoutName === "default" ? "shift" : "default"
    });
  };

  render() {
    const state = store.getState()
    const app = state.ui[state.activeApp]
    if (app) {
      this.keyboardProperties = app.keyboardProperties;
      this.appID = state.activeApp;
      this.interactionId = app.interactionId;
    }
    
    var backLink = "/";
    if (app && app.isPerformingInteraction) {
        backLink = app.displayLayout;
    }
    return (
        <div>
            <AppHeader backLink={backLink} menuName="Back"/>
            <div className="keyboard">
                <input
                    value={this.state.input}
                    placeholder={"Tap on the virtual keyboard to start"}
                    onChange={this.onChangeInput}
                />
                <SimpleKeyboard
                    keyboardRef={r => (this.keyboard = r)}
                    layoutName={this.state.layoutName}
                    onChange={this.onChange}
                    onKeyPress={this.onKeyPress}
                    theme={"hg-theme-default hg-layout-default custom-keyboard"}
                />
            </div>
        </div>
    );
  }
}
