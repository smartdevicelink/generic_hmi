import React from 'react';

import VDItem from './VehicleDataItem';

export default class VDScrollMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let listItems = this.props.data.map((item) => {
            return (<div key={"vehicleData:" + item.name}>
                        <VDItem
                            name={item.name}
                            value={item.value}
                            formType={item.formType}
                            range={item.range}
                            onSelection={this.props.onSelection}
                            onMouseUp={this.props.onMouseUp}
                            onMouseDown={this.props.onMouseDown}
                            onMouseMove={this.props.onMouseMove}/>
                    </div>)
        })
        return (
            <div className="vehicledatascrollmenu">
                { listItems }
            </div>
        )
    }
}
