import React from 'react';
import { withRouter } from 'react-router';
import WeatherButton from "./WeatherButton";
import MediaServiceDataImage from "./MediaServiceDataImage";
import NavInstructionImage from "./NavInstructionImage";
import {ReactComponent as ExpandIcon} from '../img/app_services/expand.svg';
import {ReactComponent as CollapseIcon} from '../img/app_services/collapse.svg';
import AppServiceMediumModal from './AppServiceMediumModal';
import Modal from 'react-modal';

class AppServicesNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            time: "",
            activeServiceTab: "",
            showModal: false
        };
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal})
    }

    setActive(type) {
        var active = this.state.activeServiceTab
        if (type === active) {
            this.setState({activeServiceTab : ""});
        } else {
            this.setState({activeServiceTab : type});
        }
    }

    getTime() {
        var d = new Date();
        var hours = d.getHours();
        var minutes = d.getMinutes();
        hours = (hours < 10) ? ("0" + hours) : hours;
        minutes = (minutes < 10) ? ("0" + minutes) : minutes;

        return hours + ":" + minutes + " pm";
    }

    render() {
        if (!this.props.appServicesEnabled) {
            return null
        }
        var activeServices = this.props.activeServices
        var activeTypes = Object.keys(activeServices)
        var navActive = false
        var mediaActive = false
        var weatherActive = false
        var mediaData = {
            artist: "",
            track: "",
            album: "",
            image: null
        }

        var navData = {
            location: null,
            actionBearing: null,
            distance: null,
            nextActionBearing: null,
            image: null
        }
        var weatherData = {
            high: null,
            low: null,
            precipProbability: null,
            windMPH: null,
            current: null,
            weatherIcon: null
        }

        var waitingMessage = "Waiting for data...";
        var navMissingData = false;
        var mediaMissingData = false;
        var weatherMissingData = false;
        var serviceData = null;
        for (const key of activeTypes) {
            if (key === "NAVIGATION") {
                navActive = true
                serviceData = activeServices["NAVIGATION"].serviceData
                if (!serviceData) {
                    // Service published, but no data available
                    navMissingData = true;
                    continue;
                }
                navData = {
                  location: serviceData.location,
                  actionBearing: serviceData.actionBearing,
                  distance: serviceData.distance,
                  nextActionBearing: serviceData.nextActionBearing,
                  image: serviceData.image
                }
            } else if (key === "MEDIA") {
                mediaActive = true
                serviceData = activeServices["MEDIA"].serviceData
                if (!serviceData) {
                    // Service published, but no data available
                    mediaMissingData = true;
                    continue;
                }
                mediaData = {
                    artist: serviceData.mediaArtist,
                    title: serviceData.mediaTitle,
                    album: serviceData.mediaAlbum,
                    mediaImage: serviceData.mediaImage ? serviceData.mediaImage : null
                }
            } else if (key === "WEATHER") {
                weatherActive = true
                serviceData = activeServices["WEATHER"].serviceData
                if (!serviceData || !serviceData.currentForecast) {
                    weatherMissingData = true;
                    continue;
                }

                var currentForecast = serviceData.currentForecast
                
                weatherData = {
                    high: currentForecast.temperatureHigh ? currentForecast.temperatureHigh.value: 0,
                    low: currentForecast.temperatureLow ? currentForecast.temperatureLow.value : 0,
                    precipProbability: currentForecast.precipProbability *100,
                    windMPH: currentForecast.windSpeed,
                    currentTemperature: currentForecast.currentTemperature ? currentForecast.currentTemperature.value : 0,
                    weatherIcon: currentForecast.weatherIcon ? currentForecast.weatherIcon : null
                }
            }
        }

        var activeServiceTab = this.state.activeServiceTab;
        var themeClass = this.props.theme ? 'dark-theme dark-shadow' : 'light-theme light-shadow';

        // If there is no service data present, hide option to expand medium view.
        var hideExpandButton = (navMissingData || !navActive) && 
            (mediaMissingData || !mediaActive) && 
            (weatherMissingData || !weatherActive);
        
        return (
            <div className="app-services-nav th-nav-background-color">
                <div className="clock">
                    <p className="t-small t-medium th-f-color">
                        {this.state.time}
                    </p>
                </div>
                <div className="app-services-button-group">
                    <div className={"app-services-tab " + 
                        ((activeServiceTab === "nav") ? "tab-wide__nav" : "") + 
                        (navActive ? "" : " hide-tab")}
                        onClick={() => this.setActive("nav")}>
                        <NavInstructionImage image={navData.image} theme={undefined} parent="nav-bar"/>
                        <div className={"t-small t-medium th-f-color tab-text " + ((activeServiceTab === "nav") ? "" : "hide-tab")}>
                            <p className={navMissingData ? "waiting-message" : "hide-tab"}>
                                {navMissingData ? waitingMessage : null}
                            </p>
                            <p className={navMissingData ? "hide-tab" : ""}>
                                {navData.location}
                            </p>
                            <p className={navMissingData ? "hide-tab" : "t-light"}>
                                {navData.actionBearing}
                            </p>
                            <p className={navMissingData ? "hide-tab" : "t-light"}>
                                |
                            </p>
                            <p className={navMissingData ? "hide-tab" : "t-light"}>
                                {navData.distance ? navData.distance + " mi" : ""}
                            </p>
                        </div>
                    </div>
                    <div className={"app-services-tab " + 
                        ((activeServiceTab === "media") ? "tab-wide__media" : "") + 
                        (mediaActive ? "" : " hide-tab")}
                        onClick={() => this.setActive("media")}>
                        <MediaServiceDataImage image={mediaData.mediaImage} />
                        <div className={"t-small t-medium th-f-color tab-text " + ((activeServiceTab === "media") ? "" : "hide-tab")}>
                            <p className={mediaMissingData ? "waiting-message" : "hide-tab"}>
                                {mediaMissingData ? waitingMessage : null}
                            </p>
                            <p className={mediaMissingData ? "hide-tab" : ""}>
                                {mediaData.artist}
                            </p>
                            <p className={mediaMissingData ? "hide-tab" : "t-light"}>
                                {mediaData.title}
                            </p>
                        </div>
                    </div>
                    <div className={"app-services-tab " + 
                        ((activeServiceTab === "weather") ? "tab-wide__weather" : "") + 
                        (weatherActive ? "" : " hide-tab")}
                        onClick={() => this.setActive("weather")}>
                        <WeatherButton temp={weatherData.currentTemperature} weatherIcon={weatherData.weatherIcon}/>
                        <div className={"t-small t-medium th-f-color tab-text even-spacing " + ((activeServiceTab === "weather") ? "" : "hide-tab")}>
                            <p className={weatherMissingData ? "waiting-message" : "hide-tab"}>
                                {weatherMissingData ? waitingMessage : null}
                            </p>
                            <div className={(weatherMissingData || !(weatherData.high && weatherData.low)) ? "hide-tab" : "weather-item"}>
                                <p>
                                    {weatherData.high && weatherData.low ? weatherData.high + "°" : null}
                                </p>
                                <p className="t-light">
                                    {weatherData.high && weatherData.low ? "/ " + weatherData.low + "°" : null}
                                </p>
                            </div>
                            <div className={weatherMissingData || !weatherData.precipProbability ? "hide-tab" : "weather-item"}>
                                <p>
                                    {weatherData.precipProbability ? weatherData.precipProbability + "% " : null}
                                </p>
                                <p className="t-light">
                                    {weatherData.precipProbability ? "prec." : null}
                                </p>
                            </div>
                            <div className={weatherMissingData || !weatherData.windMPH ? "hide-tab" : "weather-item width-40-pct "}>
                                <p>
                                    {weatherData.windMPH ? weatherData.windMPH + "mph " : null}
                                </p>
                                <p className="t-light">
                                    {weatherData.windMPH ? "wind" : null}
                                </p>
                            </div>
                        </div>
                        
                    </div>                 
                    
                </div>
                <div className="clock">
                    <div className={hideExpandButton ? "hide-tab" : "app-service-modal-button"} onClick={() =>this.toggleModal()}>
                        <span className={hideExpandButton ? "hide-tab" : "svg-size"} >
                            {this.state.showModal ? <CollapseIcon/> : <ExpandIcon/>}
                        </span> 
                    </div>
                </div>
                <Modal 
                    isOpen={this.state.showModal}
                    className="app-service-modal th-nav-background-color"
                    overlayClassName={themeClass + " app-service-overlay"}
                    contentLabel="App Service Modal">
                    <AppServiceMediumModal weatherData={weatherData} 
                        mediaData={mediaData} 
                        navData={navData}
                        weatherActive={weatherActive}
                        mediaActive={mediaActive}
                        navActive={navActive}
                        theme={this.props.theme}/>    
                </Modal>
            </div>
        )
    }
    componentWillReceiveProps (nextProps) {

    }

    componentDidMount() {
        this.setState({ time: this.getTime() });
        this.interval = setInterval(() => this.setState({ time: this.getTime() }), 60000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }
}

export default withRouter(AppServicesNav)