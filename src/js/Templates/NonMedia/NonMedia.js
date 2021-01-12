import React from 'react';
import { connect } from 'react-redux'
import AppHeader from '../../containers/Header';
import { NonMediaMetadata } from '../../containers/Metadata';
import { SoftButtons } from '../../containers/Buttons';
import store from '../../store';
import { systemNonMediaViewActive, systemNonMediaViewInctive } from '../../actions';

class NonMedia extends React.Component {
    componentWillMount() {
        store.dispatch(systemNonMediaViewActive());
    }

    componentWillUnmount() {
        store.dispatch(systemNonMediaViewInctive());
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
            <div className="non-media-template" style={this.getColorScheme()}>
                <AppHeader backLink="/" menuName="Apps"/>
                <NonMediaMetadata />
                <SoftButtons class="non-media"/>
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

export default connect(mapStateToProps)(NonMedia);