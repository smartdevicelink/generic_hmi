import React from 'react';

export default class MediaTrackInfo extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        clearInterval(this.interval)
        this.interval = setInterval(this.forceUpdate.bind(this), 1000)
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
                this.interval = setInterval(this.forceUpdate.bind(this), 1000)
                break
        }
        var timeSince = new Date(startDate.getTime() + now - this.props.now)
        // If the numbers are less than 10 put a 0 in front of them
        var startHours = timeSince.getHours() < 10 ? "0" + timeSince.getHours() : timeSince.getHours()
        var startMins = timeSince.getMinutes() < 10 ? "0" + timeSince.getMinutes() : timeSince.getMinutes()
        var startSecs = timeSince.getSeconds() < 10 ? "0" + timeSince.getSeconds() : timeSince.getSeconds()
        var endHours = endDate.getHours () < 10 ? "0" + endDate.getHours() : endDate.getHours()
        var endMins = endDate.getMinutes() < 10 ? "0" + endDate.getMinutes() : endDate.getMinutes()
        var endSecs = endDate.getSeconds() < 10 ? "0" + endDate.getSeconds() : endDate.getSeconds()
        var startTime = startHours + ":" + startMins + ":" + startSecs
        var endTime = "/ " + endHours + ":" + endMins + ":" + endSecs
        if(endHours == "00" && endMins == "00" && endSecs == "00") {
            endTime = ""
        }
        return (
            <div className="media-track__time">
                <span className="t-small t-medium fc-bright-blue">{startTime} </span><span className="t-small t-medium fc-slate">{endTime}</span>
            </div>
        )
    }
}
