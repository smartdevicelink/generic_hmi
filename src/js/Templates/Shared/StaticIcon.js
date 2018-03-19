import React from 'react';
const svgs = require.context('../../../img/static', true, /\.svg$/);
const keys = svgs.keys()

const svgsObj = svgs.keys()
  .reduce((images, key) => {
    images[key] = svgs(key).replace(/"st0"/g, '"st0 svg-stroke"')
    return images
  }, {})

export default class StaticIcon extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.image) {
            var path = "";
            path = "./" + this.props.image + ".svg"
            return (
                <div className={this.props.class} dangerouslySetInnerHTML={{__html: svgsObj[path]}} />
            )
        } else {
            return(null)
        }
    }
}