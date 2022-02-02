import React from 'react';
import { connect } from 'react-redux';
import AppHeader from '../../containers/Header';
import { PresetButtons } from '../../containers/PresetButtons';
import { MediaMetadata } from '../../containers/Metadata';
import { Buttons } from '../../containers/Buttons';
import ProgressBar from '../../containers/ProgressBar_c';

class OnScreenPresets extends React.Component {
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
        return (
            <div className="on-screen-presets" style={this.getColorScheme()}>
                <AppHeader backLink="/" menuName="Apps"/>
                <MediaMetadata />
                <ProgressBar />
                <Buttons />
                <PresetButtons class="on-screen-presets-container"/>
            </div>
        )
    }
}

const mapStateToProps = (state) => { 
    return { 
        activeApp: state.activeApp,
        theme: state.theme,
        ui: state.ui     
    };
};

export default connect(mapStateToProps)(OnScreenPresets);