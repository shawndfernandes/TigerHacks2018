let express = require('express');
let app = express();
const NewsAPI = require('newsapi');
const apiKeys = ['69ecd8d52c2a4a75b1cf35fffe8cef98', 'd049293af37e42b299f67df33b3fe12d', '837cb819730f43fa875a69d8938601fc', 'a5f9a8fce4974c129435a9498a636a74', '19c97cd90a564fe69a2717e33f79e05e', '3c54ca9b072d4412a40fa6dcbca15fef', '7aee6881504342a99954887b37eaee1b', 'eba07a8ff7004ec09a83e09f2ebdb24a', 'c29a17159db947199e4046730272dbde', 'b18b4917855f40d99df36e019a7c42ae', 'f5b2d41ec7e04e549f20cf262ba4c63f','db2f0ec339eb4fee8806f4f8f9b2d0a7','645db6a9eadc4555b7f470fcc2947e49','a94432472a7e40bc8055cc985dd3c5cc','9ffb22034ceb40faa9f75ed2dcbbd5c7','8caf46d202ff4bb7918fe0cfc441dac7','9e868f8476d7457fbc5c4ebeaaa70afc','2b311d068323402db1ae26ba6fffecf3','6220ca8425844944b55574a56696e71e'];

for( let i = 0; i < 10; i++){
    apiKeys.push(...apiKeys);
}

// const newsapi = new NewsAPI('69ecd8d52c2a4a75b1cf35fffe8cef98'); Jeremy
// const newsapi = new NewsAPI('d049293af37e42b299f67df33b3fe12d'); Shawn
let newsapi = new NewsAPI(apiKeys.pop());
let NodeGeocoder = require('node-geocoder');
let keywordExtractor = require("keyword-extractor");
const cacheMoney = new Map();

let options = {
    provider: 'google',
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyA0qOtDlNfCnZt15BlkFkO1GN6b1poosEs',
	//apiKey: 'AIzaSyAmCyfxvuFDJBkjGnFBEM9kJY8XbP_1A2c', // for Mapquest, OpenCage, Google Premier, my old api key
    formatter: null         // 'gpx', 'string', ...
};
let geocoder = NodeGeocoder(options);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api/articles', async function (req, res) {

    // object to return
    let myObject = { "trendingArticles": [], "relativeArticles": [], "totalResults": "", "locationString": "","lat_ret": "","lon_ret": "" };
    let citySearchString = " ";
    if (req.query.city != null){
       citySearchString += req.query.city + " ";
	   
	   const latlonSearch = await geocoder.geocode(citySearchString, function(err, res) {
    //console.log(res);
   });
	  if (!latlonSearch[0].latitude|| !latlonSearch[0].longitude) {
        res.json(myObject);
        res.end();
    }
	  
	  myObject.lat_ret = latlonSearch[0].latitude  ;
	myObject.lon_ret = latlonSearch[0].longitude  ; 
	
    }   
	
	
    if (req.query.city == null) {
        

	const citySearch = await geocoder.reverse({ 
        lat: req.query.lat, lon: req.query.lon 
    });

    if (!citySearch[0].city|| !citySearch[0].administrativeLevels.level1long || !citySearch[0].country) {
        res.json(myObject);
        res.end();
    }
      

    // console.log(citySearch[0].city);

    

    citySearchString += citySearch[0].city + " ";
    citySearchString += citySearch[0].administrativeLevels.level1long + " ";
    // citySearchString += citySearch[0].country + " ";
    }

    if (req.query.content != null) {
        citySearchString += req.query.content;
    }

    console.log(citySearchString);
    myObject.locationString = citySearchString;

    if (cacheMoney.get(citySearchString)) {
        console.log("CACHE");
        res.json(cacheMoney.get(citySearchString));
        res.end();
    } else {
        let trending = {};
        while (!trending.status || trending.status !== "ok"){
            if(trending.status !== "ok"){
                newsapi = new NewsAPI(apiKeys.pop());
            }
            // get the top 3 stories from trending 
            trending = await newsapi.v2.everything({
                q: citySearchString,
                language: 'en',
                sortBy: 'trending',
                pageSize: 4,
                page: 1
            });
        }
        console.log("NOT CACHE");
        let sentences = "";
        
        // get every description 
        trending.articles.forEach(article => {
        sentences += " " + article.title + " ";
        });
    
        myObject.trendingArticles.push(...trending.articles);
        myObject.pageSize += trending.totalResults;

        
        // get the next 27 relatives stories
        let relevant = {};
        while (!relevant.status || relevant.status !== "ok"){
            if(relevant.status !== "ok"){
                newsapi = new NewsAPI(apiKeys.pop());
                }
            relevant = await newsapi.v2.everything({
                q: citySearchString,
                language: 'en',
                sortBy: 'relevancy',
                pageSize: 60,
                page: 1
            });
        }
        

        // let uniqueArticles = [];

        const mapRelevant = {};
        const mapTrending = {};
        relevant.articles.forEach(article => {
            mapRelevant[article.title] = article;
        });
        trending.articles.forEach(article => {
            mapTrending[article.title] = article;
        });
        myObject.trendingArticles = Array.from(Object.values(mapTrending)).slice(0,4);
        myObject.relativeArticles = Array.from(Object.values(mapRelevant)).slice(0,45);

        
        // myObject.relativeArticles.push(...uniqueArticles);
        myObject.totalResults += relevant.totalResults;
        // get every description 
        relevant.articles.forEach(article => {
            sentences += " " + article.title + " ";
        }); 

        // let authors = [];
        // let titles = [];

        // console.log(myObject.trendingArticles.filter(onlyUnique));
        // console.log(myObject.relativeArticles.filter(onlyUnique));

        // myObject.trendingArticles.forEach(article => {
        //     authors.push(article.author);
        // });
        // myObject.relativeArticles.forEach(article => {
        //     authors.push(article.author);
        // });
        // myObject.trendingArticles.forEach(article => {
        //     titles.push(article.title);
        // });
        // myObject.relativeArticles.forEach(article => {
        //     titles.push(article.title);
        // });

        // let uniqueAuthors = authors.unique();
        // let uniqueTitles = titles.unique();

        // console.log(result);

        // let extractionResult = keywordExtractor.extract(sentences, {
        //     language: "english",
        //     remove_digits: false,
        //     return_changed_case: true,
        //     remove_duplicates: false
        // });
        
        // count(extractionResult);    
        cacheMoney.set(citySearchString, myObject);
        // console.log(cacheMoney);
        res.json(myObject);
        res.end();
    }
})

app.get('/api/getCity', function (req, res) {
    const response = geocoder.reverse({ lat: req.query.lat, lon: req.query.lon })
        .then(function (response) { 
            console.log(response);
            res.send(response);
        }) 
        .catch(function (err) {
            console.log(err);
        });
})

app.get('/api/getlatlon', function (req, res) {
    const response = geocoder.geocode({address: req.query.city })
        .then(function (response) { 
            console.log(response);
            res.send(response);
        }) 
        .catch(function (err) {
            console.log(err);
        });
})

app.get('/', function (req, res) {
    res.send("Default Page");
})

function count(array_elements){
    array_elements.sort();
    
    let current = null;
    let cnt = 0;
    let index = 0;
    let array_count = [];
    for (let i = 0; i < array_elements.length; i++) {
        if (array_elements[i] != current) {
            if (cnt > 0) {
                // document.write(current + ' comes --> ' + cnt + ' times<br>');
                // console.log(current, cnt);
                array_count.push([cnt, i]);
                // array_count[i][0]=cnt;
                // array_count[i][1]=i;
            }
            current = array_elements[i];
            cnt = 1;
        } else {
            cnt++;
        }
    }
    if (cnt > 0) {
        // document.write(current + ' comes --> ' + cnt + ' times');
        // console.log(current, cnt);
        //array_count.push([cnt, i]);
        // array_count[i][0]=cnt;
        // array_count[i][1]=i;
    }

    // let test = [[3, 0], [4, 1], [1, 2], [2, 3], [5, 4]];

    // let testArray = test.sort(sortFunction);
    // for (let i = 0;i < 5; i++) {
    //     console.log(test[i][0]);
    //     console.log(test[i][1]);
    //     console.log();
    // }
    let sortedCountArray = array_count.sort(sortFunction);
    for(let i = 0;i < 7; i++) {
        // count
        // console.log(sortedCountArray[i][0]);
        // index of the word in array_count
        let arrayIndex = sortedCountArray[i][1];
        // console.log(arrayIndex);
        // console.log();
        console.log(array_elements[arrayIndex]);
    }
}

function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] > b[0]) ? -1 : 1;
    }
}

// Array.prototype.unique = function() {
//     var arr = [];
//     for(var i = 0; i < this.length; i++) {
//         if(!arr.includes(this[i])) {
//             arr.push(this[i]);
//         }
//     }
//     return arr; 
// }

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

var port = 8080;

app.listen(port);
console.log('Listening on port', port);
