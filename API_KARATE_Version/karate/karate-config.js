function fn() {
  var config = {
    demoBlazeUrl: 'https://api.demoblaze.com',
    petStoreUrl: 'https://petstore.swagger.io/v2'
  };
  karate.configure('connectTimeout', 30000);
  karate.configure('readTimeout', 30000);
  return config;
}
