// require('babel-polyfill')
// const Transport = require('@ledgerhq/hw-transport-webusb').default
require("babel-core/register");
require("babel-polyfill");
const AppXtz = require('@obsidiansystems/hw-app-xtz').default
// const AppXtz = require('@ledgerhq/hw-app-eth').default
const TransportU2F = require('@ledgerhq/hw-transport-u2f').default
// const Transport = require('@ledgerhq/hw-transport-node-hid').default
const TransportWEB = require('@ledgerhq/hw-transport-webusb').default

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


