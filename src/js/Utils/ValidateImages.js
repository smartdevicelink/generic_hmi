var validationRequestsSuccess = {}

function ImageCanBeLoaded(imageURL){
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.onload = () => {
            resolve(); 
        };
        image.onerror = image.onabort = () => {
            reject();
        };
        image.src = imageURL;
    });
}

function ValidateImages (imageList) {
    if (imageList === null || imageList.length === 0){
        return Promise.resolve();
    }
    let validationPromises = [];
    for (let img of imageList){
        if (img === undefined) { continue; }
        if (!img.hasOwnProperty('imageType') || !img.hasOwnProperty('value')) {
            return Promise.reject();
        }

        let promise = (img.imageType === "DYNAMIC") ? ImageCanBeLoaded(img.value) 
            : ImageCanBeLoaded("../src/img/static/" + img.value + ".svg");
        validationPromises.push(promise);
    }
    return Promise.all(validationPromises)
}

function AddImageValidationRequest(msgID, imageList){
    if(msgID in validationRequestsSuccess){
        console.error("msg Id: " + msgID + " already exists in map")
        return
    }

    ValidateImages(imageList).then(
        () => { validationRequestsSuccess[msgID] = true; },
        () => { validationRequestsSuccess[msgID] = false; }
    )
}

function RemoveImageValidationRequest(msgID){
    delete validationRequestsSuccess[msgID];
}

function GetValidationResult(msgID){
    if(!(msgID in validationRequestsSuccess)){
        return true
    }

    return validationRequestsSuccess[msgID];
}

export {
    ValidateImages,
    AddImageValidationRequest,
    RemoveImageValidationRequest,
    GetValidationResult
}