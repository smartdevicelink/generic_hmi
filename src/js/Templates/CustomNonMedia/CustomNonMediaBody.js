import React from 'react';

import Graphic from './CustomNonMediaGraphic';

export default class CustomNonMediaBody extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        var textFields = [];
        if(this.props.mainField1)
            textFields.push({text: this.props.mainField1});
        if(this.props.mainField2)
            textFields.push({text: this.props.mainField2});
        if(this.props.mainField3)
            textFields.push({text: this.props.mainField3});
        if(this.props.mainField4)
            textFields.push({text: this.props.mainField4});     

        var softButtonsDiv = "";
        for (var i=0; i<textFields.length; i++) {
            softButtonsDiv += '<p class="t-small t-light th-f-color"> ' + textFields[i].text + '</p>';
        }
        return (
            <div className="custom-non-media-body">               
                <div className="custom-non-media-meta-data" dangerouslySetInnerHTML={{__html: softButtonsDiv}}/>
                <Graphic image={this.props.graphic} theme={this.props.theme} />
            </div>

        )
    }
}