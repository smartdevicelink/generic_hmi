import React from 'react';

import AppHeader from './containers/Header';
import { VSubMenu, HSubMenu } from './containers/SubMenu';
import store from './store'

export default class InAppMenu extends React.Component {
    render() {
        const state = store.getState()
        const app = state.ui[state.activeApp]
        var layout = app ? (app.activeSubMenu ? app.menu.find(x => x.menuID === app.activeSubMenu).menuLayout : app.menuLayout) : "LIST";
        var menu = (layout === "LIST") ? (<VSubMenu />) : (<HSubMenu />)

        return (
            <div>
                <AppHeader backLink="/" menuName="APPS"/>
                { menu }
            </div>
        )
    }
}
