function onGooglePayLoaded() {
  const paymentsClient = new google.payments.api.PaymentsClient({ environment: "TEST" });

  const button = paymentsClient.createButton({
    onClick: onGooglePayButtonClicked
  });

  document.getElementById("container").appendChild(button);
}

function getPaymentDataRequest() {
  return {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [{
      type: "CARD",
      parameters: {
        allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
        allowedCardNetworks: ["VISA", "MASTERCARD"]
      },
      tokenizationSpecification: {
        type: "PAYMENT_GATEWAY",
        parameters: {
          gateway: "example",  // replace with your gateway
          gatewayMerchantId: "exampleMerchantId"
        }
      }
    }],
    merchantInfo: {
      merchantId: "12345678901234567890", // replace with your merchant ID
      merchantName: "Test Merchant"
    },
    transactionInfo: {
      totalPriceStatus: "FINAL",
      totalPrice: "10.00",
      currencyCode: "INR",
      countryCode: "IN"
    }
  };
}

function onGooglePayButtonClicked() {
  const paymentsClient = new google.payments.api.PaymentsClient({ environment: "TEST" });
  const paymentDataRequest = getPaymentDataRequest();

  paymentsClient.loadPaymentData(paymentDataRequest)
    .then(paymentData => {
      console.log("Payment Success:", paymentData);
      alert("Payment Success!");
    })
    .catch(err => {
      console.error("Payment Failed:", err);
    });
}
