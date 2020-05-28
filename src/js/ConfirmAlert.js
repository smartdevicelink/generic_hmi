import React from 'react';

export default class ConfirmAlert extends React.Component {
    render() {
        return (
            <div className="alert">
                <div className="alert-title">
                    <p className="t-small t-light th-f-color">
                        {this.props.name}
                    </p>
                </div>
                <div className="alert-top">
                    <h4 className="t-small t-medium th-f-color">{this.props.description}</h4>
                    <img src={this.props.iconUrl} alt=""/>
                </div>
                <div className="alert-buttons">
                    <div className="alert-button-2 th-f-color t-small t-light th-bg-color th-soft-buttons" 
                        key={0} onClick={this.props.leftCallback}>
                            {this.props.leftText}
                    </div>
                    <div className="alert-button-2 th-f-color t-small t-light th-bg-color th-soft-buttons" 
                        key={1} onClick={this.props.rightCallback}>
                            {this.props.rightText}
                    </div>
                </div>
            </div>
        );
    }
}
