const CONTRACT_ADDRESS = "0xa123f03bfda76c4632e647a9f2fb3ad833ec123a";
const MINT_PRICE = "0.0000001"; // ETH

const ABI = [
  "function mint(uint256 amount) public payable"
];

let provider;
let signer;
let contract;

async function connectWallet() {
  if (!window.ethereum) {
    alert("No EVM wallet detected");
    return;
  }

  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();

  const network = await provider.getNetwork();

  // Base mainnet chainId = 8453
  if (network.chainId !== 8453n) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x2105" }],
      });
    } catch (e) {
      document.getElementById("status").innerText = "Switch to Base network";
      return;
    }
  }

  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  document.getElementById("status").innerText = "Wallet connected ✔";
}

async function mint() {
  if (!contract) {
    document.getElementById("status").innerText = "Connect wallet first";
    return;
  }

  const amount = document.getElementById("amount").value;
  const totalValue = ethers.parseEther(
    (Number(amount) * Number(MINT_PRICE)).toString()
  );

  try {
    document.getElementById("status").innerText = "Minting...";
    const tx = await contract.mint(amount, { value: totalValue });
    await tx.wait();
    document.getElementById("status").innerText = "Mint successful 🚀";
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "Mint failed ❌";
  }
}
