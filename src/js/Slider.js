import React from 'react';
import ReactSlider from 'rc-slider';
import 'rc-slider/assets/index.css';
import store from './store'
import { updateSliderPosition } from './actions'

export default class Slider extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            value: props.sliderData.position
        }
        this.onSliderChange = this.onSliderChange.bind(this)
        this.onButtonPress = this.onButtonPress.bind(this)
    }

    onSliderChange(value) {
        console.log("[!] OnSliderChange", value)
        this.setState({ value }, () => {
            console.log("[!]Slider callback", this.state)
            store.dispatch(updateSliderPosition(value))
        })
    }

    onButtonPress(offset){
        if(this.state.value + offset > 0 && this.state.value + offset <= this.props.sliderData.numTicks) {
            this.onSliderChange(this.state.value + offset)
        }
    }

    render() {
        console.log("[!] Slider props", this.props)
        const sliderData = this.props.sliderData

        var fill = this.props.theme ? "#FFFFFF" : "#000000";
        // slider: {
        //     showSlider: false,
        //     numTicks: null,
        //     position: null,
        //     header: "",
        //     footer: [], -- optional
        //     timeout: null --optional
        // },
        return (
            <div className="slider">
                <div className="slider-header">
                    <p className="t-small t-light th-f-color">
                        {sliderData.header}
                    </p>
                </div>
                <div className="slider-top">
                    <div className={`th-f-color t-large t-light th-bg-color th-soft-buttons`}
                            onClick={() => this.onButtonPress(-1)}>
                                <p>-</p>
                    </div>
                    <ReactSlider
                        min={0}
                        max={sliderData.numTicks}
                        value={this.state.value}
                        onChange={this.onSliderChange}
                    />
                    <div className={`th-f-color t-large t-light th-bg-color th-soft-buttons`}
                            onClick={() => this.onButtonPress(1)}>
                                <p>+</p>
                    </div>
                </div>
                
                <div className="slider-footer">
                    <p className="t-small t-light th-f-color">
                        {(sliderData.footer && sliderData.footer.length > this.state.value - 1) ? sliderData.footer[this.state.value - 1] : null}
                    </p>
                    <div className={`th-f-color t-small t-light th-bg-color th-soft-buttons`}
                                onClick={() => console.log("[!] Submitting", this.state.value)}>
                        <p>Submit</p>
                    </div>
                </div>



            </div>
        )
    }
}