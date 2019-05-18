import paypal from 'paypal-rest-sdk';

paypal.configure({
  mode: 'sandbox', // sandbox or live
  client_id: 'AftKiq8AWUuP3_o-8NjZDA2Xeo4nnItGpjYVht_rrwMcPLSHP_35QWEXOTEUJECHImxxrI_spHMfllrq',
  client_secret: 'EIkbIhBE5co8RDZgNkVoHEEu-9Q_q80Ti6chSmeRRkGu7lYzlE_E-euBSBbc3t0v7ybrPtYBzDthNMg6'
});

let createPaymentJson = {
  intent: 'sale',
  payer: {
    payment_method: 'paypal'
  },
  redirect_urls: {
    return_url: 'http://localhost:8080/#/updateaccount?success=true',
    cancel_url: 'http://localhost:8080/#/updateaccount?cancel=true'
  },
  transactions: [
    {
      item_list: {
        items: [
          {
            name: 'premium',
            sku: 'premium_1234',
            price: '2.99',
            currency: 'USD',
            quantity: 1
          }
        ]
      },
      amount: {
        currency: 'USD',
        total: '2.99'
      },
      description: 'This is the payment description.'
    }
  ]
};

export function pay() {
  return new Promise((resolve, reject) => {
    paypal.payment.create(createPaymentJson, function(error, payment) {
      if (error) {
        reject(error);
      } else {
        // console.log('Create Payment Response');
        // console.log(payment);
        resolve(payment.links.filter(x => x.method === 'REDIRECT')[0].href);
      }
    });
  });
}
