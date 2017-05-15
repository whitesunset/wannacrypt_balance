(function($) {
    var map_url = 'https://intel.malwaretech.com/WannaCrypt.html';
    var wallet_api_url = 'https://blockchain.info/ru/q/addressbalance/';
    var ticker_api_url = 'https://blockchain.info/ru/ticker?cors=true';
    var wallets = [
        '115p7UMMngoj1pMvkpHijcRdfJNXj6LrLn',
        '13AM4VW2dhxYgXeQepoHkHSQuy6NgaEb94',
        '12t9YDPgwueZ9NyMgw519p7AA8isjr6SMw',
    ];
    var donation_wallet = '1HF86CnYduNw3NGwAD2Tu5iCJqzmxT9cBd'
    var promises = [];
    var wallets_interval = 15000; // 15 seconds

    function donationButtonInit() {
        CoinWidgetCom.go({
            wallet_address: donation_wallet,
            currency: 'bitcoin',
            counter: 'count',
            lbl_button: 'Donate',
            lbl_count: 'donations',
            lbl_amount: 'BTC',
            lbl_address: 'Use address below to donate. Thanks!',
            qrcode: true,
            alignment: 'bl',
            decimals: 8,
            size: 'small',
            color: 'light',
            countdownFrom: '0',
            element: '#coinwidget-bitcoin-1CiDy8tuu5k4f2UTUZqLBjgjT82PDexuvz',
            onShow: function() {},
            onHide: function() {},
        });
    }

    function updateAll() {
        promises = [];

        updateWallets();
        updateTicker();

        Promise.all(promises).then(function(values) {
            var btc = 0;
            var usd = 0;

            wallets.forEach(function(item, i, arr) {
                var amount = Math.round(values[i] / 100000000 * 100) / 100;
                btc += amount;
                $('.wallets > div .wallet').eq(i).html(amount.toFixed(2));
            });

            $('#btc-total').html(btc.toFixed(2));

            var currency = values[3]['USD'];
            usd = btc * currency.buy;
            usd = currency.symbol + Math.round(usd).toLocaleString();
            $('#usd-total').html('(~' + usd + ')');
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
        setInterval(updateAll, wallets_interval);

        // Toggle Infection map
        $('[data-action="map"]').on('click', function() {
            var $map = $('#map');
            var $wrapper = $('#map .wrapper');
            var $iframe = $(
                '<iframe src="' + map_url + '"></iframe>');
            var visible = $map.hasClass('visible');

            if (visible) {
                $wrapper.empty();
                $('#map').removeClass('visible');
            } else {
                $wrapper.html($iframe);
                $('iframe', $wrapper).on('load', function() {
                    $('#map').addClass('visible');
                });
            }
        });

        // Init donation button
        donationButtonInit();

        // Init GA knocking
        riveted.init();
    });
})(jQuery);
