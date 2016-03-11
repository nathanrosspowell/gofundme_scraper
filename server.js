var phantom = require('phantom');
var cheerio = require('cheerio');

function advanceDonations() {
}

phantom.create().then(function(ph) {
  ph.createPage().then(function(page) {
//    page.open('https://www.gofundme.com/39t6wr3c').then(function(status) {
    page.open('https://www.gofundme.com/ShowerFlint5').then(function(status) {
      console.log(status);
      page.property('content').then(function(content) {
        //console.log(content);
        console.log("Parsed: ", content.length);
        var $ = cheerio.load(content);
        var title = $('.pagetitle').text();
        console.log(">"+ title);
        var donate = $('div[class="donate_right"]')
        donate.find('div > div.dname').each(function (index, element) {
          console.log($(element).text());
        });

        console.log(donate.find( 'div > div.donerscroll > a.lr.pright.donationsPage').attr('title'))

        console.log("closing");
        page.close();
        ph.exit();
      });
    });
  });
});

