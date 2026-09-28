# CSI Wires mock

A local stand-in for the CSI Wires queue and wire view used by First Southern National Bank. It is not CSI, and it is not part of SessionTrust.

`npm start` serves the app at http://127.0.0.1:4173.

The queue starts with five wires. Open one to see a read-only view whose field ids match the CSI wire page. **New wire** and **Edit** change mock data stored in this browser (`localStorage` key `csi-wires-mock`). **Reset to seed data** restores the original five wires and drops anything you added.

The amber toolbar is mock-only. It is not part of the wire view a reader should scrape.
