import React from 'react';
import HScrollMenuItem from './HScrollMenuItem'
import MenuFooter from './MenuFooter';
import store from './store.js'
import UIController from './Controllers/UIController';
import { connect } from 'react-redux'
import { updateResetPeriod, resetTimeout } from './actions';
import { DEFAULT_RESET_TIMEOUT } from "./Alert"

const OUT_OF_BOUND_RESET_PERIOD = 1000;
class HScrollMenu extends React.Component {
    constructor(props) {
        super(props);
        this.hiddenNames = [];
        this.state = {
            performInteractionCounter: 10
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
        const count = store.getState().ui[store.getState().activeApp].resetTimeout.resetTimeoutValue/1000;
        if(count > OUT_OF_BOUND_RESET_PERIOD) {
            this.props.updateResetPeriod(DEFAULT_RESET_TIMEOUT)
            this.props.resetTimeout({
                resetPeriod: DEFAULT_RESET_TIMEOUT,
                appID: store.getState().activeApp
            }); 
            return;
        }
        this.setState({performInteractionCounter: count});
        UIController.resetPerformInteractionTimeout('UI');      
    }

    changeCounter() {
        this.setState(prevState => ({performInteractionCounter: prevState.performInteractionCounter > 0 ? prevState.performInteractionCounter - 1 : ''}))
    }
    componentDidMount() {
        this.interval = setInterval(() => this.changeCounter(), 1000)
        const activeApp = store.getState().activeApp;
        if('interactionId' in this.props) {
            this.setState({performInteractionCounter: store.getState().ui[activeApp].interactionTimeout/1000})
        }
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

            </div>
            )
        });

        var hiddenCommands = null;
        if (this.hiddenNames.length) {
            hiddenCommands = <MenuFooter textAlign="center"/>
        }

        let resetTimeoutPInteraction;
        if('interactionId' in this.props) {
            resetTimeoutPInteraction = (<div className="performInteraction-reset-box th-reset-box">
            <div className="timeout-box">
                <p>UI.PerformInteraction: {this.state.performInteractionCounter}</p>
            </div>
            <button className="reset-button" onClick={this.pressResetTimeoutButton}>Reset Timeout</button>
        </div>);
        }
                        

        return (
            <>  
                <div className="hscrollmenu">
                
                    { menuItems }
                    { hiddenCommands }
                </div>
                <div className="resetTcontainer">{resetTimeoutPInteraction}</div>
            </>
        )
    }
}

export default connect(null, { updateResetPeriod, resetTimeout })(HScrollMenu)