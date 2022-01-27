import React, { Component } from "react";
import { connect } from 'react-redux'
import SimpleKeyboard from "react-simple-keyboard";
import AppHeader from './containers/Header';
import "react-simple-keyboard/build/css/index.css";
import store from './store';
import uiController from './Controllers/UIController'
import { deactivateInteraction } from './actions'

import { VSubMenu, HSubMenu } from './containers/SubMenu';

class Keyboard extends Component {

  constructor(props) {
    super(props);
    this.keyboardProperties = {};
    this.keyboardLayout = JSON.parse(JSON.stringify(QWERTY));
    this.maskedInput = false
    this.showUserMaskOption = false
    this.keyboardClass = "hg-theme-default hg-layout-default custom-keyboard"
    this.capsLock = false

    this.state = {
      layoutName: "default",
      input: "",
      userMaskedInput: false,
      tabCount: 0
    };
  }

  handleAutoComplete = append => {
    var completedWord = this.state.input + append;
    this.setState({
      input: completedWord
    });
    this.keyboard.setInput(completedWord);
    this.handleInput(completedWord);
    if (this.keyboardProperties.keypressMode === "SINGLE_KEYPRESS") {
      uiController.onKeyboardInput(append, 'KEYPRESS');
    }
  }

  onChange = input => {
    // Changes from button presses
    var tabPattern = /\t/g;
    var tabCount = ((input || '').match(tabPattern) || []).length * 7;
    this.setState({ input, tabCount }, () => {
      this.inputRef.scrollLeft = this.inputRef.scrollWidth + this.state.tabCount;
      this.groupInputRef.scrollLeft = this.groupInputRef.scrollWidth;
    });
    this.handleInput(input);
  };

  onChangeInput = event => {
    // Changes from typing directly into input field
    const input = event.target.value;
    this.setState({ input });
    this.keyboard.setInput(input);
    this.handleInput(input);
  };

  onKeyPress = button => {
    // Special handler for reserved buttons and single keypress mode
    if (button === "{shift}") {
      if (this.capsLock) {
        // Cancel Caps Lock
        this.capsLock = false;
      }
      this.handleShift();
    } else if (button === "{lock}") {
      this.capsLock = !this.capsLock;
      this.handleShift();
    } else if (button === "{enter}")  {
      uiController.onKeyboardInput(this.state.input, 'ENTRY_SUBMITTED');
      uiController.onSystemContext("MAIN", this.appID)
      uiController.onChoiceSelection(null, this.appID, this.interactionId, this.state.input)
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
    if (!this.capsLock && this.state.layoutName === "shift") {
      // Return layout to normal if user is not using caps lock
      this.handleShift();
    }
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

  handleUserMask = () => {
    const toggleMask = !this.state.userMaskedInput
    this.setState({
      userMaskedInput: toggleMask
    })
    const event = toggleMask ? "INPUT_KEY_MASK_ENABLED" : "INPUT_KEY_MASK_DISABLED"
    uiController.onKeyboardInput(null, event);
  }

  replaceSpecialCharacters(keyboardLayout, characters) {
    var layout = keyboardLayout.default;
    var customCharacters = characters;
    //Special characters on root level of supported keyboards
    var replaceableChars = '`-=[]\\;\',./^+#<&(_)$:!@';
    for (var rowIndex = 0; rowIndex < layout.length; rowIndex++) {
      // Loop through rows
      var row = layout[rowIndex];
      for (var charIndex = 0; (charIndex < row.length) && customCharacters.length > 0; charIndex++) {
        // Loop through characters
        var char = row.charAt(charIndex);
        // todo check how charAt handles special characters like \u00DF
        if (char === " ") {
          continue;
        }
        if (replaceableChars.includes(char)) {
          // Replace special character with next custom character
          var subStr1 = row.substr(0, charIndex);
          var subStr2 = row.substr(charIndex + 1);            
          row = subStr1 + customCharacters.shift() + subStr2;
        }
      }
      layout[rowIndex] = row;
    }
    keyboardLayout.default = layout;
    return keyboardLayout;
  }

  render() {
    const state = store.getState()
    const app = state.ui[state.activeApp]
    // Assign keyboard properties once so they do not change while in view
    if (app && Object.keys(this.keyboardProperties).length === 0) {
      this.appID = state.activeApp;
      this.interactionId = app.interactionId;
      this.keyboardProperties = JSON.parse(JSON.stringify(app.keyboardProperties));
      if (this.keyboardProperties) {
        if (this.keyboardProperties.keyboardLayout) {
          switch(this.keyboardProperties.keyboardLayout) {
            case "QWERTY":
              break
            case "QWERTZ":
              this.keyboardLayout = JSON.parse(JSON.stringify(QWERTZ));
              break
            case "AZERTY":
              this.keyboardLayout = JSON.parse(JSON.stringify(AZERTY));
              break
            case "NUMERIC":
              this.keyboardLayout = JSON.parse(JSON.stringify(NUMERIC));
              this.keyboardClass += " numeric"
              break
            default:
              break
          }
        }
        if (this.keyboardProperties.customKeys && 
            this.keyboardProperties.customKeys.length) {
          this.keyboardLayout = this.replaceSpecialCharacters(
            this.keyboardLayout, this.keyboardProperties.customKeys)
        }
        if (this.keyboardProperties.maskInputCharacters === "ENABLE_INPUT_KEY_MASK") {
          this.maskedInput = true
        } else if (this.keyboardProperties.maskInputCharacters === "USER_CHOICE_INPUT_KEY_MASK") {
          this.showUserMaskOption = true
          this.setState({userMaskedInput: true});
        }
      }
    }

    // These keyboard properties must change while keyboard is in view
    var limitedCharacterList = "";
    if (this.props.limitedCharacterList) {
      // limitedCharacterList is not case sensitive
      const lowerCase = this.props.limitedCharacterList.map(character => character.toLowerCase());
      const upperCase = this.props.limitedCharacterList.map(character => character.toUpperCase());
      const fullSetLimitedCharacterList = lowerCase.concat(upperCase);
      const constKeys = ["{bksp}", "{tab}", "{lock}", "{shift}", "{space}", "{enter}"];
      var concatLayouts = this.keyboardLayout.default.concat(this.keyboardLayout.shift);
      limitedCharacterList = concatLayouts.join(" ");
      // Prevent important keys from being disabled
      for (const key of constKeys) {
        limitedCharacterList = limitedCharacterList.replaceAll(key, "");
      }
      // Apply app requested character set
      for (const letter of fullSetLimitedCharacterList) {
        limitedCharacterList = limitedCharacterList.replaceAll(letter, "");
      }
      // Remove extra spaces
        limitedCharacterList = limitedCharacterList.replaceAll("  ", " ");
    }

    var autoCompleteWord = "";
    var autoCompleteWordObj = {};
    var autoCompleteList = [];
    if (this.props.autoCompleteList && this.props.autoCompleteList.length > 0) {
      const currentWord = this.state.input.split(" ").pop();
      for (const word of this.props.autoCompleteList) {
        if (currentWord.length > 0 && word.startsWith(currentWord) && currentWord.length !== word.length) {
          // Matched a potential autocomplete
          autoCompleteWord = word.substr(currentWord.length)
          // Prevents the loop from overwriting the value passed to the click handler
          autoCompleteWordObj[word] = autoCompleteWord; 
          autoCompleteList.push(
            <div 
              className="auto-complete-list-item" key={"auto-complete-" + word}
              onClick={() => {this.handleAutoComplete(autoCompleteWordObj[word])}}
            >
              { word }
            </div>
          );
        }
      }
    }
    
    var backLink = "/";
    if (app && app.isPerformingInteraction) {
        backLink = app.displayLayout;
    }

    var interactionText = app && app.interactionText && app.interactionText.fieldText ? 
      app.interactionText.fieldText : "Tap on the virtual keyboard to start";

    var parsedInput = this.state.input.replaceAll("\t", "        ");
    var calculatedInputSize = parsedInput ? parsedInput.length : interactionText.length;

    var inputClassName = "div-input"
    if (parsedInput.length && (this.maskedInput || this.state.userMaskedInput)) {
      inputClassName += " text-security"
    }

    // Displaying choice sets
    var choiceSetList = null;
    if (app?.interactionLayout === "ICON_WITH_SEARCH") {
      choiceSetList = (<HSubMenu filterText={parsedInput}/>);
    } else if (app?.interactionLayout === "LIST_WITH_SEARCH") {
      choiceSetList = (<VSubMenu filterText={parsedInput}/>);
    }

    var withSearch = ""
    if (choiceSetList) {
      withSearch = " with-search"
    }    

    return (
        <div>
            <AppHeader backLink={backLink} menuName="Back"/>
            <div className="keyboard">
                <div className="input-row">
                    <div className={"input-text"+withSearch} ref={r => (this.groupInputRef = r)}>
                      <div
                          className={inputClassName}
                          ref={r => (this.inputRef = r)}
                          style={{width: (calculatedInputSize+0.1) + "ch"}}
                      >
                        {parsedInput.length ? parsedInput : interactionText}
                      </div>
                    </div>

                    <input 
                        className="mask-checkbox"
                        id="maskOption"
                        type={this.showUserMaskOption ? "checkbox" : "hidden"} 
                        onClick={this.handleUserMask}
                        defaultChecked={this.showUserMaskOption}
                    />
                    <label 
                        for="maskOption" 
                        className="mask-checkbox mask-option-label"
                        style={{display: this.showUserMaskOption ? 'inline' : 'none' }}
                    >
                        Mask Input
                    </label>
                </div>
                { choiceSetList }
                <div className="auto-complete-list">
                  { autoCompleteList }
                </div>
                <SimpleKeyboard
                    keyboardRef={r => (this.keyboard = r)}
                    layoutName={this.state.layoutName}
                    layout={this.keyboardLayout}
                    onChange={this.onChange}
                    onKeyPress={this.onKeyPress}
                    theme={this.keyboardClass}
                    buttonTheme={limitedCharacterList && [
                      {
                        class: "hg-button-disabled",
                        buttons: limitedCharacterList
                      }
                    ]}
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

const NUMERIC = {
  default: ["1 2 3", "4 5 6", "7 8 9", "{shift} 0 {enter}", "{bksp}"],
  shift: ["! / #", "$ % ^", "& * (", "{shift} ) +", "{bksp}"]
};

const mapStateToProps = (state) => {
  var activeApp = state.activeApp;
  var app = state.ui[activeApp];
  if (!app || !app.keyboardProperties) {
    return {}
  }
  return {
    limitedCharacterList: app.keyboardProperties.limitedCharacterList,
    autoCompleteList: app.keyboardProperties.autoCompleteList
  }
}

export default connect(
  mapStateToProps
)(Keyboard)
