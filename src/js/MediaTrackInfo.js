import React from 'react';

export default class MediaTrackInfo extends React.Component {
    componentDidMount() {
        clearInterval(this.interval)
        this.interval = setInterval(this.forceUpdate.bind(this), 10)
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
        var offset = this.props.offset
        var now = new Date().getTime()
        switch (this.props.updateMode) {
            case "PAUSE":
                clearInterval(this.interval)
                break        
            case "RESUME":
            case "COUNTUP":
            case "COUNTDOWN":
                clearInterval(this.interval)
                this.interval = setInterval(this.forceUpdate.bind(this), 1000 / this.props.countRate)
                break
            case "CLEAR":
                return null
            default:
                break;
        }
        if (startDate) {
            var timeSince = new Date((now - this.props.updateTime) * this.props.countRate);
            if (this.props.countDirection === "COUNTDOWN") {
                var startPosition = new Date(startDate.getTime() - offset)
                // Start position is used if paused
                var position = this.props.paused ? startPosition : new Date(startPosition.getTime() - timeSince.getTime())
                // Clamp position to timer bounds
                position = position < endDate ? endDate : position
            }
            else {
                startPosition = new Date(startDate.getTime() + offset)
                // Start position is used if paused
                position = this.props.paused ? startPosition : new Date(startPosition.getTime() + timeSince.getTime())
                // Clamp position to timer bounds
                let isZeroTime = (date) => date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0
                position = !isZeroTime(endDate) && position > endDate ? endDate : position

                var endHours = endDate.getHours().toString().padStart(2, '0')
                var endMins = endDate.getMinutes().toString().padStart(2, '0')
                var endSecs = endDate.getSeconds().toString().padStart(2, '0')
                var endTime = !isZeroTime(endDate) ? ("/ " + endHours + ":" + endMins + ":" + endSecs) : ""
            }

            var startHours = position.getHours().toString().padStart(2, '0')
            var startMins = position.getMinutes().toString().padStart(2, '0')
            var startSecs = position.getSeconds().toString().padStart(2, '0')
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
