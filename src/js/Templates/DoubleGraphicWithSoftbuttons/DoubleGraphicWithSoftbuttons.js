import React from 'react';

import AppHeader from '../../containers/Header';
import { DoubleGraphic } from '../../containers/Metadata';
import { SoftButtons } from '../../containers/Buttons';

export default class DoubleGraphicWithSoftbuttons extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <AppHeader backLink="/" menuName="Apps"/>
                <div className="double-graphic-with-softbuttons-template">
                    <DoubleGraphic class="double-graphic-with-softbuttons-top-container"/>
                    <SoftButtons class="double-graphic-with-softbuttons-bottom-container"/>
                </div>
            </div>
        )
    }
}