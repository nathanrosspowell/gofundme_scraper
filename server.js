var phantom = require('phantom');
var cheerio = require('cheerio');

function logNames(html) {
    //console.log(html);
    var $ = cheerio.load(html);
    $('div > div.dname').each(function(index, element){
        console.log($(element).text())
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
            var e = document.createEvent('MouseEvents');
            e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
            waitforload = true;
        }).then(function(){
            setTimeout( function() {
                page.evaluate(function() {
                    return document.querySelector('div[class="donate_right"]').innerHTML;
                }).then(function(html){
                    logNames(html);
                    callback();
                });
            }, 1000);
        });
    });
}

phantom.create().then(function(ph) {
    ph.createPage().then(function(page) {
    //    page.open('https://www.gofundme.com/39t6wr3c').then(function(status) {
        page.open('https://www.gofundme.com/ShowerFlint5').then(function(status) {
            console.log(status);
            page.property('content').then(function(content) {
                recurseNames(page, function(){
                    page.close();
                    ph.exit();
                });
            });
        });
    });
});

