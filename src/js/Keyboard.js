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
    var keyboardLayout = QWERTY
    if (app) {
      this.appID = state.activeApp;
      this.interactionId = app.interactionId;
      this.keyboardProperties = app.keyboardProperties;
      if (this.keyboardProperties && this.keyboardProperties.keyboardLayout) {
        switch(this.keyboardProperties.keyboardLayout) {
          case "QWERTY":
            break
          case "QWERTZ":
            keyboardLayout = QWERTZ
            break
          case "AZERTY":
            keyboardLayout = AZERTY
          default:
            break
        }
      }
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
                    layout={keyboardLayout}
                    onChange={this.onChange}
                    onKeyPress={this.onKeyPress}
                    theme={"hg-theme-default hg-layout-default custom-keyboard"}
                />
            </div>
        </div>
    );
  }
}

// Supported keyboard layouts
const QWERTY = {
  default: [
    "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
    "{tab} q w e r t y u i o p [ ] \\",
    "{lock} a s d f g h j k l ; ' {enter}",
    "{shift} z x c v b n m , . / {shift}",
    ".com @ {space}"
  ],
  shift: [
    "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
    "{tab} Q W E R T Y U I O P { } |",
    '{lock} A S D F G H J K L : " {enter}',
    "{shift} Z X C V B N M < > ? {shift}",
    ".com @ {space}"
  ]
};

const QWERTZ = {
  default: [
    "^ 1 2 3 4 5 6 7 8 9 0 \u00DF \u00B4 {bksp}",
    "{tab} q w e r t z u i o p \u00FC +",
    "{lock} a s d f g h j k l \u00F6 \u00E4 # {enter}",
    "{shift} < y x c v b n m , . - {shift}",
    ".com @ {space}"
  ],
  shift: [
    '\u00B0 ! " \u00A7 $ % & / ( ) = ? ` {bksp}',
    "{tab} Q W E R T Z U I O P \u00DC *",
    "{lock} A S D F G H J K L \u00D6 \u00C4 ' {enter}",
    "{shift} > Y X C V B N M ; : _ {shift}",
    ".com @ {space}"
  ]
};

const AZERTY = {
  default: [
    "\u00B2 & \u00E9 \" ' ( - \u00E8 _ \u00E7 \u00E0 ) = {bksp}",
    "{tab} a z e r t y u i o p ^ $",
    "{lock} q s d f g h j k l m \u00F9 * {enter}",
    "{shift} < w x c v b n , ; : ! {shift}",
    ".com @ {space}"
  ],
  shift: [
    "{//} 1 2 3 4 5 6 7 8 9 0 \u00B0 + {bksp}",
    "{tab} A Z E R T Y U I O P \u00A8 \u00A3",
    "{lock} Q S D F G H J K L M % \u00B5 {enter}",
    "{shift} > W X C V B N ? . / \u00A7 {shift}",
    ".com @ {space}"
  ]
};
