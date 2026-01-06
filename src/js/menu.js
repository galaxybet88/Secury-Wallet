// Import ethers.js (jika menggunakan bundler seperti Webpack/Vite)
// Jika tidak, gunakan CDN: <script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"></script>

// Alamat kontrak (ganti dengan alamat kontrak SEC yang sudah dideploy)
const CONTRACT_ADDRESS = "0x123...abc"; // Ganti dengan alamat kontrakmu di BSC
const TAX_WALLET_ADDRESS = "0xAdDB3Efe158b4f0038BB06fE5f57f74490000000"; // Sesuai kontrak

// ABI kontrak (generate dari kontrak Solidity)
const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_maxTxAmount",
                "type": "uint256"
            }
        ],
        "name": "MaxTxAmountUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "_maxTaxSwap",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "_maxTxAmount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "_maxWalletSize",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "_taxSwapThreshold",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "createLP",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "enableTrading",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "manualSwap",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Inisialisasi variabel global
let provider;
let signer;
let contract;
let currentAccount = null;

// Fungsi untuk koneksi ke MetaMask
async function connectWallet() {
    if (window.ethereum) {
        try {
            // Request akun dari MetaMask
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            currentAccount = accounts[0];
            console.log("Connected to wallet:", currentAccount);

            // Inisialisasi provider dan signer
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            // Tampilkan alamat dompet di UI
            document.getElementById("wallet-address").textContent = `${currentAccount.substring(0, 6)}...${currentAccount.substring(38)}`;

            // Load data kontrak
            await loadContractData();
        } catch (error) {
            console.error("Error connecting to wallet:", error);
            alert("Failed to connect wallet. Please try again.");
        }
    } else {
        alert("Please install MetaMask!");
    }
}

// Fungsi untuk memuat data kontrak (saldo, total supply, dll.)
async function loadContractData() {
    if (!contract) return;

    try {
        // Ambil data kontrak
        const name = await contract.name();
        const symbol = await contract.symbol();
        const totalSupply = await contract.totalSupply();
        const decimals = await contract.decimals();
        const maxTxAmount = await contract._maxTxAmount();
        const maxWalletSize = await contract._maxWalletSize();
        const balance = await contract.balanceOf(currentAccount);

        // Tampilkan di UI
        document.getElementById("token-name").textContent = name;
        document.getElementById("token-symbol").textContent = symbol;
        document.getElementById("total-supply").textContent = ethers.utils.formatUnits(totalSupply, decimals);
        document.getElementById("max-tx-amount").textContent = ethers.utils.formatUnits(maxTxAmount, decimals);
        document.getElementById("max-wallet-size").textContent = ethers.utils.formatUnits(maxWalletSize, decimals);
        document.getElementById("your-balance").textContent = ethers.utils.formatUnits(balance, decimals);
    } catch (error) {
        console.error("Error loading contract data:", error);
    }
}

// Fungsi untuk transfer token
async function transferTokens() {
    const recipient = document.getElementById("transfer-recipient").value;
    const amount = document.getElementById("transfer-amount").value;

    if (!recipient || !amount) {
        alert("Please enter recipient and amount!");
        return;
    }

    try {
        const decimals = await contract.decimals();
        const amountWei = ethers.utils.parseUnits(amount, decimals);

        // Panggil fungsi transfer di kontrak
        const tx = await contract.transfer(recipient, amountWei);
        console.log("Transfer transaction sent:", tx.hash);
        alert(`Transfer successful! Transaction hash: ${tx.hash}`);
        await loadContractData(); // Refresh saldo
    } catch (error) {
        console.error("Error transferring tokens:", error);
        alert("Transfer failed. See console for details.");
    }
}

// Fungsi untuk enable trading (hanya pemilik)
async function enableTrading() {
    try {
        const tx = await contract.enableTrading();
        console.log("Enable trading transaction sent:", tx.hash);
        alert(`Trading enabled! Transaction hash: ${tx.hash}`);
    } catch (error) {
        console.error("Error enabling trading:", error);
        alert("Failed to enable trading. See console for details.");
    }
}

// Fungsi untuk manual swap (hanya tax wallet)
async function manualSwap() {
    try {
        const tx = await contract.manualSwap();
        console.log("Manual swap transaction sent:", tx.hash);
        alert(`Manual swap successful! Transaction hash: ${tx.hash}`);
    } catch (error) {
        console.error("Error performing manual swap:", error);
        alert("Manual swap failed. See console for details.");
    }
}

// Fungsi untuk create LP (hanya pemilik)
async function createLP() {
    try {
        const tx = await contract.createLP({ value: ethers.utils.parseEther("0.1") }); // Kirim 0.1 BNB untuk likuiditas
        console.log("Create LP transaction sent:", tx.hash);
        alert(`LP created! Transaction hash: ${tx.hash}`);
    } catch (error) {
        console.error("Error creating LP:", error);
        alert("Failed to create LP. See console for details.");
    }
}

// Fungsi untuk memeriksa apakah user adalah pemilik
async function checkOwner() {
    try {
        const owner = await contract.owner();
        if (currentAccount.toLowerCase() === owner.toLowerCase()) {
            document.getElementById("owner-actions").style.display = "block";
        }
    } catch (error) {
        console.error("Error checking owner:", error);
    }
}

// Panggil fungsi ini saat halaman dimuat
window.onload = function() {
    // Tambahkan event listener untuk tombol
    document.getElementById("connect-wallet").addEventListener("click", connectWallet);
    document.getElementById("transfer-button").addEventListener("click", transferTokens);
    document.getElementById("enable-trading-button").addEventListener("click", enableTrading);
    document.getElementById("manual-swap-button").addEventListener("click", manualSwap);
    document.getElementById("create-lp-button").addEventListener("click", createLP);
};
