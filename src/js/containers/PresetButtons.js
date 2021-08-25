import { connect } from 'react-redux'
import OnScreenPresetButtonsBody from '../Templates/Shared/PresetButtonsBody'
import uiController from '../Controllers/UIController'

const mapStateToProps = (state) => {
    var activeApp = state.activeApp;
    var appUI = {};
    var presetStrings = [];
    var presets = [];
    if (activeApp) {
        appUI = state.ui[activeApp];
        presetStrings = appUI.customPresets;
    }

    for (var i=0; i<presetStrings.length; i++) {
        presets.push({
            label: presetStrings[i],
            name: "PRESET_" + i.toString(),
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

var presetsMap = {};

const onLongButtonPress = (appID, presetName) => {
    // int cast to string to index json object
    var appIDStr = appID.toString();
    if (presetsMap[appIDStr].hasOwnProperty(presetName) 
        && presetsMap[appIDStr][presetName]) {
            presetsMap[appIDStr][presetName] = null;
        uiController.onLongButtonPress(appID, undefined, presetName);
    }    
}

const mapDispatchToProps = (dispatch) => {
    return {
        onButtonDown: (appID, presetName) => {
            // int cast to string to index json object
            var appIDStr = appID.toString();
            presetsMap[appIDStr] = presetsMap[appIDStr] ? presetsMap[appIDStr] : {};
            // Save timeout to clear later
            presetsMap[appIDStr][presetName] = setTimeout(onLongButtonPress, 3000, appID, presetName);
            uiController.onButtonEventDown(appID, undefined, presetName);
        },
        onButtonUp: (appID, presetName) => {
            // int cast to string to index json object
            var appIDStr = appID.toString();
            if (presetsMap[appIDStr][presetName]) {
                // Short press, clear long press timeout
                clearTimeout(presetsMap[appIDStr][presetName]);
                presetsMap[appIDStr][presetName] = null;
                uiController.onShortButtonPress(appID, undefined, presetName)
            }
            uiController.onButtonEventUp(appID, undefined, presetName);
            delete presetsMap[appIDStr][presetName];
            
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
