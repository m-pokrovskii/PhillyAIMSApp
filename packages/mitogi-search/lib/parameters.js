var fillwords = ["a","able","about","across","after","all","almost","also","am","among","an","and","any","are","as","at","be","because","been","but","by","can","cannot","could","dear","did","do","does","either","else","ever","every","for","from","get","got","had","has","have","he","her","hers","him","his","how","however","i","if","in","into","is","it","its","just","least","let","like","likely","may","me","might","most","must","my","neither","no","nor","not","of","off","often","on","only","or","other","our","own","rather","said","say","says","she","should","since","so","some","than","that","the","their","them","then","there","these","they","this","tis","to","too","twas","us","wants","was","we","were","what","when","where","which","while","who","whom","why","will","with","would","yet","you","your","ain't","aren't","can't","could've","couldn't","didn't","doesn't","don't","hasn't","he'd","he'll","he's","how'd","how'll","how's","i'd","i'll","i'm","i've","isn't","it's","might've","mightn't","must've","mustn't","shan't","she'd","she'll","she's","should've","shouldn't","that'll","that's","there's","they'd","they'll","they're","they've","wasn't","we'd","we'll","we're","weren't","what'd","what's","when'd","when'll","when's","where'd","where'll","where's","who'd","who'll","who's","why'd","why'll","why's","won't","would've","wouldn't","you'd","you'll","you're","you've"]
;
function manyOrs(terms){
  var array = new Array();
  for(var i=0; i< terms.length; i++){
    var term = terms[i].trim();
    //console.log(fillwords.indexOf("this"));
    if(term && (fillwords.indexOf(term) == -1)){ //not empty string
      var obj = {
          $or: [
            {title: {$regex: term, $options: 'i'}},
            {url: {$regex: term, $options: 'i'}},
            {body: {$regex: term, $options: 'i'}},
            {tags: {$regex: term, $options: 'i'}},
            {categories: {$regex: term, $options: 'i'}},
            {author: {$regex: term, $options: 'i'}}
          ]
        }
    }
    array.push(obj);
  }
  return array;
}

function splitTerms(termsString){

  var quotes = termsString.match(/(["'])(?:(?=(\\?))\2.)*?\1/g);
  if(quotes){
    for(var i = 0; i< quotes.length; i++){
      termsString = termsString.replace(quotes[i], "");
      quotes[i] = quotes[i].replace(/"/g,"");
          console.log(quotes[i]);
    }

  }

  if(termsString){
   termsString = termsString.split(",");////[\s,]+/);
  }
  else{
    termsString = [];
  }

  if(quotes){
    termsString = termsString.concat(quotes);
  }
  return termsString;
}

function addSearchQueryParameter (parameters, terms) {
  if(!!terms.query) {
    var parameters = Telescope.utils.deepExtend(true, parameters, {
      find: {
        $or: manyOrs(splitTerms(terms.query))
      }
    });
  }
  return parameters;
}
Telescope.callbacks.add("postsParameters", addSearchQueryParameter);

/*
function addSearchQueryParameter (parameters, terms) {
  if(!!terms.query) {
    var parameters = Telescope.utils.deepExtend(true, parameters, {
      find: {
        $or: [
          {title: {$regex: terms.query, $options: 'i'}},
          {url: {$regex: terms.query, $options: 'i'}},
          {body: {$regex: terms.query, $options: 'i'}},
          {tags: {$regex: terms.query, $options: 'i'}},
          {categories: {$regex: terms.query, $options: 'i'}},
          {author: {$regex: terms.query, $options: 'i'}}
        ]
      }
    });
  }
  return parameters;
}
Telescope.callbacks.add("postsParameters", addSearchQueryParameter);


db.things.find({$or: [{$or : [{'a':1},{'b':2}]},{$or : [{'a':2},{'b':3}]}] })*/