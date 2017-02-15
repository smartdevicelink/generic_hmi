import React from 'react';

import Graphic from './NonMediaGraphic';

export default class NonMediaBody extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div >               
                    <div>                    
                        <p className="t-large t-light th-f-color">{this.props.mainField1}</p>
                        <p className="t-large t-light th-f-color-secondary">{this.props.mainField2}</p>
                        <p className="t-small t-light th-f-color">{this.props.mainField3}</p>
                    </div>
                    <Graphic image={this.props.graphic} />
                </div>
            </div>
        )
    }
}