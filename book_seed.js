var Product = require('./models/product');
var mongoose = require('mongoose');
mongoose.connect('mongodb://user:user@ds135089.mlab.com:35089/mlab_database');
var done = 0;
for (var i = 0; i < 50; i++) {
    var product =
        new Product({
            image: 'http://pngimg.com/uploads/book/book_PNG2111.png',
            title: 'Książka ' + i,
            author: 'Autor Numer ' + i,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris leo ligula, hendrerit interdum aliquam a, ultrices eget risus.',
            publisher: 'Wydawca Numer ' + i,
            year: 1970 + i,
            price: i * 5,
            genre: 'cooking',
            isbn: '9780471397120'
        });

    product.save();
}
console.log(product);
/*for (var j = 0; j < products.length; j++) {
    products[i].save();
    done++;
    if (done === products.length) {
        exit();
    }

}
*/

function exit() {
    mongoose.disconnect();
}