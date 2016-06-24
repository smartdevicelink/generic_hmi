import { connect } from 'react-redux'
import MediaPlayerBody from '../MediaPlayerBody'

const mapStateToProps = (state) => {
    var activeApp = state.ui.activeApp
    var metadata = state.ui[activeApp]
    if (metadata === undefined) return {}
    var props = {}
    props.mainField1 = null
    props.mainField2 = null
    props.mainField3 = null
    metadata.showStrings.map ((textField) => {
        switch (textField.fieldName) {
            case "mainField1":
                props.mainField1 = textField.fieldText
                break
            case "mainField2":
                props.mainField2 = textField.fieldText
                break
            case "mainField3":
                props.mainField3 = textField.fieldText
                break
        }
    })
    props.graphic = metadata.graphic ? metadata.graphic.value : "http://www.unrecorded.mu/wp-content/uploads/2014/02/St.-Vincent-St.-Vincent1.jpg"
    console.log('props', props)
    return props
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export const MediaMetadata = connect(
    mapStateToProps,
    mapDispatchToProps
)(MediaPlayerBody)

export default MediaMetadata