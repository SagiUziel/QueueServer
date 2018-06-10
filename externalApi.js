const https = require('https');
var googleApiKey = 'AIzaSyD4BWzA7xJdrKhfVijFMXu3mACZnKxFjhw';

this.Run = (socket) => {
    socket.on('SearchCity', (citySearch) => {
        try {
            if (!citySearch || citySearch.length == 0) {
                return;
            }
           citySearch = encodeURIComponent(citySearch);
            https.get('https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + citySearch + '&types=(cities)&language=iw&region=IL&key=' + googleApiKey, (resp) => {
              let data = '';
              
              // A chunk of data has been recieved.
              resp.on('data', (chunk) => {
                data += chunk;
              });
             
              // The whole response has been received. Print out the result.
              resp.on('end', () => {
                  var result = JSON.parse(data);
                  result = result.predictions.slice(0, 5).map((x) => { 
                      //return {cityName: x.description , cityId: x.place_id};
                      return x.description;
                  });
                  this.socket.emit('SearchCityComplete', 0, JSON.stringify(result));
                  console.log(result);
              });
             
            }).on("error", (err) => {
              console.log("Error: " + err.message);
            });
        } catch (e) {
          console.log(e);
          this.socket.emit('SearchCityComplete', 2, 'התרחשה תקלה');
        }
    });
    
    socket.on('SearchAddress', (addressSearch, city) => {
        try {
            if (!addressSearch || addressSearch.length == 0) {
                return;
            }
            if (!city) {
                city = '';
            }
           addressSearch = encodeURIComponent(addressSearch + ' ' + city + ' ');
            https.get('https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + addressSearch + '&types=geocode&language=iw&region=IL&key=' + googleApiKey, (resp) => {
              let data = '';
              
              // A chunk of data has been recieved.
              resp.on('data', (chunk) => {
                data += chunk;
              });
             
              // The whole response has been received. Print out the result.
              resp.on('end', () => {
                  var result = JSON.parse(data);
                  console.log(result);
                  result = result.predictions.slice(0, 5).map((x) => { 
                      //return {cityName: x.description , cityId: x.place_id};
                      return x.description;
                  });
                  this.socket.emit('SearchAddressComplete', 0, JSON.stringify(result));
                  console.log(result);
              });
             
            }).on("error", (err) => {
              console.log("Error: " + err.message);
            });
        } catch (e) {
          console.log(e);
          this.socket.emit('SearchAddressComplete', 2, 'התרחשה תקלה');
        }
    });
};





