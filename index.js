'use strict';

const http = require('http')

const yelp = require('yelp-fusion');

// Place holder for Yelp Fusion's API Key. Grab them
// from https://www.yelp.com/developers/v3/manage_app
const apiKey = 'HTR-yJmMaC9NakRjSsPX5CJBN4SYdTpDJ4rZhp3SHRMy8fHgmkrda_TM2vUl65lWbaucjEA1oQWSNnnl-kxq1aV69_HAKVvN_RMJAs2lbEQDPcs33w6O4c4QkmVXYXYx';

const searchRequest = {
    categories:'bar,restaurant',
    location: '60611',
    open_now: true,
    // term: 'sushi-x'
};

const client = yelp.client(apiKey);

function Business(name, review_count, rating, price, location, phone) {
    let ascii = name.replace(/\s/g, '%20')

    this.name = name
    this.review_count = review_count
    this.rating = rating
    this.price = price
    this.location = location
    this.phone = phone
    this.url = `https://www.grubhub.com/search?orderMethod=delivery&locationMode=DELIVERY&facetSet=umamiV2&pageSize=20&hideHateos=true&searchMetrics=true&queryText=${ascii}&facet=open_now%3Atrue&includeOffers=true`
}

client.search(searchRequest).then(response => {
    const businesses = response.jsonBody.businesses
    const business = businesses[Math.floor(Math.random()*businesses.length)];
    // console.log(business)
    const r = new Business(
        business.name, 
        business.review_count, 
        business.rating, 
        business.price,
        business.location.display_address,
        business.display_phone
    )

    console.table([r])
    return r
}).catch(e => {
  console.log(e);
});


const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });

    client.search(searchRequest).then(response => {
        const businesses = response.jsonBody.businesses
        const business = businesses[Math.floor(Math.random()*businesses.length)];
        // console.log(business)
        const r = new Business(
            business.name, 
            business.review_count, 
            business.rating, 
            business.price,
            business.location.display_address,
            business.display_phone
        )

        console.table([r])
        // return r
        res.write(JSON.stringify(r, null, 2));
        res.end();
    }).catch(e => {
    console.log(e);
    });
})

server.listen(process.env.PORT || 3000)