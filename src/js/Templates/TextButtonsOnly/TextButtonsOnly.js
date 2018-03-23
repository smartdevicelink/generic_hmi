import React from 'react';

import AppHeader from '../../containers/Header';
import { SoftButtons } from '../../containers/Buttons';

export default class TextButtonsOnly extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <AppHeader backLink="/" menuName="Apps"/>
                <div className="text-buttons-only-template">
                    <SoftButtons class="text-buttons-only-container"/>
                </div>
            </div>
        )
    }
}