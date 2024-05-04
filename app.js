document.getElementById('buyTokenBtn').addEventListener('click', async function() {
    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);

        try {
            // New way to request account access (EIP-1102)
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];
            console.log('Connected account:', account);

            const contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE';
            const abi = [
                {
                    "constant": false,
                    "inputs": [{"name": "to", "type": "address"}, {"name": "amount", "type": "uint256"}],
                    "name": "mint",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "decimals",
                    "outputs": [{"name": "", "type": "uint8"}],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                }
            ];

            const contract = new web3.eth.Contract(abi, contractAddress);

            // Get the amount to buy from the input field
            const inputAmount = document.getElementById('tokenAmount').value;
            const amountToBuy = inputAmount ? parseInt(inputAmount) : 0;
            if (amountToBuy <= 0) {
                alert('Please enter a valid token amount.');
                return;
            }

            const decimals = await contract.methods.decimals().call();
            const amount = web3.utils.toBN(amountToBuy).mul(web3.utils.toBN(10).pow(web3.utils.toBN(decimals)));

            // Execute the mint function
            contract.methods.mint(account, amount.toString()).send({from: account})
                .on('transactionHash', hash => {
                    console.log('Transaction Hash:', hash);
                    document.getElementById('buyTokenBtn').innerText = 'Transaction Submitted...';
                })
                .on('receipt', receipt => {
                    console.log('Receipt:', receipt);
                    alert('Tokens minted successfully!');
                    document.getElementById('buyTokenBtn').innerText = 'Buy Tokens';
                })
                .on('error', (error, receipt) => {
                    console.error('Error:', error);
                    alert('Transaction failed!');
                    document.getElementById('buyTokenBtn').innerText = 'Buy Tokens';
                });

        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
            alert('Failed to connect to MetaMask. Please ensure that it is installed and that you are logged in.');
        }
    } else {
        alert('Please install MetaMask!');
    }
});

window.addEventListener('load', function() {
    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        web3.eth.getAccounts()
            .then(accounts => {
                if (accounts.length > 0) {
                    document.getElementById('walletConnected').style.display = 'inline';
                    document.getElementById('connectWalletBtn').style.display = 'none';
                } else {
                    document.getElementById('walletConnected').style.display = 'none';
                    document.getElementById('connectWalletBtn').style.display = 'inline';
                    setupConnectButton(web3);
                }
            })
            .catch(error => {
                console.error('Failed to get accounts:', error);
            });
    } else {
        alert('Please install MetaMask!');
    }
});

function setupConnectButton(web3) {
    const button = document.getElementById('connectWalletBtn');
    button.addEventListener('click', async () => {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' })
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                document.getElementById('walletConnected').style.display = 'inline';
                button.style.display = 'none';
            }
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
        }
    });
}
