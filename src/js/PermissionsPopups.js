import React from 'react';

import toast from 'react-hot-toast';

export class PermissionsPopup extends React.PureComponent {
    render() {
        var that = this;
        var buttonsHtml = this.props.buttons && this.props.buttons.length > 0 ? 
            this.props.buttons.map((button, i) => (
                <div key={i} onClick={button.onClick}
                    className={`permissionsPopup-button th-f-color t-small t-light th-bg-color th-soft-buttons`}>
                        <p>{button.label}</p>
                </div>
            )) : 
            (<div className={`permissionsPopup-button th-f-color t-small t-light th-bg-color th-soft-buttons`}
                onClick={() => toast.dismiss(that.props._toast.id)}>
                <p>OK</p>
            </div>);

        return (
            <div className="permissionsPopup app-bg-color">
                <div className="permissionsPopup-buttons">
                    { buttonsHtml }
                </div>
                <div className="permissionsPopup-top">
                    <h3 className="t-medium th-f-color">{this.props.header}</h3>
                    <p className="t-light t-small th-f-color permissionsPopup-text">
                        {this.props.body}
                    </p>
                </div>
            </div>
        );
    }
}