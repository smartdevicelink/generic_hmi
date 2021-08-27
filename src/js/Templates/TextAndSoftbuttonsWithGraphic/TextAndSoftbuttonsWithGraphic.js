import React from 'react';
import { connect } from 'react-redux';
import AppHeader from '../../containers/Header';
import { SoftButtons } from '../../containers/Buttons';
import { LargeGraphic, TextFields } from '../../containers/Metadata';

class GraphicWithTextAndSoftbuttons extends React.Component {
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
            <div>
                <AppHeader backLink="/" menuName="Apps"/>
                <div className="graphic-with-text-and-buttons-template flex-reverse" style={this.getColorScheme()}>
                    <div className="graphic-width-50">
                        <LargeGraphic class="graphic-with-text-and-buttons-container"/>
                    </div>
                    <div className="graphic-with-text-and-buttons-container">
                        <TextFields/>
                        <SoftButtons class="graphic-with-text-and-buttons-bottom-container"/>
                    </div>
                </div>
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

export default connect(mapStateToProps)(GraphicWithTextAndSoftbuttons);