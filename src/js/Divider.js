import React from 'react';
import mediaIcon from "../img/app_services/media.svg";
export default class Divider extends React.Component {

    constructor() {
        super();
    }

    render() {
        var cardCount = 0;
        var actives = [this.props.navActive, this.props.mediaActive, this.props.weatherActive];
        actives.forEach( (item) => {
          if (item === true) {
            cardCount++;
          }
        });

        if (this.props.position === 1 && cardCount <= 2 && !this.props.navActive) {
          return null;
        }

        if (this.props.position === 2 && !(cardCount >= 3 || (this.props.mediaActive && this.props.weatherActive))) {
            return null;          
        }

        return (
            <div className="app-service-card-divider th-divider-color" />
        )
    }
}
