var GoFundMe = require('./gofundme');
var input = {
    url: 'https://www.gofundme.com/39t6wr3c' // 'https://www.gofundme.com/samyancey' //'https://www.gofundme.com/ShowerFlint5' 
}
GoFundMe(input, function(data){
    console.log("Title: ", data.title);
    console.log("Raised: " + data.currency.toString() + data.amount.toString() + " of " + data.currency.toString() + data.goal.toString());
    console.log("Percentage: " + data.percentage.toString())
    console.log("Donors: " + data.donations.toString());
    for ( var i in data.donors ) {
        console.log("   " + i + ". " + data.donors[i].name + " - " + data.donors[i].amount)
    }
});


