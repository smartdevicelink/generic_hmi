import React from 'react';

import AppHeader from './containers/Header';
import { VMenu, HMenu } from './containers/Menu';
import store from './store'

export default class InAppMenu extends React.Component {
    constructor() {
        super();
    }

    render() {
        const state = store.getState()
        const app = state.ui[state.activeApp]
        var layout = app ? (app.activeSubMenu ? app.menu.find(x => x.menuID === app.activeSubMenu).menuLayout : app.menuLayout) : "LIST";
        var menu = (layout === "LIST") ? (<VMenu/>) : (<HMenu/>);

        return (
            <div>
                <AppHeader backLink="/" menuName="APPS"/>
                { menu }
            </div>
        )
    }
}
