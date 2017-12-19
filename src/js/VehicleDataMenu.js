import React from 'react';

import VehicleDataList from './containers/VehicleDataList';

export default class VehicleDataMenu extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div >
                <VehicleDataList />
            </div>
        )
    }
}