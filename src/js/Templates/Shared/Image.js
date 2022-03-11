import React from 'react';
import store from '../../store'
import UIController from '../../Controllers/UIController'
import { connect } from 'react-redux';

class Image extends React.Component {
    constructor(props) {
        super(props);
        this.onImgLoad = this.onImgLoad.bind(this);
        this.state = {errorPath: null, refreshed: false, height: undefined, width: undefined};
        this.initialCanvasDimensions = {
            height: null,
            width: null
        };
    }

    scaleImage(ogDimension, parentDimension) {
        var scaledDimensions = {
            width: 0,
            height: 0
        }
        var widthRatio = parentDimension.width / ogDimension.width
        var heightRatio = parentDimension.height / ogDimension.height
        var minScale = Math.min(widthRatio, heightRatio)
        scaledDimensions.width = ogDimension.width * minScale
        scaledDimensions.height = ogDimension.height * minScale

        return scaledDimensions;
    }

    drawImage() {
        var fillColor = this.props.fillColor ? this.props.fillColor : "#000000";
        if(this.refs.canvas && this.refs.image) {
            const canvasContainer = this.refs.canvasContainer;
            const canvas = this.refs.canvas
            const ctx = canvas.getContext("2d")
            const img = this.refs.image
            if (!this.initialCanvasDimensions.height || !this.initialCanvasDimensions.width) {
                this.initialCanvasDimensions.width = canvasContainer.clientWidth
                this.initialCanvasDimensions.height = canvasContainer.clientHeight
            }

            canvas.width = this.initialCanvasDimensions.width
            canvas.height = this.initialCanvasDimensions.height
            img.onload = () => {
                var scaledDimensions = this.scaleImage({
                        "width": img.width,
                        "height": img.height
                    }, {
                        "width": this.initialCanvasDimensions.width,
                        "height": this.initialCanvasDimensions.height
                    }
                );
                canvas.width = scaledDimensions.width
                canvas.height = scaledDimensions.height

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                var x = (canvas.width / 2) - (scaledDimensions.width / 2);
                var y = (canvas.height / 2) - (scaledDimensions.height / 2);

                ctx.drawImage(img, x, y, scaledDimensions.width, scaledDimensions.height);

                ctx.globalCompositeOperation = "source-atop";
                ctx.globalAlpha = 1.0;
                ctx.fillStyle = fillColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.globalCompositeOperation = "source-over";
                ctx.globalAlpha = 1.0;
            }
            //Refresh image to trigger onload
            img.src = this.props.image + "?m=" + new Date().getTime();
        }
    }

    componentDidMount() {
        this.drawImage();
    }

    componentDidUpdate(){
        this.drawImage();
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Check if any props changed
        if (this.props.fillColor !== nextProps.fillColor) {
            return true;
        }
        if (this.props.image !== nextProps.image) {
            return true;
        }
        if (this.props.isTemplate !== nextProps.isTemplate) {
            return true;
        }
        if (this.props.class !== nextProps.class) {
            return true;
        }

        // Check if next image is to be refreshed
        if (nextProps.refreshImage === nextProps.image) {
            return true;
        }

        if (nextState.errorPath) {
            return true;
        }

        if (this.state.height !== nextState.height || this.state.width !== nextState.width) {
            return true;
        }
        
        // No updates required
        return false;
    }

    onError(event) {
        const state = store.getState();
        const activeApp = state.activeApp;
        if (activeApp) {
            UIController.onUpdateFile(activeApp, this.props.image);
        }
        this.setState({errorPath: this.props.image, refreshed: this.props.image === this.props.refreshImage});
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        var newState = prevState;
        // Reset refreshed flag if refreshImage has changed
        if (nextProps.image !== nextProps.refreshImage) {
            newState.refreshed = false
        }
        // Reset error flag when the image is newly refreshed
        // checking the refreshed flag prevents multiple refreshes
        else if (!prevState.refreshed) {
            newState.errorPath = null
        }
        // If there was an error loading image but image path has changed,
        // remove error flag
        if (prevState.errorPath && prevState.errorPath !== nextProps.image) {
            newState.errorPath = null;
        }
        return newState;
    }

    onImgLoad ({target:img}) {
        if (this.state.height === img.naturalHeight || this.state.width === img.naturalWidth) {
            return;
        }
        this.setState({height: img.naturalHeight, width: img.naturalWidth});
    }

    render() {
        if(this.props.image && !this.state.errorPath) {
            if (this.props.isTemplate) {
                var hidden = {display:'none'};
                var size = {
                    height: "100%",
                    width: "100%",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }
                return (
                    <div style={size} ref="canvasContainer">
                        <canvas ref="canvas" className={this.props.class}/>
                        <img 
                            ref="image" 
                            style={hidden} 
                            src={this.props.image + "?m=" + new Date().getTime()} 
                            alt="SDL_Image" 
                            onError={e => this.onError(e)} 
                        />
                    </div>
                )
            } else {
                var style = {};
                if (this.state.height && this.state.width) {
                    if (this.state.height > this.state.width) {
                        style = {
                            height: "100%",
                            width: "auto"
                        }
                    } else {
                        style = {
                            height: "auto",
                            width: "100%"
                        }
                    }
                } else {
                    style = {display:'none'};
                }
                
                return (
                    <img onLoad={this.onImgLoad} className={this.props.class} style={style} src={this.props.image + "?m=" + new Date().getTime()} onError={e => this.onError(e)} alt="SDL_Image"/>
                )
            }

        } else {
            return(null)
        }
    }
}

const mapStateToProps = (state) => {
    var activeApp = state.activeApp;
    var app = state.ui[activeApp] ? state.ui[activeApp] : null;
    if (!app) {
        return {}
    }
    return {
        refreshImage: app.refreshImage
    }
}

export default connect(
    mapStateToProps
)(Image)
