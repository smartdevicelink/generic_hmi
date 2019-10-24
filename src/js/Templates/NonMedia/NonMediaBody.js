import React from 'react';

import Graphic from './NonMediaGraphic';

export default class NonMediaBody extends React.Component {
    render() {

        var textFields = [];
        if(this.props.mainField1)
            textFields.push({text: this.props.mainField1, className: null});
        if(this.props.mainField2)
            textFields.push({text: this.props.mainField2, className: null});
        if(this.props.mainField3)
            textFields.push({text: this.props.mainField3, className: null});
        if(this.props.mainField4)
            textFields.push({text: this.props.mainField4, className: null});     
        var i = 0;
        if(textFields.length > 2) {
            for(i=0; i<textFields.length; i++) {
                if(i < 2) {
                    textFields[i].className = "t-large t-light th-f-color non-media-text-4"; 
                } else {
                    textFields[i].className = "t-small t-light th-f-color-secondary non-media-text-4"; 
                }
            }
        } else {
            if(textFields[0]) {
                textFields[0].className = "t-large t-light th-f-color non-media-text-2"; 
            }
            if(textFields[1]) {
                textFields[1].className = "t-small t-light th-f-color-secondary non-media-text-2";
            }           
        }        
        var softButtonsDiv = [];
        for (i=0; i<textFields.length; i++) {
            softButtonsDiv.push(
                <p className={textFields[i].className}>{textFields[i].text}</p>
            );
        }
        return (
            <div>
                <div className="non-media-body">               
                    <div className="non-media-meta-data">
                        {softButtonsDiv}
                    </div>
                    <Graphic image={this.props.graphic} theme={this.props.theme} />
                </div>
            </div>
        )
    }
}