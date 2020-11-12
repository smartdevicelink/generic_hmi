import React from 'react';
export default class Divider extends React.Component {
    render() {
        var cardCount = 0;
        var actives = [this.props.navActive, this.props.mediaActive, this.props.weatherActive];
        actives.forEach( (item) => {
          if (item === true) {
            cardCount++;
          }
        });

        if (this.props.position === 1 && cardCount < 2) {
          return null;
        }

        if (this.props.position === 2 && cardCount < 3) {
          return null;
        }

        return (
            <div className="app-service-card-divider th-divider-color" />
        )
    }
}
