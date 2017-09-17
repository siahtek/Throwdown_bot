/**
 * Load needed function.
 */
function initUserDeck() {
    theProperties = PropertiesService.getScriptProperties()
    theSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( 'Settings' );
    loadUserSettings();
    var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Custom Decks" );
    var myRange = mySheet.getRange( "C1:D40" ).getValues();
    var myUserAuth = authenticateUser( getProperty( 'User_ID' ), getProperty( 'User_Token' ) );
    if ( myUserAuth == false ) {
        mySheet.getRange( "C6" ).setValue( 'Login failed.. Check User_ID & User_Token' );
        return false
    }
    theXml = UrlFetchApp.fetch( 'https://cb-live.synapse-games.com/assets/cards.xml' ).getContentText();
    theXmlCombo = UrlFetchApp.fetch( 'https://cb-live.synapse-games.com/assets/cards_finalform.xml' ).getContentText();
    theXmlMythic = UrlFetchApp.fetch( 'https://cb-live.synapse-games.com/assets/cards_mythic.xml' ).getContentText();
    setProperty( 'DeckToSave', parseInt( getSetting( myRange, 'Deck to import or export' ) ) + '' )
    setProperty( 'SaveLocation', parseInt( getSetting( myRange, 'Save Location' ) ) + '' )
}
/**
 * Save deck to save location// Import
 */
function saveUserDeck() {
    var myAuth = initUserDeck();
    if ( myAuth == false ) {
        return false
    }
    Logger.log( getProperty( 'DeckToSave' ) )
    Logger.log( getProperty( 'SaveLocation' ) )
    var myDeck = getUserDeck( getProperty( 'DeckToSave' ) );
    var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Custom Decks" );
    mySheet.getRange( "I" + ( parseInt( getProperty( 'SaveLocation' ) ) + 8 ) ).setValue( myDeck );
    mySheet.getRange( "C6" ).setValue( 'Deck ' + getProperty( 'DeckToSave' ) + ' Saved to ' + getProperty( 'SaveLocation' ) );
}
/**
 * Show user deck from save.//Display
 */
function displayUserDeck() {
    var myAuth = initUserDeck();
    if ( myAuth == false ) {
        return false
    }
    var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Custom Decks" );
    var myDeck = mySheet.getRange( "I" + ( parseInt( getProperty( 'SaveLocation' ) ) + 8 ) ).getValue();
    if ( myDeck == "" ) {
        mySheet.getRange( "C6" ).setValue( 'No deck found at save location ' + getProperty( 'SaveLocation' ) );
        return;
    }
    myDeck = myDeck.split( ',' );
    mySheet.getRange( "C9" ).setValue( 'Loading deck: ' + getProperty( 'SaveLocation' ) );
    for ( var i = 10; i < 45; i++ ) {
        if ( myDeck[ i - 9 ] != null ) {
            mySheet.getRange( "C" + i ).setValue( myDeck[ i - 9 ].split( ':' )[ 1 ] );
        } else {
            mySheet.getRange( "C" + i ).setValue( '' )
        }
    }
    mySheet.getRange( "C9" ).setValue( 'Displaying Deck: ' + getProperty( 'SaveLocation' ) )
}
/**
 * Set selected deck to save// Export
 */
function loadUserDeck() {
    var myAuth = initUserDeck();
    if ( myAuth == false ) {
        return false
    }
    var myUrl = getProperty( 'propUrl' );
    var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Custom Decks" );
    var myDeck = mySheet.getRange( "I" + ( parseInt( getProperty( 'SaveLocation' ) ) + 8 ) ).getValue();
    Logger.log( myDeck )
    if ( myDeck == "" ) {
        mySheet.getRange( "C6" ).setValue( 'No deck found at save location ' + getProperty( 'SaveLocation' ) );
        return;
    }
    myDeck = myDeck.split( ',' );
    var myParm = '[';
    for ( var i = 1; i < myDeck.length; i++ ) {
        myParm = myParm + myDeck[ i ].split( ':' )[ 0 ] + ','
    }
    myParm = myParm.slice( 0, -1 ) + ']'
    UrlFetchApp.fetch( myUrl + '&message=setDeckUnits&deck_id=' + getProperty( 'DeckToSave' ) + '&commander_index=' + myDeck[ 0 ] + '&units=' + myParm );
    mySheet.getRange( "C6" ).setValue( 'Save ' + getProperty( 'SaveLocation' ) + ' loaded to deck ' + getProperty( 'DeckToSave' ) );
}
/**
 * Get user deck and name each card
 * return loaded deck
 */
function getUserDeck( aDeck ) {
    var myUrl = getProperty( 'propUrl' );
    var myDeck = UrlFetchApp.fetch( myUrl + '&message=setDeckUnits' );
    var myDeckJson = JSON.parse( myDeck );
    var myDeck = myDeckJson.user_decks[ aDeck ].units;
    var myCommander = myDeckJson.user_decks[ aDeck ].commander.unit_id;
    var myCards = myCommander
    for ( var i = 0; i < myDeck.length; i++ ) {
        var myID = myDeck[ i ].unit_id;
        var myIndex = myDeck[ i ].unit_index;
        Logger.log( myID )
        var myCardInfo = getCardRarity( myID );
        myCards = myCards + ',' + myIndex + ':' + myCardInfo[ 1 ]
    }
    return myCards
}
