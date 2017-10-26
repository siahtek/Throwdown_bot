function testINIT(){
    theSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( 'Settings' );
    theProperties = PropertiesService.getScriptProperties()
    theXml = UrlFetchApp.fetch( 'https://cb-live.synapse-games.com/assets/cards.xml' ).getContentText();
    theXmlCombo = UrlFetchApp.fetch( 'https://cb-live.synapse-games.com/assets/cards_finalform.xml' ).getContentText();
    theXmlMythic = UrlFetchApp.fetch( 'https://cb-live.synapse-games.com/assets/cards_mythic.xml' ).getContentText();
    loadUserSettings(); 
  
}

function testBuyingCards() {
    Main();
    buyAndRecycleCards();
    WriteLogs();
    updateStatus( 'Done buying cards, waiting for next check' );
}

function testArena() {
    Main();
    myStatus = getStatus();
//    if ( ( getProperty( 'Auto Arena' ) == "Enabled" && myStatus.arena > 0 ) || ( getProperty( 'Auto Arena' ) == "Energy overflow control" && myStatus.arena >= myStatus.arenaMax ) ) {
        Logger.log( '(DEBUG)- - - - Arena Start - - - -' );
        var mySearchLength = Math.min(myStatus.arena, 1);
        Logger.log( 'SearchLength:' + mySearchLength );
        for ( var i = 0; i < mySearchLength; i++ ) {
            updateStatus( '(DEBUG) Account ' + getProperty( '_name' ) + ' Loading Arena ' + formattedTime() );
            var myResult = playArena();
            if ( myResult != false ) {
                addLog( '_logs_Arena', myResult );
            }
            Logger.log( myResult );
        }
        Logger.log( '(DEBUG) - - - - Arena End - - - -' );
//    }
}