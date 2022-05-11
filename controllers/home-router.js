const fetch = require('node-fetch');
const router = require("express").Router();
const { User } = require("../models");
const apikey = "8bd75f8c-d432-4f8c-83de-df36a896d752";
// use withAuth middleware to redirect from protected routes.
// const withAuth = require("../util/withAuth");

// example of a protected route
// router.get("/users-only", withAuth, (req, res) => {
//   // ...
// });

router.get("/", async (req, res) => {
  try {
    const response = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY='+ apikey + "&start=1&limit=30&convert=USD"); 
    const {data:coins} = await response.json();
    console.log(coins);
  
    const responseBTC = await fetch('https://pro-api.coinmarketcap.com/v1/tools/price-conversion?CMC_PRO_API_KEY='+ apikey + "&amount=1&symbol=BTC&convert=USD"); 
    const {data:BTC} = await responseBTC.json();
    console.log(BTC);
    

    const responseETH = await fetch('https://pro-api.coinmarketcap.com/v1/tools/price-conversion?CMC_PRO_API_KEY='+ apikey + "&amount=1&symbol=ETH&convert=USD"); 
    const {data:ETH} = await responseETH.json();
    console.log(ETH);

    const responseUSDT = await fetch('https://pro-api.coinmarketcap.com/v1/tools/price-conversion?CMC_PRO_API_KEY='+ apikey + "&amount=1&symbol=USDT&convert=USD"); 
    const {data:USDT} = await responseUSDT.json();
    console.log(USDT);

    let user;
    if (req.session.isLoggedIn) {
      user = await User.findByPk(req.session.userId, {
        exclude: ["password"],
        raw: true,
      });
    }
    res.render("home", {
      title: "Home Page",
      isLoggedIn: req.session.isLoggedIn,
      user,
      coins,
      BTC,
      ETH,
      USDT,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("⛔ Uh oh! An unexpected error occurred.");
  }
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Log-In Page" });
});

router.get("/signup", (req, res) => {
  res.render("signup", { title: "Sign-Up Page" });
});

module.exports = router;
