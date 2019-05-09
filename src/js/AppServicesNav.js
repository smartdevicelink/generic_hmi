import React from 'react';
import { Link, withRouter } from 'react-router';
import weatherIcon from "../img/app_services/weather.svg";
import mediaIcon from "../img/app_services/media.svg";
import navIcon from "../img/app_services/navigation.svg";
import iconMenu from '../img/icons/icon-menu.svg';

class AppServicesNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            time: "",
            activeServiceTab: ""
        };
    }

    setActive(type) {
        console.log("Set Active " + type)
        var active = this.state.activeServiceTab
        if (type == active) {
            this.setState({activeServiceTab : ""});
        } else {
            this.setState({activeServiceTab : type});
        }
    }

    getTime() {
        console.log("getTime")
        var d = new Date();
        var hours = d.getHours();
        var minutes = d.getMinutes();
        hours = (hours < 10) ? ("0" + hours) : hours;
        minutes = (minutes < 10) ? ("0" + minutes) : minutes;

        var offset = d.getTimezoneOffset();
        return hours + ":" + minutes + " pm";
    }

    render() {
        console.log("RENDER")
        if (!this.props.appServicesEnabled) {
            return null
        }
        console.log(this.props.activeServices)
        var activeServices = this.props.activeServices
        var activeTypes = Object.keys(activeServices)
        var navActive = false
        var mediaActive = false
        var weatherActive = false
        for (const key of activeTypes) {
            console.log(key)
            if (key == "NAVIGATION") {
                navActive = true
            } else if (key === "MEDIA") {
                mediaActive = true
            } else if (key === "WEATHER") {
                weatherActive = true
            }
        }

        var activeServiceTab = this.state.activeServiceTab;
        return (
            // Maybe include modal for rest of AS views

            // Todo, make AS button group a react component
            <div className="app-services-nav th-nav-background-color" >
                <div className="clock">
                    <p className="t-small t-medium th-f-color">
                        {this.state.time}
                    </p>
                </div>
                <div className="app-services-button-group">
                    <div className={"app-services-tab " + 
                        ((activeServiceTab == "nav") ? "tab-wide__nav" : "") + 
                        (navActive ? "" : " hide-tab")}>
                        <span className="svg-size  nav-color " 
                        dangerouslySetInnerHTML={{__html: navIcon}} onClick={() => this.setActive("nav")}/>
                    </div>
                    <div className={"app-services-tab " + 
                        ((activeServiceTab == "media") ? "tab-wide__media" : "") + 
                        (mediaActive ? "" : " hide-tab")}>
                        <span className="svg-size  media-color " 
                        dangerouslySetInnerHTML={{__html: mediaIcon}} onClick={() => this.setActive("media")}/>
                    </div>
                    <div className={"app-services-tab " + 
                        ((activeServiceTab == "weather") ? "tab-wide__weather" : "") + 
                        (weatherActive ? "" : " hide-tab")}>
                        <span className="svg-size  weather-color " 
                        dangerouslySetInnerHTML={{__html: weatherIcon}} onClick={() => this.setActive("weather")}/>
                    </div>
                    
                </div>
                <div className="clock"/>
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