import React from 'react';

import AppHeader from '../../containers/Header';
import { LargeGraphic } from '../../containers/Metadata';
import { SoftButtons } from '../../containers/Buttons';

export default class LargeGraphicWithSoftbuttons extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <AppHeader backLink="/" menuName="Apps"/>
                <div className="large-graphic-with-softbuttons-template">
                    <LargeGraphic class="large-graphic-with-softbuttons-top-container"/>
                    <SoftButtons class="large-graphic-with-softbuttons-bottom-container"/>
                </div>
            </div>
        )
    }
}