import React from 'react';
import AppServiceNavCard from './AppServiceNavCard';
import AppServiceMediaCard from './AppServiceMediaCard';
import AppServiceWeatherCard from './AppServiceWeatherCard';
import Divider from './Divider';

export default class AppServiceMediumModal extends React.Component {
    render() {
        return (
            <div className="app-service-medium">
                <AppServiceNavCard  navData={this.props.navData} 
                    navActive={this.props.navActive} theme={this.props.theme}/>
                <Divider position={1} navActive={this.props.navActive} mediaActive={this.props.mediaActive} weatherActive={this.props.weatherActive}/>
                <AppServiceMediaCard  mediaData={this.props.mediaData} 
                    mediaActive={this.props.mediaActive} theme={this.props.theme}/>
                <Divider position={2} navActive={this.props.navActive} mediaActive={this.props.mediaActive} weatherActive={this.props.weatherActive}/>
                <AppServiceWeatherCard  weatherData={this.props.weatherData} 
                    weatherActive={this.props.weatherActive} theme={this.props.theme}/>
            </div>
        )
    }
}