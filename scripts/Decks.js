
/**
* Load needed function.
*/
function UserDeckInit(){
  theProperties = PropertiesService.getScriptProperties()
  theSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( 'Settings' );
  loadUserSettings(); 
  var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Custom Decks" );
  var myRange = mySheet.getRange( "C1:D40" ).getValues();
  var myUserAuth = authenticateUser( getProperty( 'User_ID' ), getProperty( 'User_Token' ) );
  if ( myUserAuth == false ) {
    mySheet.getRange( "C6" ).setValue('Login failed.. Check User_ID & User_Token');
    return false
  }
  theXml = UrlFetchApp.fetch( 'https://cb-live.synapse-games.com/assets/cards.xml' ).getContentText();
  theXmlCombo = UrlFetchApp.fetch( 'https://cb-live.synapse-games.com/assets/cards_finalform.xml' ).getContentText();
  theXmlMythic = UrlFetchApp.fetch( 'https://cb-live.synapse-games.com/assets/cards_mythic.xml' ).getContentText();
  setProperty('GameDeck', parseInt(getSetting( myRange, 'In-game deck # (import/export)' ))+'')
  setProperty('SheetDeck', parseInt(getSetting( myRange, 'Sheet deck # (import/export/display)' ))+'')
}

/**
* Save deck to save location// Import
*/
function ImportToSheet() {
 var myAuth = UserDeckInit();
  if(myAuth == false){return false}
var myDeck = getUserDeck(getProperty('GameDeck'));
  var myCartoon = CartoonBattle(myDeck.units)
var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Custom Decks" );
mySheet.getRange( "H"+(parseInt(getProperty('SheetDeck'))+9) ).setValue(myDeck.name);
mySheet.getRange( "I"+(parseInt(getProperty('SheetDeck'))+9) ).setValue(myDeck.commander);
mySheet.getRange( "J"+(parseInt(getProperty('SheetDeck'))+9) ).setValue(myDeck.units);
mySheet.getRange( "K"+(parseInt(getProperty('SheetDeck'))+9) ).setValue(myCartoon);
mySheet.getRange( "C6" ).setValue('Deck '+getProperty('GameDeck')+' Saved to '+getProperty('SheetDeck'));
}

/**
* Convert Level
* Return Level and Stars
*/
function ConvertCardLevel(aRarity, aLevel) {
  var theFactor = parseInt(aRarity)+2;
  var myStars = Math.floor( aLevel/theFactor );
  var myLevel = aLevel - ( myStars*theFactor );
  if ( myLevel == "0" ){ 
    myLevel = theFactor;
  } else {myStars++};
  return myLevel+""+Array(myStars).join("*");
}


/**
* Generate Cartoonbattle Url
* Return Cartoon Battle Url
*/
function CartoonBattle(aDeck) {
  aDeck = aDeck.split(' ').join('-');
  aDeck = aDeck.split("'").join('');
  aDeck = aDeck.split(',');
  var myTotal = ''
  for ( var i = 1; i < aDeck.length; i++ ) {
    var myCardRarity = aDeck[i].split('|')[3]
    var myCardName = aDeck[i].split('|')[2]
    var myCardLevel = aDeck[i].split('|')[1]
    
    
    var myCard = myCardName+"="+ConvertCardLevel(myCardRarity, myCardLevel)
    myTotal = myTotal +'&'+ myCard
  }
  
  myTotal = 'https://cartoon-battle.cards/share-your-deck?'+myTotal
  return myTotal
  }

/**
* Show user deck from save.//Display
*/
function DisplayUserDeck() {
 var myAuth = UserDeckInit();
  if(myAuth == false){return false}
var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Custom Decks" );
var myDeckName = mySheet.getRange( "H"+(parseInt(getProperty('SheetDeck'))+9) ).getValue();
var myDeck = mySheet.getRange( "J"+(parseInt(getProperty('SheetDeck'))+9) ).getValue();
  if(myDeck == ""){
   mySheet.getRange( "C6" ).setValue('No deck found at save location '+getProperty('SheetDeck'));
  return;
  }
myDeck = myDeck.split(',');
mySheet.getRange( "C8" ).setValue('Loading deck: '+getProperty('SheetDeck'));
mySheet.getRange( "C9" ).setValue('Deck Name: Loading...');
  for ( var i = 11; i < 45; i++ ) {
  if(myDeck[i-11] != null){ 
  mySheet.getRange( "C"+i ).setValue(myDeck[i-11].split('|')[2]);
  mySheet.getRange( "D"+i ).setValue(ConvertCardLevel(myDeck[i-11].split('|')[3], myDeck[i-11].split('|')[1]));  
  }else{
    mySheet.getRange( "C"+i ).setValue('') 
  }
}
  mySheet.getRange( "C11:D46" ).sort(3); // so stupid. A=0...C=3
  mySheet.getRange( "C8" ).setValue('Deck Display #'+getProperty('SheetDeck'));
  mySheet.getRange( "C9" ).setValue('Deck Name: '+myDeckName) 
}

/**
* Set selected deck to save// Export
*/
function ExportToThrowdown() {
 var myAuth = UserDeckInit();
  if(myAuth == false){return false}
var myUrl = getProperty( '_url' );
var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Custom Decks" );
var myCommander = mySheet.getRange( "I"+(parseInt(getProperty('SheetDeck'))+9) ).getValue();
var myDeckName = mySheet.getRange( "H"+(parseInt(getProperty('SheetDeck'))+9) ).getValue();
var myDeck = mySheet.getRange( "J"+(parseInt(getProperty('SheetDeck'))+9) ).getValue();
  if(myDeck == ""){
   mySheet.getRange( "C6" ).setValue('No deck found at save location '+getProperty('SheetDeck'));
  return;
  }
myDeck = myDeck.split(',');
var myParm = '[';
for ( var i = 0; i < myDeck.length; i++ ) {
 myParm = myParm + myDeck[i].split('|')[0]+','
  
}
  myParm = myParm.slice(0, -1) + ']'
  UrlFetchApp.fetch( myUrl + '&message=setDeckUnits&deck_id='+getProperty('GameDeck')+'&commander_index='+myCommander+'&units='+myParm);
  UrlFetchApp.fetch( myUrl + '&message=setDeckName&deck_id='+getProperty('GameDeck')+'&name='+myDeckName);
  mySheet.getRange( "C6" ).setValue('Save '+getProperty('SheetDeck')+' loaded to deck '+getProperty('GameDeck'));
}


/**
* Imports all Cards
*/
function ImportAllCards() {
  var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName( "Custom Decks" );
 var myAuth = UserDeckInit();
  if(myAuth == false){return false}
  var myUrl = getProperty( '_url' );
  var myDeck = UrlFetchApp.fetch( myUrl + '&message=init' );
  var myDeckJson = JSON.parse( myDeck );
  var myCards = myDeckJson.user_units;
  var cardList = ""; 
  for (var key in myCards) {
    var myID = myCards[key].unit_id;
    var myLevel = myCards[key].level;
    var myIndex = myCards[key].unit_index;
    var myRarity = myCards[key].rarity;
    var myCardInfo = getCardRarity(myID);
    cardList = cardList + ','+myIndex+'|'+myLevel+'|'+myCardInfo[1]+'|'+myRarity
  }
  var myCartoon = CartoonBattle(cardList.substr(1))
  mySheet.getRange( "H6" ).setValue(myCartoon);
}



/**
* Get user deck and name each card
* return loaded deck
*/
function getUserDeck(aDeck) {
  var myUrl = getProperty( '_url' );
  var myDeck = UrlFetchApp.fetch( myUrl + '&message=setDeckUnits' );
  var myDeckJson = JSON.parse( myDeck );
  var myCards = myDeckJson.user_decks[ aDeck ].units;
  var myDeck = {name:myDeckJson.user_decks[ aDeck ].name, commander:myDeckJson.user_decks[ aDeck ].commander.unit_id, units:""};
  var cardList = "";
  for ( var i = 0; i < myCards.length; i++ ) {
    var myID = myCards[i].unit_id;
    var myLevel = myCards[i].level;
    var myIndex = myCards[i].unit_index;
    var myRarity = myCards[i].rarity;
    var myCardInfo = getCardRarity(myID);
    cardList = cardList + ','+myIndex+'|'+myLevel+'|'+myCardInfo[1]+'|'+myRarity
  }
  myDeck.units = cardList.substr(1);
return myDeck
}
