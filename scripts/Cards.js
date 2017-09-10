function _BuyCardAndUpgrade() { //Buy, Upgrade and recycle
    // _XML = UrlFetchApp.fetch('https://cb-live.synapse-games.com/assets/cards.xml').getContentText();
    var url = getProperty( '_url' );
    for ( var z = 0; z < 3; z++ ) {
        UpdateStatus( 'Account ' + getProperty( '_name' ) + ' Daily Mission ' + TimeFormated() );
        var buycard = _BuyCard( url, _XML );
        for ( var i = 1; i < buycard.length; i++ ) {
            var cardinfo = buycard[ i ].split( ',' );
            var Upgrade = _UpgradeCard( url, cardinfo[ 1 ] );
            if ( cardinfo[ 0 ] <= getProperty( 'Cards rarities to recycle' ) ) {
                var Recycle = _RecycleCard( url, cardinfo[ 1 ] );
                Logger.log( 'Rarity:' + cardinfo[ 0 ] + ',Card:' + cardinfo[ 3 ] + ',Wats:' + Recycle );
                AddLogCards( 'BuyCardAndUpgrade', 'Rarity:' + cardinfo[ 0 ] + ',Card:' + cardinfo[ 3 ] + ',Wats:' + Recycle )
            } else {
                Logger.log( 'Rarity:' + cardinfo[ 0 ] + ' Card:' + cardinfo[ 3 ] );
                AddLogCards( 'BuyCardAndUpgrade', 'Rarity:' + cardinfo[ 0 ] + ',Card:' + cardinfo[ 3 ] )
            }
        }
    }
    _CompleteAchievemnts( url, '5009' );
    _CompleteAchievemnts( url, '5010' );
    return true
}

function _BuyCardAndRecycle() { //Buy and recycle
    //_XML = UrlFetchApp.fetch('https://cb-live.synapse-games.com/assets/cards.xml').getContentText();
    var Money = Math.round( GetMoney() / 1000 ) * 1000; //Get current money and round to nearest thousand.
    var mathz = ( Money - getProperty( 'Auto buy limit' ) ) / 1000; //Get the amount of cards you can buy,
    if ( mathz <= 0 ) {
        return false
    }
    var url = getProperty( '_url' );
    for ( var z = 0; z < mathz; z++ ) {
        UpdateStatus( 'Account ' + getProperty( '_name' ) + ' Buying & Recycling cards ' + TimeFormated() );
        var buycard = _BuyCard( url, _XML );
        for ( var i = 1; i < buycard.length; i++ ) {
            var cardinfo = buycard[ i ].split( ',' );
            if ( cardinfo[ 0 ] <= getProperty( 'Cards rarities to recycle' ) ) {
                var Recycle = _RecycleCard( url, cardinfo[ 1 ] );
                AddLogCards( 'BuyCardAndRecycle', 'Rarity:' + cardinfo[ 0 ] + ',Card:' + cardinfo[ 3 ] + ',Wats:' + Recycle )
                Logger.log( 'Rarity:' + cardinfo[ 0 ] + ' Card:' + cardinfo[ 3 ] + ' Wats:' + Recycle );
            } else {
                AddLogCards( 'BuyCardAndRecycle', 'Rarity:' + cardinfo[ 0 ] + ',Card:' + cardinfo[ 3 ] )
                Logger.log( 'Rarity:' + cardinfo[ 0 ] + ' Card:' + cardinfo[ 3 ] );
            }
        }
    }
    _CompleteAchievemnts( url, '5010' );
    return true
}

function GetMoney() { //Returns Money.
    var url = getProperty( '_url' );
    var Energy = UrlFetchApp.fetch( url + '&message=getUserAccount' );
    var Energy_Json = JSON.parse( Energy );
    var Money = Energy_Json.user_data.money
    return Money
}

function _GetCardRarity( id, xml ) { //seach xml and get card by ID
    var document = XmlService.parse( xml );
    var root = document.getRootElement();
    var entries = document.getRootElement().getChildren( 'unit' );
    for ( var i = 0; i < entries.length; i++ ) {
        var GetID = entries[ i ].getChild( 'id' ).getText();
        if ( GetID == id ) {
            var GetRarity = entries[ i ].getChild( 'rarity' ).getText();
            var GetName = entries[ i ].getChild( 'name' ).getText();
            return [ GetRarity, GetName ];
        }
    }
}

function _RecycleCard( myUrl, Card ) { //Recycle card by Index
    var Salvage = UrlFetchApp.fetch( myUrl + '&message=salvageUnitList&units=%5b' + Card + '%5d' );
    var Salvage_Json = JSON.parse( Salvage );
    return Salvage_Json.rewards.sp
}

function _UpgradeCard( myUrl, Card ) { //Upgrade card by Index
    var Upgrade = UrlFetchApp.fetch( myUrl + '&message=upgradeUnit&unit_index=' + Card );
    var Upgrade_Json = JSON.parse( Upgrade );
    return Upgrade_Json.user_units[ Card ].level
}

function _BuyCard( myUrl, XML ) { // 1 = Rarity, 2 = Index, 3 = item id
    var BuyPack = UrlFetchApp.fetch( myUrl + '&message=buyStoreItem&data_usage=0&expected_cost=1000&cost_type=2&item_id=1' );
    var BuyPack_JSON = JSON.parse( BuyPack );
    if ( BuyPack_JSON.result_message != null ) {
        return false
    }
    var cards = ''
    for ( var j = 0; j < BuyPack_JSON.new_units.length; j++ ) {
        var UnitIndex = BuyPack_JSON.new_units[ j ].unit_index
        var unitId = BuyPack_JSON.new_units[ j ].unit_id
        var Rarity = _GetCardRarity( unitId, XML );
        cards = cards + '|' + [ Rarity[ 0 ], UnitIndex, unitId, Rarity[ 1 ] ]
    }
    return cards.split( '|' )
}
