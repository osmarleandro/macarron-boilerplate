import * as macaroon from "macaroon";
import Macaroon from "macaroon";
import * as crypto from "crypto";


let bakeMcrns = () => {
    try {
        let location = "c-lightning";
        let rootKey = crypto.randomBytes(64).toString('hex');
        let identifier = new Date().toString();

        //Generate Macaroon
        let accessMacaroon: Macaroon = macaroon.newMacaroon({ identifier: identifier, location: location, rootKey: rootKey});


        return [rootKey, accessMacaroon.exportBinary()];
    } catch (error) {
        throw new Error(error);
    }
}

let verifyMcrns = (rootKey: string, accessMacarron: Uint8Array) => {
    try {
        //var base64macaroon = macaroon.base64ToBytes(accessMacarron);
        let veraccessmcrn: Macaroon = macaroon.importMacaroon(accessMacarron);
        veraccessmcrn.verify(rootKey, () => null, []);

        console.log("Authentication pass");

    } catch (error) {
        console.error("Authentication Failed!");
        throw error;
    }
}


let baked: Object[] = bakeMcrns();
console.log(baked);
verifyMcrns(<string>baked[0], <Uint8Array>baked[1]);