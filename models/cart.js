module.exports = function Cart(oldCart) { //Load old cart from session
    this.items = oldCart.items || {}; //Items in cart
    this.totalQty = oldCart.totalQty || 0; // Total number of items in cart
    this.totalPrice = oldCart.totalPrice || 0; //Price for all items in cart

    this.add = function(item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = { item: item, qty: 0, price: 0 }; //If item isnt in cart add one
        }
        //If item is already in cart add copy of it
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };
    //Remove one item from cart
    this.removeOne = function(id) {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;
        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };
    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};