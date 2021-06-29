import React from 'react';
import HScrollMenuItem from './HScrollMenuItem'
import MenuFooter from './MenuFooter';
import store from './store.js'
import UIController from './Controllers/UIController';

export default class HScrollMenu extends React.Component {
    constructor(props) {
        super(props);
        this.hiddenNames = [];
        this.state = {
            performInteractionCounter: 15
        }
        this.pressResetTimeoutButton = this.pressResetTimeoutButton.bind(this);
    }

    clearHiddenNames() {
        this.hiddenNames = [];
    }

    pushHiddenName(name) {
        this.hiddenNames.push(name)
    }

    pressResetTimeoutButton(event) { 
        //store.dispatch(alertTimeoutReseted(true));

        let count = store.getState().ui[store.getState().activeApp].resetTimeout.resetTimeoutValue/1000;

        this.setState({performInteractionCounter: count});
        UIController.resetPerformInteractionTimeout('UI');      
    }

    changeCounter() {
        this.setState(prevState => ({performInteractionCounter: prevState.performInteractionCounter > 0 ? prevState.performInteractionCounter - 1 : ''}))
    }
    componentDidMount() {
        this.interval = setInterval(() => this.changeCounter(), 1000)
    }
    componentWillUnmount() {
        clearInterval(this.interval)
    }

    render() {
        this.clearHiddenNames();
        let menuItems = this.props.data.map((menuItem) => {
            if (menuItem.hidden) {
                this.pushHiddenName(menuItem.name)
                return null;
            }

            return (
            <div className="hscrollmenu-block"
                key={menuItem.cmdID + menuItem.name}>
                    <HScrollMenuItem
                        menuItem={menuItem}
                        isPerformingInteraction={this.props.isPerformingInteraction}
                        interactionId={this.props.interactionId ? this.props.interactionId : 0}
                        theme={this.props.theme}
                        onSelection={this.props.onSelection}/>

                    {this.props.interactionId ?  
                        <div className="performInteraction-reset-box">
                            <div className="timeout-box">
                                <p>P Interaction: {this.state.performInteractionCounter}</p>
                            </div>
                            <button className="reset-button" onClick={this.pressResetTimeoutButton}>Reset Timeout</button>
                        </div>
                    : 0}
            </div>)
        });

        var hiddenCommands = null;
        if (this.hiddenNames.length) {
            hiddenCommands = <MenuFooter textAlign="center"/>
        }

        return (
            <div className="hscrollmenu">
                { menuItems }
                { hiddenCommands }
            </div>
        )
    }
}
