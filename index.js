var wallet_api_url = 'https://blockchain.info/ru/q/addressbalance/';
var ticker_api_url = 'https://blockchain.info/ru/ticker?cors=true';
var wallets = [
    '115p7UMMngoj1pMvkpHijcRdfJNXj6LrLn',
    '13AM4VW2dhxYgXeQepoHkHSQuy6NgaEb94',
    '12t9YDPgwueZ9NyMgw519p7AA8isjr6SMw',
];
var promises = [];
var btc = 0;
var usd = 0;

function updateAll() {
    btc = 0;

    updateWallets();
    updateTicker();

    Promise.all(promises).then(function(values) {
        wallets.forEach(function(item, i, arr) {
            var amount = values[i] / 100000000;
            btc += amount;
            $('.wallets > div .wallet').eq(i).html(amount);
        });

        var currency = values[3]['USD'];
        usd = btc * currency.buy;
        usd = currency.symbol + Math.round(usd).toLocaleString()
        $('#usd-total').html('(~' + usd + ')');

        btc = Math.round(btc * 100) / 100;
        $('#btc-total').html(btc);
    });
}

function updateWallets() {
    wallets.forEach(function(wallet, i, arr) {
        updateWallet(wallet);
    });
}

function updateWallet(wallet) {
    var url = wallet_api_url + wallet;
    promises.push($.get(url));
}

function updateTicker() {
    promises.push($.get(ticker_api_url));
}

$(document).ready(function() {
    // Init wallets
    updateAll();

    // Run wallets auto-update
    setInterval(updateWallets, 10000);

    // Run ticker auto-update
    setInterval(updateTicker, 300000);

    // Toggle Infection map
    $('[data-action="map"]').on('click', function() {
        $('#map').toggleClass('visible');
    });
});

