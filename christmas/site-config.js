/* ============================================================
   GENERIC WEBSITE TEMPLATE — EDIT THIS FILE FIRST
   ============================================================
   Replace the sample information below with the information for
   each new website. Most normal website changes can be made here.
*/

window.SITE_CONFIG = {
  business: {
    name: "KKFlorida",
    shortName: "T-shirts, photos, artwork for all occasions.",
    tagline: "Looking for that ugly sweater that's just perfect for Christmas gatherings? We have it.",
    domain: "https://kkflorida.com/",
    shopUrl: "https://kkflorida.com/",
    logo: "assets/logo.png",
    favicon: "assets/favicon.ico",
    socialImage: "assets/social-share.svg"
  },

  seo: {
    title: "KKFlorida | T-shirts, photos, artwork for all occasions.",
    description: "Celebrate the holiday season with our collection of fun, colorful, and hilariously ugly Christmas sweaters! Whether you're heading to an ugly sweater party, celebrating with family, or just spreading Christmas cheer, we've got the perfect sweater to make spirits bright. Life's too short for boring Christmas sweaters!"
  },

  colors: {
    ink: "#101216",
    inkSoft: "#181b21",
    paper: "#f5f2eb",
    white: "#ffffff",
    muted: "#6f7278",
    line: "#d9d5cc",
    primary: "#e32b2f",
    primaryDark: "#a8131b",
    accent: "#3157e0"
  },

  navigation: [
    { label: "Featured", url: "#featured" },
    { label: "About", url: "#about" },
    { label: "Collections", url: "#collections" }
  ],

  hero: {
    eyebrow: "WHAT YOU OFFER",
    title: "It's Christmas",
    highlight: "KK Florida – A Little Wild, A Little Wacky, and Never Boring!.",
    description: "From original Florida wildlife photography and breathtaking Everglades sunsets to colorful artwork, quirky cartoons, and downright crazy creations, KK Florida has something for everyone! Explore unique photography prints, art prints, apparel, gifts, and fun products featuring our original designs. We love nature, creativity, and thinking outside the box. You never know what you'll find at KK Florida—and that's exactly how we like it!.",
    primaryButton: { label: "View featured items", url: "#featured" },
    secondaryButton: { label: "Learn more", url: "#about" },
    points: ["First benefit", "Second benefit", "Third benefit"],
    image1: "assets/whiskers.png",
    image1Alt: "Featured image one",
    image2: "assets/christmasnutty.png",
    image2Alt: "Featured image two",
    badge: "All of our t-shirts are made to order."
  },

  featured: {
    eyebrow: "FEATURED",
    heading: "Showcase your best products or services.",
    viewAllLabel: "View everything",
    viewAllUrl: "https://kkflorida.com",
    filters: [
      { key: "all", label: "All" },
      { key: "category-one", label: "Category One" },
      { key: "category-two", label: "Category Two" },
      { key: "category-three", label: "Category Three" }
    ]
  },

  products: [
    {
      title: "Whiskers on Kittens",
      type: "Christmas Ugly Sweater",
      price: "$24.99",
      category: "Christmas Ugly Sweater",
      image: "assets/whiskers.png",
      url: "https://www.teepublic.com/t-shirt/100880574-whiskers-on-kittens-ugly-christmas-sweater?store_id=4510655",
      badge: "Featured"
    },
    {
      title: "Forget the chestnuts, we want pork butts!",
      type: "Christmas Ugly Sweater",
      price: "$24.99",
      category: "Christmas Ugly Sweater",
      image: "assets/porkbutt.png",
      url: "https://www.teepublic.com/t-shirt/100880573-forget-the-chestnuts-we-want-pork-butts?store_id=4510655",
      badge: "Featured"

    },
    {
      title: "Christmas sweater for your southern trucker friends T-Shirt",
      type: "Christmas Ugly Sweater",
      price: "$24.99",
      category: "Christmas Ugly Sweater",
      image: "assets/mudtires.png",
      url: "https://www.teepublic.com/t-shirt/100880567-christmas-sweater-for-your-southern-trucker-friend?store_id=4510655"
    },
{
      title: "Three Wise Storks T-Shirt",
      type: "Christmas Ugly Sweater",
      price: "$24.99",
      category: "Christmas Ugly Sweater",
      image: "assets/christmasstork.png",
      url: "https://www.teepublic.com/t-shirt/100880557-three-wise-storks?store_id=4510655"
    },

{
      title: "Nutty squirrel Christmas T-Shirt",
      type: "Christmas Ugly Sweater",
      price: "$24.99",
      category: "Christmas Ugly Sweater",
      image: "assets/christmasnutty.png",
      url: "https://www.teepublic.com/t-shirt/100880552-nutty-squirrel-christmas?store_id=4510655"
    },


    {
      title: "A Florida Christmas ugly sweater T-Shirt",
      type: "Christmas Ugly Sweater",
      price: "$24.99",
      category: "Christmas Ugly Sweater",
      image: "assets/iguana.jpg",
      url: "https://www.teepublic.com/t-shirt/100880563-a-florida-christmas-ugly-sweater?store_id=4510655"

    }
  ],

  about: {
    eyebrow: "ABOUT",
    heading: "A Little Wild, A Little Wacky, and Never Boring!",
    paragraphs: [
      "KK Florida is more than just a photography and art website. It's a collection of things that catch my eye, spark my imagination, or simply make me smile.\n\nFrom my original Florida wildlife photography and beautiful Everglades sunsets to whimsical artwork, funny cartoons, unique apparel, and one-of-a-kind gifts, there's a little something for everyone.\n\nI believe art doesn't have to be serious, photography can tell a story, and sometimes the silliest ideas make the best creations.",
      "When you shop KK Florida, you're supporting an independent photographer and artist—not a big corporation.\n\nCome explore, have a laugh, find something you love, and check back often. You never know what I'll come up with next!"
    ],
    linkLabel: "Explore featured items",
    linkUrl: "#featured"
  },

  collectionsSection: {
    eyebrow: "EXPLORE",
    heading: "Choose a collection or category."
  },

  collections: [
    { label: "COLLECTION", title: "Collection One", action: "View now →", image: "assets/mudtires.png", url: "https://shop.example.com/collection-one" },
    { label: "COLLECTION", title: "Collection Two", action: "View now →", image: "assets/porkbutt.png", url: "https://shop.example.com/collection-two" },
    { label: "COLLECTION", title: "Collection Three", action: "View now →", image: "assets/iguana.jpg", url: "https://shop.example.com/collection-three" }
  ],

  finalCallToAction: {
    eyebrow: "READY TO BEGIN?",
    heading: "Give visitors one clear next step.",
    buttonLabel: "Visit our shop",
    buttonUrl: "https://shop.example.com"
  },

  footer: {
    description: "A short footer description of your business, organization, products, or services.",
    closingLine: "YOUR SHORT TAGLINE",
    columns: [
      {
        heading: "Explore",
        links: [
          { label: "All products", url: "https://shop.example.com" },
          { label: "Featured", url: "#featured" },
          { label: "Collections", url: "#collections" }
        ]
      },
      {
        heading: "Information",
        links: [
          { label: "About", url: "#about" },
          { label: "Terms", url: "https://shop.example.com/terms" },
          { label: "Privacy policy", url: "https://shop.example.com/privacy" }
        ]
      }
    ]
  }
};
