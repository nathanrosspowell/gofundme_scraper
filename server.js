var GetDoners = require('./gofundme');
var goFundMeURL = 'https://www.gofundme.com/39t6wr3c' // 'https://www.gofundme.com/samyancey' //'https://www.gofundme.com/ShowerFlint5' 
GetDoners(goFundMeURL, function(donators){
    for ( i in donators ) {
        console.log( " > " + i + " ", donators[i] );
    }
});


