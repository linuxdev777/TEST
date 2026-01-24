const CONTRACT = "0xa123f03bfda76c4632e647a9f2fb3ad833ec123a";
const PRICE = 0.0000001; // ETH
const CHAIN_ID = "0x2105"; // Base Mainnet

const ABI = [
  "function mint(uint256 amount) payable"
];

let provider, signer, contract;

document.getElementById("connect").onclick = connect;
document.getElementById("mint").onclick = mint;

async function connect() {
  if (!window.ethereum) {
    alert("No wallet detected");
    return;
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });

  // FORZAR BASE
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CHAIN_ID }]
    });
  } catch (e) {
    document.getElementById("status").innerText = "Switch to Base network";
    return;
  }

  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
  contract = new ethers.Contract(CONTRACT, ABI, signer);

  document.getElementById("status").innerText = "Wallet connected ✅";
}

async function mint() {
  if (!contract) {
    document.getElementById("status").innerText = "Connect wallet first";
    return;
  }

  const amount = document.getElementById("amount").value;
  const value = ethers.parseEther((amount * PRICE).toString());

  try {
    document.getElementById("status").innerText = "Minting...";
    const tx = await contract.mint(amount, { value });
    await tx.wait();
    document.getElementById("status").innerText = "Mint success 🚀";
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "Mint failed ❌";
  }
}
