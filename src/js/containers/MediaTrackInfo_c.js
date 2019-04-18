import { connect } from 'react-redux'
import MediaTrackInfo from '../MediaTrackInfo'

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var app = state.ui[activeApp] ? state.ui[activeApp] : {}
    // TODO: this is creating startTime and endTime if they don't exist
    // if we want to support something dynamic like not including endTime if it's not given to the component, we should remove this
    var startTime = app.startTime ? app.startTime : null;
    var endTime = app.endTime ? app.endTime : {
        hours: 0,
        minutes: 0,
        seconds: 0
    }
    var startDate = startTime ? new Date(0, 0, 0, startTime.hours, startTime.minutes, startTime.seconds, 0) : null
    var endDate = new Date(0, 0, 0, endTime.hours, endTime.minutes, endTime.seconds, 0)

    //Assign color scheme to props
    var theme = state.theme
    var colorScheme = {};
    if (theme === true) { //Dark theme
        if(app.nightColorScheme) {
            if(app.nightColorScheme.secondaryColor) {
                colorScheme.secondaryColor = app.nightColorScheme.secondaryColor
            }
            if(app.nightColorScheme.primaryColor) {
                colorScheme.primaryColor = app.nightColorScheme.primaryColor
            }
        }
    } else {
        if(app.dayColorScheme) { //Light theme
            if(app.dayColorScheme.secondaryColor) {
                colorScheme.secondaryColor = app.dayColorScheme.secondaryColor
            }
            if(app.dayColorScheme.primaryColor) {
                colorScheme.primaryColor = app.dayColorScheme.primaryColor
            }
        }
    }

    return {
        startDate: startDate,
        endDate: endDate,
        updateMode: app.updateMode,
        now: app.updateTime,
        colorScheme: colorScheme
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

const Container = connect(
    mapStateToProps,
    mapDispatchToProps
)(MediaTrackInfo)

export default Container