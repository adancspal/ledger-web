// require('babel-polyfill')
// const Transport = require('@ledgerhq/hw-transport-webusb').default
require("babel-core/register");
require("babel-polyfill");
const AppXtz = require('@obsidiansystems/hw-app-xtz').default
// const AppXtz = require('@ledgerhq/hw-app-eth').default
const TransportU2F = require('@ledgerhq/hw-transport-u2f').default
// const Transport = require('@ledgerhq/hw-transport-node-hid').default
const TransportWEB = require('@ledgerhq/hw-transport-webusb').default
const bs58check = require('bs58check');
const _sodium = require('libsodium-wrappers');

window.getAddressU2F = async function() {
    const curve = 0
    const derivationPath = "44'/1729'/0'/0'"
    let transport
    const devices = await TransportU2F.list()
    console.log('Devices: ')
    console.log(devices)
    if (devices.length > 0) {
        try {
            transport = await TransportU2F.create()
        } catch {
            throw new Error('Ledger device was detected but could not establish connection. Try to run this command with elevated privileges (root / admin)')
        }
    } else {
        throw new Error('Cannot detect a Ledger device. If it is connected, make sure it is unlocked and/or try to run this command with elevated privileges (root / admin)')
    }

    const xtz = new AppXtz(transport)
    // Get the address
    let result
    try {
        result = await xtz.getAddress(derivationPath, true, curve)
    } catch(e) {
        result = e
    }

    console.log('We got this PK from the device: ')
    console.log(result)

    console.log('Which results in this address: ')
    console.log(await getTz1Address(result.publicKey))

    return result
}

window.getAddressWEB = async function() {
    const curve = 0
    const derivationPath = "44'/1729'/0'/0'"
    let transport
    const devices = await TransportWEB.list()
    console.log('Devices: ')
    console.log(devices)
    if (devices.length > 0) {
        try {
            transport = await TransportWEB.create()
        } catch {
            throw new Error('Ledger device was detected but could not establish connection. Try to run this command with elevated privileges (root / admin)')
        }
    } else {
        throw new Error('Cannot detect a Ledger device. If it is connected, make sure it is unlocked and/or try to run this command with elevated privileges (root / admin)')
    }
    // await _sodium.ready
    // const sodium = _sodium
    // const unsigned = sodium.from_hex('03' + transaction)
    const xtz = new AppXtz(transport)
    // Get the address
    let result
    try {
        result = await xtz.getAddress(derivationPath, true, curve)
        // result = await xtz.getAddress("44'/60'/0'/0/0")
    } catch(e) {
        result = e
    }

    console.log('We got this PK from the device: ')
    console.log(result)
    return result
}

async function getTz1Address(pk) {

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


