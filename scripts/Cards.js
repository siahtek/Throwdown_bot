/**
 * Checks if parameters are met then buys, upgrades and recycles cards.
 * return true
 */
function buyAndUpgradeCards() {
    var myUrl = getProperty( '_url' );
    for ( var z = 0; z < 3; z++ ) {
        updateStatus( 'Account ' + getProperty( '_name' ) + ' Daily Mission ' + formattedTime() );
        var myBoughtCard = buyCard( myUrl, theXml );
        for ( var i = 1; i < myBoughtCard.length; i++ ) {
            var myCardInfo = myBoughtCard[ i ].split( ',' );
            var myUpgradedCard = upgradeCard( myUrl, myCardInfo[ 1 ] );
            if ( myCardInfo[ 0 ] <= getProperty( 'Cards rarities to recycle' ) ) {
                var myrecycledCard = recycleCard( myUrl, myCardInfo[ 1 ] );
                Logger.log( 'Rarity:' + myCardInfo[ 0 ] + ',Card:' + myCardInfo[ 3 ] + ',Wats:' + myrecycledCard );
                AddLogCards( 'BuyCardAndUpgrade', 'Rarity:' + myCardInfo[ 0 ] + ',Card:' + myCardInfo[ 3 ] + ',Wats:' + myrecycledCard )
            } else {
                Logger.log( 'Rarity:' + myCardInfo[ 0 ] + ' Card:' + myCardInfo[ 3 ] );
                AddLogCards( 'BuyCardAndUpgrade', 'Rarity:' + myCardInfo[ 0 ] + ',Card:' + myCardInfo[ 3 ] )
            }
        }
    }
    completeAchievements( myUrl, '5009' );
    completeAchievements( myUrl, '5010' );
    return true
}
/**
 * Checks if parameters are met then buys and recycles cards.
 * return true
 */
function buyAndRecycleCards() {
    var myMoney = Math.round( getMoney() / 1000 ) * 1000; //Get current money and round to nearest thousand.
    var myMathZ = ( myMoney - getProperty( 'Auto buy limit' ) ) / 1000; //Get the amount of cards you can buy,
    if ( myMathZ <= 0 ) {
        return false
    }
    var myUrl = getProperty( '_url' );
    for ( var z = 0; z < myMathZ; z++ ) {
        updateStatus( 'Account ' + getProperty( '_name' ) + ' Buying & Recycling cards ' + formattedTime() );
        var myBoughtCard = buyCard( myUrl, theXml );
        for ( var i = 1; i < myBoughtCard.length; i++ ) {
            var myCardInfo = myBoughtCard[ i ].split( ',' );
            if ( myCardInfo[ 0 ] <= getProperty( 'Cards rarities to recycle' ) ) {
                var myRecycledCard = recycleCard( myUrl, myCardInfo[ 1 ] );
                AddLogCards( 'BuyCardAndRecycle', 'Rarity:' + myCardInfo[ 0 ] + ',Card:' + myCardInfo[ 3 ] + ',Wats:' + myRecycledCard )
                Logger.log( 'Rarity:' + myCardInfo[ 0 ] + ' Card:' + myCardInfo[ 3 ] + ' Wats:' + myRecycledCard );
            } else {
                AddLogCards( 'BuyCardAndRecycle', 'Rarity:' + myCardInfo[ 0 ] + ',Card:' + myCardInfo[ 3 ] )
                Logger.log( 'Rarity:' + myCardInfo[ 0 ] + ' Card:' + myCardInfo[ 3 ] );
            }
        }
    }
    completeAchievements( myUrl, '5010' );
    return true
}
/**
 * Return users current coin count.
 * return Money
 */
function getMoney() {
    var myUrl = getProperty( '_url' );
    var myEnergy = UrlFetchApp.fetch( myUrl + '&message=getUserAccount' );
    var myEnergyJson = JSON.parse( myEnergy );
    var myMoney = myEnergyJson.user_data.money
    return myMoney
}
/**
 * Converts card ID to rarity and name.
 * return [card Rarity,card name]
 */
function getCardRarity( aId ) {
    var myDoc = XmlService.parse( theXml );
    var myRootElement = myDoc.getRootElement();
    var myEntries = myDoc.getRootElement().getChildren( 'unit' );
    for ( var i = 0; i < myEntries.length; i++ ) {
        var myId = myEntries[ i ].getChild( 'id' ).getText();
        if ( myId == aId ) {
            var GetRarity = myEntries[ i ].getChild( 'rarity' ).getText();
            var GetName = myEntries[ i ].getChild( 'name' ).getText();
            return [ GetRarity, GetName ];
        }
    }
    myDoc = XmlService.parse( theXmlCombo );
    myRootElement = myDoc.getRootElement();
    myEntries = myDoc.getRootElement().getChildren( 'unit' );
    for ( var i = 0; i < myEntries.length; i++ ) {
        var myId = myEntries[ i ].getChild( 'id' ).getText();
        if ( myId == aId ) {
            var GetRarity = myEntries[ i ].getChild( 'rarity' ).getText();
            var GetName = myEntries[ i ].getChild( 'name' ).getText();
            return [ GetRarity, GetName ];
        }
    }
    myDoc = XmlService.parse( theXmlMythic );
    myRootElement = myDoc.getRootElement();
    myEntries = myDoc.getRootElement().getChildren( 'unit' );
    for ( var i = 0; i < myEntries.length; i++ ) {
        var myId = myEntries[ i ].getChild( 'id' ).getText();
        if ( myId == aId ) {
            var GetRarity = myEntries[ i ].getChild( 'rarity' ).getText();
            var GetName = myEntries[ i ].getChild( 'name' ).getText();
            return [ GetRarity, 'Mythic ' + GetName ];
        }
    }
    return [ 9, 'Unknown' ];
}
/**
 * Recycle card by Index
 * return recycle Watt value.
 */
function recycleCard( aUrl, aCard ) { //Recycle card by Index
    var mySalvageSite = UrlFetchApp.fetch( aUrl + '&message=salvageUnitList&units=%5b' + aCard + '%5d' );
    var mySalvageJson = JSON.parse( mySalvageSite );
    return mySalvageJson.rewards.sp
}
/**
 * Upgrade card by Index
 * return upgrade level
 */
function upgradeCard( aUrl, aCard ) { //Upgrade card by Index
    var myUpgradeSite = UrlFetchApp.fetch( aUrl + '&message=upgradeUnit&unit_index=' + aCard );
    var myUpgradeJson = JSON.parse( myUpgradeSite );
    return myUpgradeJson.user_units[ aCard ].level
}
/**
 * Buy 1 card pack from the store and return Index list.
 * return false/card list
 */
function buyCard( aUrl, aXml ) { // 1 = Rarity, 2 = Index, 3 = item id
    var myBoughtPackSite = UrlFetchApp.fetch( aUrl + '&message=buyStoreItem&data_usage=0&expected_cost=1000&cost_type=2&item_id=1' );
    var myBoughtPackJson = JSON.parse( myBoughtPackSite );
    if ( myBoughtPackJson.result_message != null ) {
        return false
    }
    var myCards = ''
    for ( var j = 0; j < myBoughtPackJson.new_units.length; j++ ) {
        var myUnitIndex = myBoughtPackJson.new_units[ j ].unit_index
        var myUnitId = myBoughtPackJson.new_units[ j ].unit_id
        var myRarity = getCardRarity( myUnitId );
        myCards = myCards + '|' + [ myRarity[ 0 ], myUnitIndex, myUnitId, myRarity[ 1 ] ]
    }
    return myCards.split( '|' )
}
