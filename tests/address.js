const bs58check = require('bs58check');
const _sodium = require('libsodium-wrappers');

getTz1Address('024ce5cc6cf8006ebae10c9a6e28d262712754116442b32780257fc143f1293e97').then((result) => {
    console.log(result)
})

async function getTz1Address(pk) {
    const hex = pk
    await _sodium.ready
    const sodium = _sodium
    // function getAddressFromOptimized(hex){
        var address, prefix;
        if (hex.substring(0,2) == "00") {
            if (hex.substring(2,4) == "00") prefix = new Uint8Array([6, 161, 159]);
            if (hex.substring(2,4) == "01") prefix = new Uint8Array([6, 161, 161]);
            if (hex.substring(2,4) == "02") prefix = new Uint8Array([6, 161, 164]);
            address = hex.substring(4,44);
        } else if (hex.substring(0,2) == "01"){
            prefix = new Uint8Array([2,90,121]);
            address = hex.substring(2,42);
        } else if(hex.substring(0,2) == "02"){
            prefix = new Uint8Array([6, 161, 159]);
            address = hex.substring(2);
        }
        // console.log(address);
        const uintAddress = Uint8Array.from(Buffer.from(address,'hex'));
        const hash = sodium.crypto_generichash(20, uintAddress)
        return b58cencode(hash, prefix);
    // }
    // getAddressFromOptimized('02ce8866788f5220bb27f8b2b1c06100d457fc273ed1a0c13caf099567811386ec');
}

function b58cencode(payload, prefix) {
    const n = new Uint8Array(prefix.length + payload.length);
    n.set(prefix);
    n.set(payload, prefix.length);
    return bs58check.encode(new Buffer(n, 'hex'));
}
