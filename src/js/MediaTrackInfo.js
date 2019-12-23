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
        if(startDate) {
            var timeSince =  this.props.updateMode === "PAUSE" ? new Date(startDate.getTime() + this.props.pauseTime - this.props.now) : new Date(startDate.getTime() + now - this.props.now)
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
