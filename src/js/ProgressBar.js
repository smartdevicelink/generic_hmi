import React from 'react';

export default class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.interval = setInterval(this.forceUpdate.bind(this), 50)
    }
    componentWillUnmount() {
        clearInterval(this.interval)
    }
    render() {
        var startDate = this.props.startDate
        var endDate = this.props.endDate
        var now = new Date().getTime()
        // TODO: support more than just COUNTUP, move intervals and what not over here
        switch (this.props.updateMode) {
            case "PAUSE":
                clearInterval(this.interval)
                break        
            case "RESUME":
            case "COUNTUP":
                clearInterval(this.interval)
                this.interval = setInterval(this.forceUpdate.bind(this), 50)
                break
        }
        var timeSince = new Date(startDate.getTime() + now - this.props.now)

        let progress = {
            width: this.percentage(timeSince, endDate) + "%"
        }

        return (
            <div className="progress-bar th-bg-color th-bb-color">
                <div className="progress-bar__progress" style={ progress }></div>
            </div>
        )
    }
    percentage (progress, end) {
        var msProgress = progress.getHours() * 3600000 + progress.getMinutes() * 60000 + progress.getSeconds() * 1000 + progress.getMilliseconds()
        var msEnd = end.getHours() * 3600000 + end.getMinutes() * 60000 + end.getSeconds() * 1000 + end.getMilliseconds()
        if (msProgress >= msEnd) {
            return 100
        }
        if (msEnd === 0) {
            return 0
        }
        return (msProgress / msEnd) * 100
    }
}
