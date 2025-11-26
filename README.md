# Locus - Decentralized Location Proofs

Locus is a decentralized application (dApp) built on the Sui Network that allows users to verify their presence at specific locations and submit proposals.

## Project Structure

- **`sources/`**: Contains the Move smart contracts.
  - `locus.move`: The main module for location check-ins and proposals.
- **`frontend/`**: A React application for interacting with the smart contract.
  - Built with Vite, React, TypeScript, Tailwind CSS, and `@mysten/dapp-kit`.

## Features

- **Check In**: Verify your location on-chain (currently hardcoded to "Tokyo" for demo purposes).
- **Submit Proposal**: Submit text-based proposals to the blockchain.
- **Testnet Support**: Configured to work with the Sui Testnet.

## Getting Started

### Smart Contract

1. Install Sui CLI.
2. Switch to Testnet: `sui client switch --env testnet`
3. Build and publish: `sui client publish --gas-budget 100000000`

### Frontend

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## License

MIT
