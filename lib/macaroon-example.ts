import * as macaroon from "macaroon";
import * as crypto from "crypto";

let bakeMcrns = () => {
    try {
        let location = "c-lightning";
        let rootKey = crypto.randomBytes(64).toString('hex');
        let identifier = new Date().toString();

        //Generate Macaroon
        let accessMacaroon = macaroon.newMacaroon({ identifier: identifier, location: location, rootKey: rootKey, version: 2 });

        return [rootKey, accessMacaroon.exportBinary()];
    } catch (error) {
        throw new Error(error);
    }
}

console.log(bakeMcrns());