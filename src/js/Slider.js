import React from 'react';
import ReactSlider from 'rc-slider';
import 'rc-slider/assets/index.css';
import store from './store'
import { updateSliderPosition } from './actions'
import uiController from './Controllers/UIController'


export default class Slider extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            value: props.sliderData.position,
            cursor: "auto"
        }
        this.getSliderFooter = this.getSliderFooter.bind(this)
        this.onSliderChange = this.onSliderChange.bind(this)
        this.onShiftSlider = this.onShiftSlider.bind(this)
    }

    getSliderFooter() {
        const sliderData = this.props.sliderData
        if (sliderData.footer) {
            if (sliderData.footer.length === 1) { // Static Footer
                return sliderData.footer[0]
            }
            else if (sliderData.footer.length > this.state.value - 1) {
                return sliderData.footer[this.state.value - 1]
            }
        }
        return null
    }

    onSliderChange(value) {
        this.setState({cursor: "grabbing"})
        if (value < 1 || value > this.props.sliderData.numTicks) { return; }
        this.setState({ value: value }, () => {
            uiController.onSliderKeepContext(this.props.sliderData.msgID, this.props.sliderAppId)
            store.dispatch(updateSliderPosition(this.props.sliderAppId, value))
        })
    }

    onShiftSlider(offset){
        this.onSliderChange(this.state.value + offset)
    }

    render() {
        const sliderData = this.props.sliderData
        let sliderColors = {
            rail: this.props.theme ? "#000000" : "#FFFFFF",
            track: this.props.theme ? "#D9D9D9" : "#737373",
            handle: this.props.theme ? "#FFFFFF" : "#000000",
            dot: this.props.theme ?  "#FFFFFF" : "#000000",
            activeDot: this.props.theme ? "#000000" : "#FFFFFF"
        }
        let tickWidth = 25;
        
        return (
            <div className="slider">
                <div className="slider-header">
                    <h1 className="t-small t-light th-f-color">
                        {this.props.sliderName}
                    </h1>
                    <p className="t-small t-medium th-f-color">
                        {sliderData.header}
                    </p>
                </div>
                <div className="slider-body">
                    <div className="slider-components">
                        <div className={`th-f-color t-large t-light th-bg-color th-soft-buttons slider-button`}
                                onClick={() => this.onShiftSlider(-1)}>
                            <p>-</p>
                        </div>
                        <div className="slider-react-component" style={{width: sliderData.numTicks * tickWidth}}>
                            <div className="slider-rail" 
                                style={{width: sliderData.numTicks * tickWidth, backgroundColor: `${sliderColors.track}`}}>
                            </div>
                            <ReactSlider
                                dots
                                min={0}
                                max={sliderData.numTicks}
                                step={1}
                                value={this.state.value}
                                onChange={this.onSliderChange}
                                railStyle={{
                                    marginTop: -7,
                                    marginLeft: 15,
                                    background: `${sliderColors.rail}`,
                                    height: 12
                                }}
                                trackStyle={{
                                    marginTop: -7,
                                    background: `${sliderColors.track}`,
                                    height: 12
                                }}
                                handleStyle={{
                                    height: 20,
                                    width: 20,
                                    marginLeft: -3,
                                    marginTop: -11,
                                    background: `${sliderColors.handle}`,
                                    borderColor: `${sliderColors.handle}`
                                }}
                                dotStyle={{
                                    borderColor: `${sliderColors.dot}`,
                                    borderWidth: "thin",
                                    height: 13,
                                    width: 0.05
                                }}
                                activeDotStyle={{
                                    borderColor: `${sliderColors.activeDot}`
                                }}
                                style={{ cursor: `${this.state.cursor}` }}
                                onAfterChange={ () => this.setState({cursor: "auto"}) }
                            />
                        </div>
                        <div className={`th-f-color t-large t-light th-bg-color th-soft-buttons slider-button`}
                                onClick={() => this.onShiftSlider(1)}>
                            <p>+</p>
                        </div>
                    </div>
                    <p className="t-small t-medium th-f-color slider-footer">
                        {this.getSliderFooter()}
                    </p>
                </div>
                
                <div className={`th-f-color t-small t-light th-bg-color th-soft-buttons slider-submit`}
                        onClick={() => this.props.submitCallback()}>
                    <p>Submit</p>
                </div>
            </div>
        )
    }
}
