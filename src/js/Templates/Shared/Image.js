import React from 'react';

export default class Image extends React.Component {
    constructor(props) {
        super(props);
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
            canvas.width = canvasContainer.clientWidth
            canvas.height = canvasContainer.clientHeight
            img.onload = () => {
                console.log("onload!")
                console.log(canvasContainer.clientWidth)
                console.log(canvasContainer.clientHeight)

                var scaledDimensions = this.scaleImage({
                        "width": img.width,
                        "height": img.height
                    }, {
                        "width": canvas.width,
                        "height": canvas.height
                    }
                );

                ctx.clearRect(0, 0, canvasContainer.clientWidth, canvasContainer.clientHeight);

                var x = (canvas.width / 2) - (scaledDimensions.width / 2);
                var y = (canvas.height / 2) - (scaledDimensions.height / 2);
                ctx.drawImage(img, x, y, scaledDimensions.width, scaledDimensions.height);

                ctx.globalCompositeOperation = "source-atop";
                ctx.globalAlpha = 1.0;
                ctx.fillStyle = fillColor;
                ctx.fillRect(0, 0, canvasContainer.clientWidth, canvasContainer.clientHeight);

                ctx.globalCompositeOperation = "source-over";
                ctx.globalAlpha = 1.0;
            }
            //Refresh image to trigger onload
            img.src = this.props.image;
        }
    }

    componentDidMount() {
        console.log("component did mount")
        this.drawImage();
    }

    componentWillUpdate(){
        console.log("component will update")

    }

    componentDidUpdate(){
        console.log("component did update")
        this.drawImage();
    }


    render() {
        if(this.props.image) {
            console.log(this.props.image)
            if(this.props.isTemplate) {
                console.log("isTempalte")
                var hidden = {display:'none'};
                var size = {
                    height: "100%",
                    width: "100%"
                }
                return (
                    <div style={size} ref="canvasContainer">
                        <canvas ref="canvas" className={this.props.class}/>
                        <img ref="image" style={hidden} src={this.props.image} />
                    </div>
                )
            } else {
                return <img className={this.props.class} src={this.props.image} />
            }

        } else {
            return(null)
        }
    }
}