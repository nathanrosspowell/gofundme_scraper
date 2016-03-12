var phantom = require('phantom');
var cheerio = require('cheerio');

var goFundMeURL = 'https://www.gofundme.com/ShowerFlint5' // 'https://www.gofundme.com/39t6wr3c'

function logNames(html) {
    //console.log(html);
    var $ = cheerio.load(html);
    console.log($('div > div.donerscroll > span:nth-child(3)').text());
    $('div > div.dname').each(function(index, element){
        console.log("  " + $(element).text())
    });
    console.log( "....")
}

function recurseNames(page, callback) {
    page.evaluate(function() {
        return document.querySelector('div[class="donate_right"]').innerHTML
    }).then(function(html){
        logNames(html);
        page.evaluate(function(){
            var a = document.querySelector("div > div.donerscroll > a.lr.pright.donationsPage");
            var finished = a === null;
            if ( !finished ) {
                var e = document.createEvent('MouseEvents');
                e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                a.dispatchEvent(e);
                waitforload = true;
            }
            return finished
        }).then(function(finished){
            if ( !finished ) {
                setTimeout( function() {
                    page.evaluate(function() {
                        return document.querySelector('div[class="donate_right"]').innerHTML;
                    }).then(function(html){
                        recurseNames(page, callback);
                    });
                }, 500);
            }
            else{
                callback();
            }
        });
    });
}

phantom.create().then(function(ph) {
    ph.createPage().then(function(page) {
        page.open(goFundMeURL).then(function(status) {
            page.property('content').then(function(content) {
                var $ = cheerio.load(content);
                var title = $('.pagetitle').text();
                console.log("Campaign: "+ title + "\n\nDonators:");

                recurseNames(page, function(){
                    console.log("Finished");
                    page.close();
                    ph.exit();
                });
            });
        });
    });
});

