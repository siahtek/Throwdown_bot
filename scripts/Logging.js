/**
 * Save info on cards to logs for writing later.
 */
function AddLogCards( aSection, aReward ) {
    var myString = getProperty( aSection );
    var myCount = getProperty( aSection + 'propCount' );
    if ( myString == null ) {
        myString = ''
    }
    if ( myCount == null ) {
        myCount = 0
    }
    myString = myString + aReward + '\n';
    setProperty( aSection, myString );
    setProperty( aSection + 'propCount', parseInt( myCount ) + 1 );
}
/**
 * Updated Gui with Arena or Adventure energy.
 */
function updateEnergy( aCheck, aMax, aSection ) {
    var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Settings" );
    if ( aSection == 'Arena' ) {
        mySheet.getRange( "D6" ).setValue( 'Arena Energy: ' + aCheck + '/' + aMax );
    } else {
        mySheet.getRange( "C6" ).setValue( 'Adventure Energy: ' + aCheck + '/' + aMax );
    }
}
/**
 * Update Gui with time to next check.
 */
function updateNext( aCheck ) {
    var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Settings" );
    if ( aCheck == true ) {
        mySheet.getRange( "C7" ).setValue( 'Next check ' + getUpcomingTime() );
    } else {
        mySheet.getRange( "C7" ).setValue( 'Disabled at ' + getTime() );
    }
}
/**
 * Update Gui with time to next rumble.
 */
function updateNextRumble( aCheck, aTime ) {
    var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Settings" );
    if ( aCheck == true ) {
        mySheet.getRange( "C8" ).setValue( 'Next Rumble Check ' + aTime );
    } else {
        mySheet.getRange( "C8" ).setValue( 'Disabled at ' + getTime() );
    }
}
/**
 * Save info on attack rewards to logs.
 */
function addLog( aSection, aReward ) {
    var myRewards = parseRewards( aReward );
    var myString = ''
    var myCount = 0
    myString = getProperty( aSection );
    myCount = getProperty( aSection + 'propCount' );
    myString = myString + myRewards + '\n';
    setProperty( aSection, myString );
    setProperty( aSection + 'propCount', parseInt( myCount ) + 1 );
}
/**
 * Write logs to Logs in sheet.
 */
function writeLogs( aSection, aRow ) {
    var myEmptyRow = getFirstEmptyRow();
    var myCount = 0
    var myString = ''
    var myString = getProperty( aSection );
    myCount = getProperty( aSection + 'propCount' );
    var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( 'Logs' );
    if ( myString != null ) {
        mySheet.getRange( aRow + "" + myEmptyRow ).setNote( myString );
    }
    mySheet.getRange( aRow + "" + myEmptyRow ).setValue( myCount );
    setProperty( aSection, '' )
    setProperty( aSection + 'propCount', 0 );
}
/**
 * find the first empty row on logs for writing logs.
 * return first empty row
 */
function getFirstEmptyRow() {
    var spr = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Logs" );
    var column = spr.getRange( 'A:A' );
    var values = column.getValues();
    var ct = 0;
    while ( values[ ct ][ 0 ] != "" ) {
        ct++;
    }
    return ( ct + 1 );
}
/**
 * Write Logs to sheet Logs.
 */
function writeLogs() {
    var myCheck = false;
    if ( getProperty( '_logs_RefillChallenge' + 'propCount' ) != 0 || "" ) {
        myCheck = true;
    }
    if ( getProperty( '_logs_NoneRefillChallenge' + 'propCount' ) != 0 || "" ) {
        myCheck = true;
    }
    if ( getProperty( '_logs_Adventure' + 'propCount' ) != 0 || "" ) {
        myCheck = true;
    }
    if ( getProperty( '_logs_Arena' + 'propCount' ) != 0 || "" ) {
        myCheck = true;
    }
    if ( getProperty( 'BuyCardAndUpgrade' + 'propCount' ) != 0 || "" ) {
        myCheck = true;
    }
    if ( getProperty( 'BuyCardAndRecycle' + 'propCount' ) != 0 || "" ) {
        myCheck = true;
    }
    if ( getProperty( '_logs_Rumble' + 'propCount' ) != 0 || "" ) {
        myCheck = true;
    }
    if ( myCheck == true ) {
        updateStatus( 'Account ' + getProperty( 'propName' ) + ' Writing Logs ' + getTime() );
        writeLogs( '_logs_RefillChallenge', 'B' );
        writeLogs( '_logs_NoneRefillChallenge', 'C' );
        writeLogs( '_logs_Adventure', 'D' );
        writeLogs( '_logs_Arena', 'E' );
        writeLogs( 'BuyCardAndUpgrade', 'F' );
        writeLogs( 'BuyCardAndRecycle', 'G' );
        writeLogs( '_logs_Rumble', 'H' );
        writeLogs( '_time', 'A' );
    }
}
/**
 * Parse/Convert attack rewards to string.
 * return error/rewards string
 */
function parseRewards( aRewards ) {
    var myItemInfo = UrlFetchApp.fetch( getProperty( 'propUrl' ) + '&message=useItem' );
    var myItemInfoJson = JSON.parse( myItemInfo );
    var myRewardsJson = JSON.parse( aRewards )[ 0 ]
    if ( myRewardsJson.gold != null ) {
        var myGold = myRewardsJson.gold
    } else {
        var myGold = 0
    }
    if ( myRewardsJson.sp != null ) {
        var myWatts = myRewardsJson.sp
    } else {
        var myWatts = 0
    }
    if ( myRewardsJson.xp != null ) {
        var myXp = myRewardsJson.xp
    } else {
        var myXp = 0
    }
    if ( myRewardsJson.rating_change != null ) {
        var myRatingChange = myRewardsJson.rating_change
    } else {
        var myRatingChange = 0
    }
    if ( myRewardsJson.guild_war_points != null ) {
        var myGuildWarPoints = myRewardsJson.guild_war_points
    } else {
        var myGuildWarPoints = 0
    }
    var myListOfItems = ''
    var myString = ''
    if ( myRewardsJson.item != null ) {
        var myListOfItems = myRewardsJson.item
    } else if ( myRewardsJson.items != null ) {
        var myListOfItems = myRewardsJson.items
    }
    if ( myListOfItems != null ) {
        for ( var i = 0; i < myListOfItems.length; i++ ) {
            var myItem = myListOfItems[ i ].id;
            var myAmount = myListOfItems[ i ].number;
            if ( myItem == 30001 || myItem == 30002 ) {
                var myItemName = 'Adcrate'
            } else { //They are removed from the inventory before it can id them.
                var myItemName = myItemInfoJson.user_items[ myItem ].name;
            }
            myListOfItems = myListOfItems + ' [' + myItemName + ':' + myAmount + ']'
        }
    }
    if ( myGold != 0 ) {
        myString = myString + ' Gold:' + myGold
    }
    if ( myWatts != 0 ) {
        myString = myString + ' Watts:' + myWatts
    }
    if ( myGuildWarPoints != 0 ) {
        myString = myString + ' Guild War Points:' + myGuildWarPoints
    }
    if ( myXp != 0 ) {
        myString = myString + ' xp:' + myXp
    }
    if ( myRatingChange != 0 ) {
        myString = myString + ' RatingChange:' + myRatingChange
    }
    if ( myListOfItems != '' ) {
        myString = myString + ' items:' + myListOfItems
    }
    if ( myString == '' ) {
        myString = 'No rewards/Failed to load rewards'
    }
    return myString
}
