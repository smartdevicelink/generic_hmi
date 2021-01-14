import React from 'react';

export default class ProgressBar extends React.Component {
    componentDidMount() {
        clearInterval(this.interval)
        this.interval = setInterval(this.forceUpdate.bind(this), 50)
    }
    componentWillUnmount() {
        clearInterval(this.interval)
    }
    getPrimaryColorScheme() {
        if (this.props.colorScheme) {
            if (this.props.colorScheme.primaryColor) {
                var redInt = this.props.colorScheme.primaryColor.red;
                var blueInt = this.props.colorScheme.primaryColor.blue;
                var greenInt = this.props.colorScheme.primaryColor.green;
                var cssColorScheme = `rgb(${redInt}, ${greenInt}, ${blueInt})`
                return cssColorScheme;
            }
        }
        return null;
    }
    getSecondaryColorScheme() {
        if (this.props.colorScheme) {
            if (this.props.colorScheme.secondaryColor) {
                var redInt = this.props.colorScheme.secondaryColor.red;
                var blueInt = this.props.colorScheme.secondaryColor.blue;
                var greenInt = this.props.colorScheme.secondaryColor.green;
                var cssColorScheme = {
                    backgroundColor: `rgb(${redInt}, ${greenInt}, ${blueInt})`
                }
                return cssColorScheme;
            }
        }
        return null;
    }
    render() {
        var startDate = this.props.startDate
        var endDate = this.props.endDate
        var now = this.props.pauseTime ? this.props.pauseTime : new Date().getTime()
        switch (this.props.updateMode) {
            case "PAUSE":
            case "CLEAR":
                clearInterval(this.interval)
                break        
            case "RESUME":
            case "COUNTUP":
            case "COUNTDOWN":
                clearInterval(this.interval)
                this.interval = setInterval(this.forceUpdate.bind(this), 50)
                break
            default:
                break
        }

        if (this.props.countDirection === "COUNTDOWN") {
            var timeSince = new Date((now - this.props.updateTime) * this.props.countRate)
            var position = new Date(startDate - timeSince)
            position = position < endDate ? endDate : position
            var endPosition = startDate
        }
        else {
            timeSince = new Date(startDate.getTime() + ((now - this.props.updateTime) * this.props.countRate))
            position = timeSince > endDate ? endDate : timeSince
            endPosition = endDate
        }

        let progressStyle = {
            width: this.percentage(position, endPosition) + "%",
            backgroundColor: this.getPrimaryColorScheme()
        }

        return (
            <div className="progress-bar th-bg-color th-bb-color" style={this.getSecondaryColorScheme()}>
                <div className="progress-bar__progress" style={ progressStyle } ></div>
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
