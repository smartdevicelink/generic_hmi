var VehicleDataArray = [
    {
        "name": "GPS",
        "value": "Las Vegas",
        "formType": "TEXT"
    },
    {
        "name": "Speed",
        "value": 0,
        "formType": "SLIDER",
        "range": [0, 700]
    },
    {
        "name": "RPM",
        "value": 0,
        "formType": "SLIDER",
        "range": [0, 20000]
    },
    {
        "name": "Fuel Level",
        "value": 0,
        "formType": "SLIDER",
        "range": [0, 100]
    },
    {
        "name": "PRNDL",
        "value": "PARK",
        "formType": "RADIO",
        "range": ["PARK", "REVERSE", "NEUTRAL", "DRIVE", "LOWGEAR"]
    },
    {
        "name": "Tire Pressure",
        "value": 0,
        "formType": "RADIO",
        "range": ["LOW", "NORMAL"]
    },
    {
        "name": "Odometer",
        "value": 0,
        "formType": "SLIDER",
        "range": [0, 17000000]
    },
    {
        "name": "Driver Braking",
        "value": "ON",
        "formType": "RADIO",
        "range": ["NO", "YES"]
        
    }
]

export default VehicleDataArray