import React from 'react';
import { connect } from 'react-redux';
import AppHeader from '../../containers/Header';
import { LargeGraphic, TextFields } from '../../containers/Metadata';
import { SoftButtons } from '../../containers/Buttons';

class GraphicWithText extends React.Component {
    constructor() {
        super();
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
        return (
            <div>
                <AppHeader backLink="/" menuName="Apps"/>
                <div className="graphic-with-text-template" style={this.getColorScheme()}>
                    <div className="min-width-50">
                        <LargeGraphic class="graphic-with-text-container"/>
                    </div>
                    <div className="graphic-with-text-container">
                        <TextFields/>
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

export default connect(mapStateToProps)(GraphicWithText);