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

    return {
        startDate: startDate,
        endDate: endDate,
        updateMode: app.updateMode,
        now: app.updateTime
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