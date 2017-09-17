/**
 * Loops until you have no ad crates left.
 * Max loops count of 6.
 * return true/false
 */
function useAdCrates() {
    var myUrl = getProperty( 'propUrl' );
    var myCrateCheckSite = UrlFetchApp.fetch( myUrl + '&message=useItem' );
    var myCrateCheckJson = JSON.parse( myCrateCheckSite );
    if ( myCrateCheckJson.user_items[ 30002 ] != null || myCrateCheckJson.user_items[ 30001 ] != null ) {
        for ( var i = 0; i < 6; i++ ) {
            // VIP crates
            var myCrate1 = UrlFetchApp.fetch( myUrl + '&message=useAdLockedItem&item_id=30002' );
            //	sleep 5 seconds(google time?) to give a synapse a chance catch up..
            Utilities.sleep( 5000 );
            // non-VIP crates
            var myCrate2 = UrlFetchApp.fetch( myUrl + '&message=useAdLockedItem&item_id=30001' );
            var myCrateCheckSite = UrlFetchApp.fetch( myUrl + '&message=useItem' );
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
/**
 * Loops until you have full ads.
 * Max loops count of 6.
 * return false/boost count
 */
function boostAds() {
    var myUrl = getProperty( 'propUrl' );
    for ( var i = 0; i < 6; i++ ) {
        var myBoostSite = UrlFetchApp.fetch( myUrl + '&message=getBoostLevel' );
        var myBoostJson = JSON.parse( myBoostSite );
        var myBoostStatus = myBoostJson.user_data.boost_level;
        var myBoostCheck = UrlFetchApp.fetch( myUrl + '&message=recordAdBoost' );
        var myBoostCheckJson = JSON.parse( myBoostCheck );
        if ( myBoostCheckJson.hasOwnProperty( 'user_data' ) != false ) {
            i += 1;
        } // if it fails to load the page don't count this loop..
        if ( myBoostStatus == 3 ) {
            return myBoostStatus
        }
        //	Sleep 2 seconds between each boost to allow synapse to catch up.
        Utilities.sleep( 2000 );
    }
    return false
}
