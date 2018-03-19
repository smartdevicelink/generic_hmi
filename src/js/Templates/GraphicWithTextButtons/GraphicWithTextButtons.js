import React from 'react';

import AppHeader from '../../containers/Header';
import { LargeGraphic } from '../../containers/Metadata';
import { SoftButtons } from '../../containers/Buttons';

export default class GraphicWithTextButtons extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <AppHeader backLink="/" menuName="Apps"/>
                <div className="graphic-with-text-buttons-template">
                    <LargeGraphic class="graphic-with-text-buttons-container"/>
                    <SoftButtons class="graphic-with-text-buttons-container"/>
                </div>
            </div>
        )
    }
}