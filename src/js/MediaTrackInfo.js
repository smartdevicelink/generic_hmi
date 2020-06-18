import React from 'react';

export default class MediaTrackInfo extends React.Component {
    componentDidMount() {
        clearInterval(this.interval)
        this.interval = setInterval(this.forceUpdate.bind(this), 1000)
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
    render() {
        var startDate = this.props.startDate
        var endDate = this.props.endDate
        var now = this.props.pauseTime ? this.props.pauseTime : new Date().getTime()
        switch (this.props.updateMode) {
            case "PAUSE":
                clearInterval(this.interval)
                break        
            case "RESUME":
            case "COUNTUP":
            case "COUNTDOWN":
                clearInterval(this.interval)
                this.interval = setInterval(this.forceUpdate.bind(this), 1000)
                break
            case "CLEAR":
                return null
            default:
                break;
        }
        if (startDate) {
            var timeSince = null;
            if (this.props.countDirection === "COUNTDOWN") {
                timeSince = new Date(now - this.props.updateTime)
                var position = new Date(startDate - timeSince)

                // Clamp position to timer bounds
                position = endDate && position < endDate ? endDate : position
                var endTime = ""
            }
            else {
                timeSince = new Date(startDate.getTime() + now - this.props.updateTime)
                // Clamp position to timer bounds
                position = endDate && timeSince > endDate ? endDate : timeSince

                // If the numbers are less than 10 put a 0 in front of them
                var endHours = endDate.getHours() < 10 ? "0" + endDate.getHours() : endDate.getHours()
                var endMins = endDate.getMinutes() < 10 ? "0" + endDate.getMinutes() : endDate.getMinutes()
                var endSecs = endDate.getSeconds() < 10 ? "0" + endDate.getSeconds() : endDate.getSeconds()
                endTime = "/ " + endHours + ":" + endMins + ":" + endSecs
                if(endHours === "00" && endMins === "00" && endSecs === "00") {
                    endTime = ""
                }
            }

            var startHours = position.getHours() < 10 ? "0" + position.getHours() : position.getHours()
            var startMins = position.getMinutes() < 10 ? "0" + position.getMinutes() : position.getMinutes()
            var startSecs = position.getSeconds() < 10 ? "0" + position.getSeconds() : position.getSeconds()
            var startTime = startHours + ":" + startMins + ":" + startSecs
        } else {
            startTime = null
            endTime = null
        }

        let primaryStyle = {
          color: this.getPrimaryColorScheme()
        }

        return (
            <div className="media-track__time">
                <span className="t-small t-medium th-f-accent-color" style={primaryStyle}>{startTime} </span><span className="t-small t-medium th-f-color-alt">{endTime}</span>
            </div>
        )
    }
}
