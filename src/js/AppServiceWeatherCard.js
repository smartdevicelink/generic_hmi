import React from 'react';
import WeatherServiceImage from './WeatherServiceImage';

export default class AppServiceWeatherCard extends React.Component {
    render() {
        if (!this.props.weatherActive || !this.props.weatherData) {
            return null;
        }
        var weatherData = this.props.weatherData;

        var currentLine = weatherData.currentTemperature ? (
            <div className="weather-line t-large">
                <p className="t-medium">
                    {weatherData.currentTemperature.toFixed(0) + "°"}
                </p>
            </div>
        ) : null;

        var highLowLine = weatherData.high && weatherData.low ? (
            <div className="weather-line t-large">
                <p className="t-medium">
                    {weatherData.high.toFixed(0) + "°"}
                </p>
                <p className="t-light space-left">
                    {"/ " + weatherData.low.toFixed(0) + "°"}
                </p>
            </div>
        ) : null;

        var precipProbabilityLine = weatherData.precipProbability ? (
            <div className="weather-line">
                <p className="t-medium t-large">
                    {weatherData.precipProbability.toFixed(0)}
                </p>
                <p className="t-light t-small">
                    % prec.
                </p>
            </div>
        ) : null;

        var windMPHLine = weatherData.windMPH ? (
            <div className="weather-line baseline">
                <p className="t-medium t-large">
                    {weatherData.windMPH.toFixed(0)}
                </p>
                <p className="t-small t-medium ">
                    mph
                </p>
                <p className="t-light space-left t-small">
                    wind
                </p>
            </div>
        ) : null;

        return (
            <div className="app-service-weather-card app-service-medium-tab th-f-color">
                <WeatherServiceImage image={weatherData.weatherIcon}/> 
                {currentLine}
                {highLowLine}
                {precipProbabilityLine}
                {windMPHLine}
                <p className="app-service-card-footer">
                    WEATHER
                </p>
            </div>
        )
    }
}