 
const https = require('https');
const storeNumber = "r123"; // Store code
const location = "123456"; // Post code
const storePath = 'uk'; // Country
const skuList = ["MQ9U3ZD/A", "MQ9X3ZD/A"]; // Model numbers
const query = skuList
    .map((k, i) => `parts.${i}=${encodeURIComponent(k)}`)
    .join("&") + `&searchNearby=true&store=${storeNumber}&location=${location}`;

https.get(`https://www.apple.com/${storePath}/shop/fulfillment-messages?${query}`, (res) => {
    let receivedData = '';

    res.on('data', (chunk) => {
        receivedData += chunk;
    });

    res.on('end', () => {
        let { body } = JSON.parse(receivedData);

        body.content.pickupMessage.stores.forEach(element => {           
            let storeDistance = element.storeDistanceWithUnit;
            let storeName = element.storeName;	    
            let parts = element.partsAvailability;
    
            Object.keys(parts).forEach(part => {
                let status = parts[part].pickupDisplay;
                let prodName = parts[part].messageTypes.regular.storePickupProductTitle;
    
                if (status === "available" && parts[part].storePickEligible === true) {
                    console.log(`${storeName} - ${storeDistance} - ${prodName} Status: ${status}`);
                }
            });
        });
    });
}).on("error", (err) => {
    console.log("Error: ", err.message);
});