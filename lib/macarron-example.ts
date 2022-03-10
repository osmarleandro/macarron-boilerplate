import {MacaroonsBuilder, MacaroonsVerifier, verifier as libVerifier} from "macaroons.js";


// Lets create a simple macaroon
let location = "http://www.example.org";
let secretKey = "this is our super secret key; only we should know it";
let identifier = "we used our secret key";

let macaroon = MacaroonsBuilder.create(location, secretKey, identifier);
console.log(macaroon.inspect());

// You may use a Buffer object instead of string to create a macaroon. This yields in better performance.
let secretKeyBuffer = Buffer.from("39a630867921b61522892779c659934667606426402460f913c9171966e97775", 'hex');

macaroon = MacaroonsBuilder.create(location, secretKeyBuffer, identifier);
console.log(macaroon.inspect());


// Serializing
let serialized = macaroon.serialize();
console.log("Serialized: " + serialized);

// De-Serializing
macaroon = MacaroonsBuilder.deserialize(serialized);
console.log(macaroon.inspect());


// Verifying Your Macaroon
macaroon = MacaroonsBuilder.create(location, secretKey, identifier);
let verifier = new MacaroonsVerifier(macaroon);

let secret = "this is our super secret key; only we should know it";
let valid = verifier.isValid(secret);
console.log("This macaroon secret is " + (valid ? "valid" : "invalid"));


// Adding Caveats: When creating a new macaroon, you can add a caveat to our macaroon that restricts it to just the account number 3735928559.
macaroon = new MacaroonsBuilder(location, secretKey, identifier)
    .add_first_party_caveat("account = 2345678")
    .getMacaroon();
console.log(macaroon.inspect());

// Because macaroon objects are immutable, they have to be modified via MacaroonsBuilder. Thus, a new macaroon object will be created.
let newMacaroon = MacaroonsBuilder.modify(macaroon)
    .add_first_party_caveat("perm = 666")
    .getMacaroon();

console.log(newMacaroon.inspect());
console.log(macaroon.inspect());


// Verifying Macaroons With Caveats
verifier = new MacaroonsVerifier(macaroon);
console.log("This macaroon secret is " + (verifier.isValid(secret) ? "valid": "invalid") )

verifier.satisfyExact("account = 2345678");
console.log("After verify a caveat, this macaroon is " + (verifier.isValid(secret) ? "valid": "invalid") )


verifier.satisfyExact("IP = 127.0.0.1");
verifier.satisfyExact("browser = Chrome')");
console.log("After adding more facts, this macaroon is " + (verifier.isValid(secret) ? "valid": "invalid") )


// There is also a more general way to check caveats, via callbacks. When providing such a callback to the verifier, it is able to check if the caveat satisfies special constrains.
macaroon = new MacaroonsBuilder(location, secretKey, identifier)
    .add_first_party_caveat("time < 2042-01-01T00:00")
    .getMacaroon();
verifier = new MacaroonsVerifier(macaroon);
console.log("This timestamp macaroon is " + (verifier.isValid(secretKey) ? "valid": "invalid") )

verifier.satisfyGeneral(libVerifier.TimestampCaveatVerifier);
console.log("After verify timestamp, this macaroon is " + (verifier.isValid(secretKey) ? "valid": "invalid") )
