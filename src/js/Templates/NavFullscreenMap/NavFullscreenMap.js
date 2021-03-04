import React from 'react';
import { connect } from 'react-redux'
import AppHeader from '../../containers/Header';
import store from '../../store';
import { systemNavigationViewActive, systemNavigationViewInactive } from '../../actions';

class NavFullscreenMap extends React.Component {
    componentWillMount() {
        store.dispatch(systemNavigationViewActive());
    }

    componentWillUnmount() {
        store.dispatch(systemNavigationViewInactive());
    }

    colorForCss(color) {
        return `rgb(${color.red}, ${color.green}, ${color.blue})`
    }

    getColorScheme() {
        var activeApp = this.props.activeApp
        var colorScheme = {};
        if (activeApp) {
            if (this.props.theme === true) { //Dark Theme
                if (this.props.ui[activeApp].nightColorScheme) {
                    if (this.props.ui[activeApp].nightColorScheme.backgroundColor) {
                        colorScheme.css = { backgroundColor: this.colorForCss(this.props.ui[activeApp].nightColorScheme.backgroundColor) };
                    }
                    if (this.props.ui[activeApp].nightColorScheme.secondaryColor) {
                        colorScheme.secondary = this.colorForCss(this.props.ui[activeApp].nightColorScheme.secondaryColor);
                    }
                }
            } else if (this.props.ui[activeApp].dayColorScheme) { //Light Theme
                if (this.props.ui[activeApp].dayColorScheme.backgroundColor) {
                    colorScheme.css = { backgroundColor: this.colorForCss(this.props.ui[activeApp].dayColorScheme.backgroundColor) };
                }
                if (this.props.ui[activeApp].dayColorScheme.secondaryColor) {
                    colorScheme.secondary = this.colorForCss(this.props.ui[activeApp].dayColorScheme.secondaryColor);
                }
            }
        }

        return colorScheme;
    }

    render() {
        const colors = this.getColorScheme();
        return (
            <div className="nav-template" style={colors.css}>
                <AppHeader backLink="/" menuName="Apps"/>
                {
                    this.props.ui[this.props.activeApp].hapticRects.map((h) => (
                        <div style={{
                            position: 'absolute',
                            left: h.rect.x,
                            top: h.rect.y + 75,
                            width: h.rect.width,
                            height: h.rect.height,
                            zIndex: 1002,
                            borderStyle: 'solid',
                            borderRadius: 1,
                            borderColor: colors.secondary ?? '#ff0000'
                        }}></div>))
                }
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

export default connect(mapStateToProps)(NavFullscreenMap);