import React from 'react';

import AppHeader from '../../containers/Header';
import { LargeGraphic, TextFields } from '../../containers/Metadata';
import { SoftButtons } from '../../containers/Buttons';

export default class TextWithGraphic extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <AppHeader backLink="/" menuName="Apps"/>
                <div className="text-with-graphic-template">
                    <div className="text-with-graphic-container">
                        <TextFields />
                    </div>
                    <LargeGraphic class="text-with-graphic-container"/>
                </div>
            </div>
        )
    }
}