import { connect } from 'react-redux'
import OnScreenPresetButtonsBody from '../Templates/Shared/PresetButtonsBody'
import uiController from '../Controllers/UIController'

const staticPresetNames = [
    "PRESET_0",
    "PRESET_1",
    "PRESET_2",
    "PRESET_3",
    "PRESET_4",
    "PRESET_5"
];

const mapStateToProps = (state) => {
    var activeApp = state.activeApp;
    var appUI = {};
    var subscribedButtons = [];
    var presetStrings = [];
    var presets = [];
    if (activeApp) {
        appUI = state.ui[activeApp];
        subscribedButtons = appUI.subscribedButtons;
        presetStrings = appUI.customPresets;
    }

    for (var i=0; i<staticPresetNames.length; i++) {
        var name = staticPresetNames[i];
        if (!subscribedButtons[name]) {
            // Preset button is not subscribed to, skip
            continue;
        }
        var label = "";
        if (presetStrings[i]) {
            label = presetStrings[i];
        } else {
            label = "Preset " + i.toString();
        }
        presets.push({
            label: label,
            name: name
        })
    }

    //Assign color scheme to props
    var theme = state.theme
    var colorScheme = null;
    if (theme === true) { //Dark theme
        if(appUI.nightColorScheme) {
            colorScheme = {}
            if(appUI.nightColorScheme.primaryColor) {
                colorScheme["primary"] = appUI.nightColorScheme.primaryColor
            }
            if(appUI.nightColorScheme.secondaryColor) {
                colorScheme["secondary"] = appUI.nightColorScheme.secondaryColor
            }
        }
    } else {
        if(appUI.dayColorScheme) { //Light theme
            colorScheme = {}
            if(appUI.dayColorScheme.primaryColor) {
                colorScheme["primary"] = appUI.dayColorScheme.primaryColor
            }
            if(appUI.dayColorScheme.secondaryColor) {
                colorScheme["secondary"] = appUI.dayColorScheme.secondaryColor
            }
        }
    }

    return {
        presets: presets,
        appID: activeApp,
        theme: state.theme,
        colorScheme: colorScheme
    }
}

var presetsTimeoutMap = {};

const onLongButtonPress = (appID, presetName) => {
    // int cast to string to index json object
    var appIDStr = appID.toString();
    if (presetsTimeoutMap[appIDStr].hasOwnProperty(presetName) 
        && presetsTimeoutMap[appIDStr][presetName]) {
            presetsTimeoutMap[appIDStr][presetName] = null;
        uiController.onLongButtonPress(appID, undefined, presetName);
    }    
}

const mapDispatchToProps = (dispatch) => {
    return {
        onButtonDown: (appID, presetName) => {
            // int cast to string to index json object
            var appIDStr = appID.toString();
            presetsTimeoutMap[appIDStr] = presetsTimeoutMap[appIDStr] ? presetsTimeoutMap[appIDStr] : {};
            // Save timeout to clear later
            presetsTimeoutMap[appIDStr][presetName] = setTimeout(onLongButtonPress, 3000, appID, presetName);
            uiController.onButtonEventDown(appID, undefined, presetName);
        },
        onButtonUp: (appID, presetName) => {
            // int cast to string to index json object
            var appIDStr = appID.toString();
            if (presetsTimeoutMap[appIDStr][presetName]) {
                // Short press, clear long press timeout
                clearTimeout(presetsTimeoutMap[appIDStr][presetName]);
                presetsTimeoutMap[appIDStr][presetName] = null;
                uiController.onShortButtonPress(appID, undefined, presetName)
            }
            uiController.onButtonEventUp(appID, undefined, presetName);
            delete presetsTimeoutMap[appIDStr][presetName];
            
        },
        onButtonPress: (appID, presetName) => {
            uiController.onButtonPress(appID, undefined, presetName)
        }
    }
}

export const PresetButtons = connect(
    mapStateToProps,
    mapDispatchToProps
)(OnScreenPresetButtonsBody)
