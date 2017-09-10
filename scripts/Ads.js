function useAdCrates() {
    var myUrl = getProperty( '_url' );
    var myCrateCheck = UrlFetchApp.fetch( myUrl + '&message=useItem' );
    var myCrateCheckJson = JSON.parse( myCrateCheck );
    if ( myCrateCheckJson.user_items[ 30002 ] != null || myCrateCheckJson.user_items[ 30001 ] != null ) {
        for ( var i = 0; i < 6; i++ ) {
            // VIP crates
            var Crate_1 = UrlFetchApp.fetch( myUrl + '&message=useAdLockedItem&item_id=30002' );
            Utilities.sleep( 5000 );
            // non-VIP crates
            var Crate_2 = UrlFetchApp.fetch( myUrl + '&message=useAdLockedItem&item_id=30001' ); 
            var myCrateCheck = UrlFetchApp.fetch( myUrl + '&message=useItem' );
            if ( myCrateCheckJson.user_items[ 30002 ] == null && myCrateCheckJson.user_items[ 30001 ] == null ) {
                Logger.log( 'Finished!' );
                return true;
            }
        }
        return true
    } else {
        return false
    }
}

function boostAds() {
    var myUrl = getProperty( '_url' );
    for ( var i = 0; i < 6; i++ ) {
        var myBoost = UrlFetchApp.fetch( myUrl + '&message=getUserAccount' );
        var myBoostJson = JSON.parse( myBoost );
        var myBoostStatus = myBoostJson.user_data.boost_level;
        UrlFetchApp.fetch( myUrl + '&message=recordboostAds' );
        if ( myBoostStatus == 3 ) {
            return myBoostStatus
        }
        Utilities.sleep( 2000 );
    }
    return false
}
