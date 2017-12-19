import { connect} from 'react-redux'
import { bindActionCreators } from 'redux';
import VDScrollMenu from '../VDScrollMenu'
import viController from '../Controllers/VehicleInfoController'
import { activateSubMenu } from '../actions'

const mapStateToProps = (state) => {
    var list = state.vehicleData
    var data = list.map((item) => {
        return {
            name: item.name,
            value: item.value,
            formType: item.formType,
            range: item.range
        }
    })
    return {data: data}
}



const mapDispatchToProps = (dispatch) => {


    return {
            onSelection: (name, value, formType) => {
                console.log("Vehicle DISPATCH!")
                //dispatch(changeVehicleData(name, value, formType))
                //viController.onVehicleData(name, value)
            },
            onMouseDown : () => {
                console.log("MOUSEDOWN")
            },
            onMouseUp : (name, value, formType) => {
                console.log("MouseUP")
                viController.onVehicleData(name, value, formType);
            },
            onMouseMove : (x, y) => {
                console.log("onMouseMove")
                console.log(x)
                console.log(y)
            }

          
    }
}

const VehicleDataList = connect(
    mapStateToProps,
    mapDispatchToProps
)(VDScrollMenu)

export default VehicleDataList