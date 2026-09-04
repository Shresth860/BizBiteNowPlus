const categories = [
  {
    id: "all",
    name: "All",
    icon: "🍽️",
  },
  {
    id: "pizza",
    name: "Pizza",
    icon: "🍕",
  },
  {
    id: "burger",
    name: "Burger",
    icon: "🍔",
  },
  {
    id: "pasta",
    name: "Pasta",
    icon: "🍝",
  },
  {
    id: "drinks",
    name: "Drinks",
    icon: "🥤",
  },
  {
    id: "desserts",
    name: "Desserts",
    icon: "🍰",
  },
];



const menuData = [

  {
    id: 1,
    sku: "PIZ001",

    name: "Margherita Pizza",

    description:
      "Classic Italian pizza with mozzarella cheese, tomato sauce and fresh basil.",

    category: "pizza",

    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",

    price: 299,

    originalPrice: 349,

    rating: 4.8,

    reviews: 412,

    preparationTime: "20-25 min",

    available: true,

    featured: true,

    bestseller: true,

    isVeg: true,

    spicy: false,

    calories: 720,

    variants: [
      {
        id: "small",
        name: "Small",
        price: 299,
      },
      {
        id: "medium",
        name: "Medium",
        price: 449,
      },
    ],

    addons: [
      {
        id: 1,
        name: "Extra Cheese",
        price: 60,
      },
    ],
  },


  {
    id: 2,
    sku: "PIZ002",

    name: "Farmhouse Pizza",

    description:
      "Loaded pizza with onion, capsicum, mushroom and fresh vegetables.",

    category: "pizza",

    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",

    price: 399,

    rating: 4.7,

    reviews: 280,

    preparationTime: "25 min",

    available: true,

    featured: true,

    bestseller: false,

    isVeg: true,

    calories: 780,

    variants: [
      {
        id:"regular",
        name:"Regular",
        price:399,
      },
    ],

    addons: [],
  },



  {
    id: 3,
    sku: "BRG001",

    name: "Classic Chicken Burger",

    description:
      "Juicy grilled chicken patty with cheese and signature sauce.",

    category: "burger",

    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",

    price:249,

    rating:4.7,

    reviews:288,

    preparationTime:"15-20 min",

    available:true,

    featured:true,

    bestseller:false,

    isVeg:false,

    calories:640,

    variants:[
      {
        id:"regular",
        name:"Regular",
        price:249,
      },
      {
        id:"double",
        name:"Double Patty",
        price:369,
      },
    ],

    addons:[
      {
        id:1,
        name:"French Fries",
        price:99,
      },
    ],
  },



  {
    id:4,
    sku:"BRG002",

    name:"Veg Supreme Burger",

    description:
      "Crispy vegetable patty with lettuce and cheese.",

    category:"burger",

    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",

    price:199,

    rating:4.5,

    reviews:190,

    preparationTime:"15 min",

    available:true,

    featured:false,

    bestseller:true,

    isVeg:true,

    calories:520,

    variants:[],

    addons:[],
  },



  {
    id:5,
    sku:"PAS001",

    name:"Creamy Alfredo Pasta",

    description:
      "Rich white sauce pasta topped with herbs and parmesan.",

    category:"pasta",

    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80",

    price:279,

    rating:4.6,

    reviews:201,

    preparationTime:"20 min",

    available:true,

    featured:false,

    bestseller:false,

    isVeg:true,

    calories:580,

    variants:[
      {
        id:"regular",
        name:"Regular",
        price:279,
      },
    ],

    addons:[
      {
        id:1,
        name:"Garlic Bread",
        price:89,
      },
    ],
  },



  {
    id:6,
    sku:"PAS002",

    name:"Arrabbiata Pasta",

    description:
      "Spicy tomato based Italian pasta with herbs.",

    category:"pasta",

    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80",

    price:259,

    rating:4.5,

    reviews:150,

    preparationTime:"18 min",

    available:true,

    featured:false,

    bestseller:false,

    isVeg:true,

    calories:510,

    variants:[],

    addons:[],
  },



  {
    id:7,
    sku:"DRK001",

    name:"Cold Coffee",

    description:
      "Refreshing chilled coffee blended with ice cream.",

    category:"drinks",

    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80",

    price:149,

    rating:4.9,

    reviews:512,

    preparationTime:"5 min",

    available:true,

    featured:true,

    bestseller:true,

    isVeg:true,

    calories:280,

    variants:[
      {
        id:"large",
        name:"Large",
        price:199,
      },
    ],

    addons:[],
  },



  {
    id:8,
    sku:"DRK002",

    name:"Fresh Lime Soda",

    description:
      "Refreshing lemon drink with soda.",

    category:"drinks",

    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",

    price:99,

    rating:4.6,

    reviews:120,

    preparationTime:"5 min",

    available:true,

    featured:false,

    bestseller:false,

    isVeg:true,

    calories:120,

    variants:[],

    addons:[],
  },



  {
    id:9,
    sku:"DES001",

    name:"Chocolate Lava Cake",

    description:
      "Warm chocolate cake with molten chocolate center.",

    category:"desserts",

    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",

    price:179,

    rating:4.9,

    reviews:344,

    preparationTime:"10 min",

    available:true,

    featured:true,

    bestseller:true,

    isVeg:true,

    calories:390,

    variants:[],

    addons:[
      {
        id:1,
        name:"Vanilla Ice Cream",
        price:50,
      },
    ],
  },



  {
    id:10,
    sku:"DES002",

    name:"Brownie Sundae",

    description:
      "Chocolate brownie served with ice cream and chocolate sauce.",

    category:"desserts",

    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",

    price:249,

    rating:4.8,

    reviews:220,

    preparationTime:"12 min",

    available:true,

    featured:false,

    bestseller:false,

    isVeg:true,

    calories:450,

    variants:[],

    addons:[],
  },

];



export {
  categories,
  menuData,
};


export default menuData;