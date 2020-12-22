import React from 'react';
import store from '../../store'
import UIController from '../../Controllers/UIController'
import { connect } from 'react-redux';

class Image extends React.Component {
    constructor(props) {
        super(props);
        this.state = {error: false, refreshed: false};
        this.canvasStyle = {
            height: null,
            width: null,
            scaledDimensions: null,
            x: null,
            y: null
        };
    }

    scaleImage(ogDimension, parentDimension) {
        var scaledDimensions = {
            width: 0,
            height: 0
        }
        var widthRatio = parentDimension.width / ogDimension.width
        var heightRatio = parentDimension.height / ogDimension.height
        var minScale = Math.min(widthRatio , heightRatio)
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

            if (this.canvasStyle.height && this.canvasStyle.width) {
                canvas.width = this.canvasStyle.width
                canvas.height = this.canvasStyle.height
            } else {
                canvas.width = canvasContainer.clientWidth
                canvas.height = canvasContainer.clientHeight
                this.canvasStyle.width = canvasContainer.clientWidth
                this.canvasStyle.height = canvasContainer.clientHeight
            }

            img.onload = () => {
                var scaledDimensions;
                if (this.canvasStyle.scaledDimensions) {
                    scaledDimensions = this.canvasStyle.scaledDimensions
                } else {
                    scaledDimensions= this.scaleImage({
                            "width": img.width,
                            "height": img.height
                        }, {
                            "width": this.canvasStyle.width,
                            "height": this.canvasStyle.height
                        }
                    );
                }

                ctx.clearRect(0, 0, this.canvasStyle.width, this.canvasStyle.height);

                if (!this.canvasStyle.x || !this.canvasStyle.y) {
                    this.canvasStyle.x = (canvas.width / 2) - (scaledDimensions.width / 2);
                    this.canvasStyle.y = (canvas.height / 2) - (scaledDimensions.height / 2);
                }

                ctx.drawImage(img, this.canvasStyle.x, this.canvasStyle.y, scaledDimensions.width, scaledDimensions.height);

                ctx.globalCompositeOperation = "source-atop";
                ctx.globalAlpha = 1.0;
                ctx.fillStyle = fillColor;
                ctx.fillRect(0, 0, this.canvasStyle.width, this.canvasStyle.height);

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
        
        // No updates required
        return false;
    }

    onError(event) {
        const state = store.getState();
        const activeApp = state.activeApp;
        if (activeApp) {
            UIController.onUpdateFile(activeApp, this.props.image);
        }
        this.setState({error: true, refreshed: this.props.image === this.props.refreshImage});
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
            newState.error = false
        }
        return newState;
    }

    render() {
        if(this.props.image && !this.state.error) {
            if(this.props.isTemplate) {
                var hidden = {display:'none'};
                var size;
                if (this.canvasStyle.height && this.canvasStyle.width) {
                    size = {
                        height: this.canvasStyle.height,
                        width: this.canvasStyle.width
                    }
                } else {
                    size = {
                        height: "100%",
                        width: "100%"
                    }
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
                return (
                    <img className={this.props.class} src={this.props.image + "?m=" + new Date().getTime()} onError={e => this.onError(e)} alt="SDL_Image"/>
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
