var phantom = require('phantom');
var cheerio = require('cheerio');
var merge = require('merge'), original, cloned;

function logNames(html) {
    //console.log(html);
    var $ = cheerio.load(html);
    var nums = $('div > div.donerscroll > span:nth-child(3)').text();
    var startNum = parseInt(nums.split("-")[0])
    var i = 0;
    var donators = {}
    $('div.doner').each(function(index, element){
        var index = (startNum + i ) 
        var amountHtml = $(element).find("div.damt").text()
        var numb = amountHtml.match(/\d/g);
        var amount = parseInt(numb.join(""))
        donators[index] = {
            "name" : $(element).find("div.dname").text(),
            "message" : $(element).find("div.dcom").text(),
            "amount" : amount
        }
        i += 1;
    });
    return donators
}

function recurseNames(page, callback, preDonators) {
    page.evaluate(function() {
        return document.querySelector('div[class="donate_right"]').innerHTML
    }).then(function(html){
        var donators = merge(logNames(html), preDonators);
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
                        recurseNames(page, callback, donators);
                    });
                }, 500);
            }
            else{
                callback(donators);
            }
        });
    });
}

function getDonators(goFundMeURL, callback) {
    phantom.create().then(function(ph) {
        ph.createPage().then(function(page) {
            page.open(goFundMeURL).then(function(status) {
                page.property('content').then(function(content) {
                    var $ = cheerio.load(content);
                    var title = $('.pagetitle').text();
                    recurseNames(page, function(donators){
                        page.close();
                        ph.exit();
                        if ( callback !== "undefined" ) {
                            callback(donators)
                        }
                    });
                });
            });
        });
    });
}

module.exports = getDonators
