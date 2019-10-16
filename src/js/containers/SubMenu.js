import { connect } from 'react-redux'
import VScrollMenu from '../VScrollMenu'
import HScrollMenu from '../HScrollMenu'
import uiController from '../Controllers/UIController'
import { deactivateSubMenu, deactivateInteraction } from '../actions'
import '../polyfill_find'

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var app = state.ui[activeApp]
    var theme = state.theme
    var link =  state.ui[activeApp].displayLayout
    var data = null;
    if (app.isPerformingInteraction) {
        data = app.choices.map((choice) => {
            return {
                appID: activeApp,
                cmdID: choice.choiceID,
                name: choice.menuName,
                image: choice.image ? choice.image.value : undefined,
                imageType: choice.image ? choice.image.imageType : undefined,
                isTemplate: choice.image ? choice.image.isTemplate : undefined,
                link: link
            }
        })
        return {
            data:data,
            isPerformingInteraction: true,
            interactionId: app.interactionId,
            theme: theme
        }
    }
    // The app isn't performing an interaction, so pass the sub menu items 
    var menu = app.menu
    var activeSubMenu = app.activeSubMenu
    data = menu.find((test) => {
        return test.menuID === activeSubMenu
    }).subMenu.map((command) => {
        return {
            appID: activeApp,
            cmdID: command.cmdID,
            name: command.menuName,
            image: command.cmdIcon ? command.cmdIcon.value : undefined,
            imageType: command.cmdIcon ? command.cmdIcon.imageType : undefined,
            isTemplate: command.cmdIcon ? command.cmdIcon.isTemplate : undefined,
            link: link
        }
    })
    return {data: data, isPerformingInteraction: false, theme: theme}
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSelection: (appID, cmdID, menuID, isPerformingInteraction, interactionID) => {
            uiController.onSystemContext("MAIN", appID)
            if (isPerformingInteraction) {
                uiController.onChoiceSelection(cmdID, appID, interactionID)
                dispatch(deactivateInteraction(appID))
            } else {
                uiController.onCommand(cmdID, appID)
                dispatch(deactivateSubMenu(appID))
            }
        }
    }
}

export const VSubMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(VScrollMenu)

export const HSubMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(HScrollMenu)

export default VSubMenu