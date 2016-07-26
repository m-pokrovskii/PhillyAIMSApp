//done

// Category Parameter
// Add a "categories" property to terms which can be used to filter *all* existing Posts views. 
function addTagParameter (parameters, terms) {

  var tag = terms.tag || terms["tag[]"];

  // filter by category if category slugs are provided
  if (tag) {

    var tagsIds = [];
    var find = {};

    if (typeof tag === "string") { // cat is a string
      //find = {name: tag};
      parameters.find.tags = tag;
    } else if (Array.isArray(tag)) { // cat is an array
      //find = {name: {$in: tag}};
      parameters.find.tags = {$in: tag};
    }

    // get all categories passed in terms
    /*var tags = Tags.find(find).fetch();
    
    // for each category, add its ID and the IDs of its children to categoriesId array
    tags.forEach(function (tag) {
      tagsIds.push(tag._id);
    });
    */
     //{$}//{$in: tags};
  }
  return parameters;
}
Telescope.callbacks.add("postsParameters", addTagParameter);