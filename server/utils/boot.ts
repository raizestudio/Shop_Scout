import { Country } from "@/models/countrySchema";
import { Currency } from "@/models/currencySchema";
import { Marketplace } from "@/models/marketplaceSchema";

// TODO: move into a fixture
const MARKETS = [
  {
    name: "amazon",
    description: "The largest online retailer in the world",
    category: "all"
  },
  {
    name: "alibaba",
    description: "The largest online retailer in China",
    category: "all"
  },
  {
    name: "snapdeal",
    description: "The largest online retailer in India",
    category: "all"
  },
  {
    name: "flipkart",
    description: "The largest online retailer in India",
    category: "all"
  }
];

const CURRENCIES = [
  {
    name: "Indian Rupee",
    code: "INR",
    symbol: "₹"
  },
  {
    name: "US Dollar",
    code: "USD",
    symbol: "$"
  },
  {
    name: "British Pound",
    code: "GBP",
    symbol: "£"
  },
  {
    name: "Euro",
    code: "EUR",
    symbol: "€"
  }
]

const COUNTRIES = [
  {
    name: "India",
    code: "IN",
    currency: CURRENCIES[0].code
  },
  {
    name: "United Kingdom",
    code: "UK",
    currency: CURRENCIES[2].code
  },
  {
    name: "Germany",
    code: "DE",
    currency: CURRENCIES[3].code
  },
  {
    name: "France",
    code: "FR",
    currency: CURRENCIES[3].code
  },
  {
    name: "United States",
    code: "US",
    currency: CURRENCIES[1].code
  },
  {
    name: "China",
    code: "CN",
    currency: CURRENCIES[1].code
  }
];

export const startupDb = async () => {
  Marketplace.insertMany(MARKETS)
    .then(() => {
      console.log("Marketplaces added to the database.");
    })
    .catch((err) => {
      if (err.code === 11000) {
        console.log("Marketplaces already exist in the database.");
      }
    });
  
  Currency.insertMany(CURRENCIES)
    .then(() => {
      console.log("Currencies added to the database.");
    })
    .catch((err) => {
      if (err.code === 11000) {
        console.log("Currencies already exist in the database.");
      }
    });

  Country.insertMany(COUNTRIES)
    .then(() => {
      console.log("Countries added to the database.");
    })
    .catch((err) => {
      if (err.errors?.currency.kind === "required") {
        console.log("Currency is required.");
      }

      if (err.code === 11000) {
        console.log("Countries already exist in the database.");
      }
    });
};