var wallet_api_url = 'https://blockchain.info/ru/q/addressbalance/';
var wallets = [
    '115p7UMMngoj1pMvkpHijcRdfJNXj6LrLn',
    '13AM4VW2dhxYgXeQepoHkHSQuy6NgaEb94',
    '12t9YDPgwueZ9NyMgw519p7AA8isjr6SMw',
];
var promises = [];

function updateWallets() {
    wallets.forEach(function(wallet, i, arr) {
        updateWallet(wallet, i);
    });

    Promise.all(promises).then(function(values) {
        var total = 0;

        values.forEach(function(item, i, arr) {
            var amount = item / 100000000;
            total += amount;
            $('.wallets > div .wallet').eq(i).html(amount);
        });

        total = Math.round(total * 100) / 100;

        $('#total').html(total);
    });
}

function updateWallet(wallet, i) {
    var url = wallet_api_url + wallet;
    promises[i] = $.get(url);
}

$(document).ready(function() {
    setInterval(updateWallets, 10000);
    updateWallets();

    $('[data-action="map"]').on('click', function() {
        $('#map').toggleClass('visible');
    });
});

