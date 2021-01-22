import { connect } from 'react-redux'
import ProgressBar from '../ProgressBar'

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var app = state.ui[activeApp] ? state.ui[activeApp] : {}
    // TODO: this is creating startTime and endTime if they don't exist
    // if we want to support something dynamic like not including endTime if it's not given to the component, we should remove this
    var startTime = app.startTime ? app.startTime : {
        hours: 0,
        minutes: 0,
        seconds: 0
    }
    var endTime = app.endTime ? app.endTime : {
        hours: 0,
        minutes: 0,
        seconds: 0
    }
    var startDate = new Date(0, 0, 0, startTime.hours, startTime.minutes, startTime.seconds, 0)
    var endDate = new Date(0, 0, 0, endTime.hours, endTime.minutes, endTime.seconds, 0)
    var offset = app.timerOffset

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
        countDirection: app.countDirection,
        countRate: app.countRate,
        updateTime: app.updateTime,
        offset: offset,
        paused: app.paused,
        colorScheme: colorScheme
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

const Container = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProgressBar)

export default Container