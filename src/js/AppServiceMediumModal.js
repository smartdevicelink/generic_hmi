import React from 'react';
import AppServiceNavCard from './AppserviceNavCard';
import AppServiceMediaCard from './AppserviceMediaCard';
import AppServiceWeatherCard from './AppserviceWeatherCard';
import Divider from './Divider';

export default class AppServiceMediumModal extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div className="app-service-medium">
                <AppServiceNavCard  navData={this.props.navData} 
                    navActive={this.props.navActive}/>
                <Divider position={1} navActive={this.props.navActive} mediaActive={this.props.mediaActive} weatherActive={this.props.weatherActive}/>
                <AppServiceMediaCard  mediaData={this.props.mediaData} 
                    mediaActive={this.props.mediaActive}/>
                <Divider position={2} navActive={this.props.navActive} mediaActive={this.props.mediaActive} weatherActive={this.props.weatherActive}/>
                <AppServiceWeatherCard  weatherData={this.props.weatherData} 
                    weatherActive={this.props.weatherActive}/>
            </div>
        )
    }
}