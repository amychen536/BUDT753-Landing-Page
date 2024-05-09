// app.js
document.addEventListener('DOMContentLoaded', function () {
    const app = {
        ethereum: window.ethereum,
        provider: null,
        signer: null,
        contract: null,
        accounts: null,
        contractAddress: "0xd55ae38e265c0d1978fbe5e51f46aadee76e4e5b", // Update with your contract address
        erc20Abi: [
            "function name() view returns (string)",
            "function symbol() view returns (string)",
            "function totalSupply() view returns (uint256)",
            "function balanceOf(address) view returns (uint256)",
            "function transfer(address to, uint256 amount) returns (bool)"
        ],
        domElements: {
            connectBtn: document.getElementById('connect-btn'),
            contractTitle: document.getElementById('contract-title'),
            totalSupplyEl: document.getElementById('total-supply-el'),
            userBalanceEl: document.getElementById('user-balance-el'),
            feedbackMsgEl: document.getElementById('feedback-msg'),
            errorMsgEl: document.getElementById('error-msg')
        },

        init: function() {
            this.bindEvents();
            this.checkWallet();
        },

        bindEvents: function() {
            this.domElements.connectBtn.addEventListener('click', this.connectWallet.bind(this));
        },

        checkWallet: function() {
            if (!this.ethereum) {
                this.displayError("Please install MetaMask to use this site.");
                return;
            }
            this.provider = new ethers.providers.Web3Provider(this.ethereum);
        },

        connectWallet: async function() {
            try {
                this.accounts = await this.provider.send("eth_requestAccounts", []);
                this.signer = this.provider.getSigner();
                this.updateContractDetails();
            } catch (error) {
                this.displayError("Failed to connect wallet. " + error.message);
            }
        },

        updateContractDetails: async function() {
            try {
                this.contract = new ethers.Contract(this.contractAddress, this.erc20Abi, this.signer);
                const name = await this.contract.name();
                const symbol = await this.contract.symbol();
                const totalSupply = await this.contract.totalSupply();
                const userBalance = await this.contract.balanceOf(this.accounts[0]);

                this.domElements.contractTitle.innerText = `${name} (${symbol})`;
                this.domElements.totalSupplyEl.innerText = ethers.utils.formatUnits(totalSupply, 18);
                this.domElements.userBalanceEl.innerText = ethers.utils.formatUnits(userBalance, 18);
                this.displayFeedback("Contract details updated successfully.");
            } catch (error) {
                this.displayError("Failed to fetch contract details. " + error.message);
            }
        },

        displayFeedback: function(message) {
            this.domElements.feedbackMsgEl.innerText = message;
            setTimeout(() => {
                this.domElements.feedbackMsgEl.innerText = '';
            }, 5000);
        },

        displayError: function(message) {
            this.domElements.errorMsgEl.innerText = message;
            setTimeout(() => {
                this.domElements.errorMsgEl.innerText = '';
            }, 5000);
        }
    };

    app.init();
});