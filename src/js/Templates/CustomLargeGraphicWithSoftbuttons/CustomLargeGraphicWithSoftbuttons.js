import React from 'react';

import AppHeader from '../../containers/Header';
import { LargeGraphic } from '../../containers/Metadata';
import { SoftButtons } from '../../containers/Buttons';
import { TabMenu } from '../../containers/Menu';
import { connect } from 'react-redux';

class CustomLargeGraphicWithSoftbuttons extends React.Component {
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
            <div style={{position: "relative"}}>
                <AppHeader backLink="/" menuName="Apps" disableColor={true} disableTemplateTitle={true} disableMenu={true}/>
                <div className="custom-large-graphic-with-softbuttons-template" >
                    <TabMenu />
                    <LargeGraphic class="custom-large-graphic-with-softbuttons-top-container"/>
                </div>
                <SoftButtons class="custom-large-graphic-with-softbuttons-bottom-container"/>
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

export default connect(mapStateToProps)(CustomLargeGraphicWithSoftbuttons);