import React from 'react';
import WeatherServiceImage from './WeatherServiceImage';

export default class WeatherButton extends React.Component {
    render() {
        if (this.props.temp) {
            return (
                <div className="th-nav-background-color nav-text-bubble"> 
                        <p className="t-small t-medium th-f-color">
                            {this.props.temp + "°"}
                        </p>
                </div>
            )
        }
        var icon = this.props.weatherIcon
        return (<WeatherServiceImage image={icon}/>)
    }
}
