Stripe.setPublishableKey('pk_test_XVO4U1mHBqz6zMIrvOcZOUX4');
var $form = $('#checkout-form'); // get form
$form.submit(function(event) {
    $('#chargeError').addClass('hidden');
    $form.find('button').prop('disabled', true); // lock button when validating
    Stripe.card.createToken({
        number: $('#card-number').val(),
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val(),
        name: $('#card-name').val(),
        address_city: $('#city').val(),
        address_state: $('#street').val(),
        address_line1: $('#building-number').val(),
        address_line2: $('#flat-number').val()
    }, stripeResponseHandler);
    return false;
});

function stripeResponseHandler(status, response) {
    if (response.error) {
        // show validation errors
        $('#chargeError').text(response.error.message);
        $('#chargeError').removeClass('hidden');
        $form.find('button').prop('disabled', false); // unlock button

    } else { // create token
        // get the token ID:
        var token = response.id;
        // put token in form
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));
        // send form
        $form.get(0).submit();

    }
}