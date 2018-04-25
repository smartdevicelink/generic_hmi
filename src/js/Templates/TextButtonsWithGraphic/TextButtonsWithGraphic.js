import React from 'react';

import AppHeader from '../../containers/Header';
import { LargeGraphic } from '../../containers/Metadata';
import { SoftButtons } from '../../containers/Buttons';

export default class TextButtonswithGraphic extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <AppHeader backLink="/" menuName="Apps"/>
                <div className="text-buttons-with-graphic-template">
                    <SoftButtons class="text-buttons-with-graphic-container"/>
                    <LargeGraphic class="text-buttons-with-graphic-container"/>
                </div>
            </div>
        )
    }
}