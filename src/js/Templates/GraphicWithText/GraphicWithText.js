import React from 'react';

import AppHeader from '../../containers/Header';
import { LargeGraphic, TextFields } from '../../containers/Metadata';
import { SoftButtons } from '../../containers/Buttons';

export default class GraphicWithText extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <AppHeader backLink="/" menuName="Apps"/>
                <div className="graphic-with-text-template">
                    <div className="min-width-50">
                        <LargeGraphic class="graphic-with-text-container"/>
                    </div>
                    <div className="graphic-with-text-container">
                        <TextFields/>
                    </div>
                </div>
            </div>
        )
    }
}