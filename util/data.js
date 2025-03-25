export const dummyData = [
  {
    id: "1",
    imageUri:
      "https://images.pexels.com/photos/4498089/pexels-photo-4498089.jpeg",
    descriptionTitle: "Plastic Bottle",
    timeAdded: "5 minutes ago",
    description:
      "A plastic bottle commonly used for beverages and household products.",
    recycleIdeaOrReuseIdea: [
      {
        title: "DIY Planter",
        description:
          "Cut the bottom part of the bottle, fill it with soil, and use it as a small planter for herbs or flowers.",
      },
      {
        title: "Storage for Small Items",
        description:
          "Clean and repurpose the bottle to store small items like beads, screws, or buttons.",
      },
    ],
    binCategory: "Plastic",
  },
  {
    id: "2",
    imageUri:
      "https://images.pexels.com/photos/4498124/pexels-photo-4498124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    descriptionTitle: "Cardboard Box",
    timeAdded: "15 minutes ago",
    description: "A sturdy cardboard box suitable for packaging and storage.",
    recycleIdeaOrReuseIdea: [
      {
        title: "Gift Box",
        description:
          "Decorate the box with wrapping paper to reuse it as a gift box.",
      },
      {
        title: "DIY Organizer",
        description:
          "Cut and arrange pieces of the box to create compartments for organizing desk items.",
      },
    ],
    binCategory: "Paper",
  },
  {
    id: "3",
    imageUri:
      "https://images.pexels.com/photos/7604265/pexels-photo-7604265.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    descriptionTitle: "Glass Jar",
    timeAdded: "30 minutes ago",
    description:
      "A transparent glass jar ideal for storing food or small items.",
    recycleIdeaOrReuseIdea: [
      {
        title: "Homemade Candle Holder",
        description: "Pour wax into the jar to create a custom candle holder.",
      },
      {
        title: "Kitchen Storage",
        description:
          "Use the jar to store spices, dried fruits, or other small food items.",
      },
    ],
    binCategory: "Glass",
  },

  {
    id: "4",
    imageUri:
      "https://images.pexels.com/photos/5740584/pexels-photo-5740584.jpeg",
    descriptionTitle: "Food Waste",
    timeAdded: "40 minutes ago",
    description:
      "Leftover food, fruit peels, and other organic waste materials.",
    recycleIdeaOrReuseIdea: [
      {
        title: "Composting",
        description: "Turn food waste into compost to enrich garden soil.",
      },
      {
        title: "Animal Feed",
        description: "Donate suitable food waste as feed for animals.",
      },
    ],
    binCategory: "Organic",
  },
  {
    id: "5",
    imageUri:
      "https://images.pexels.com/photos/6591436/pexels-photo-6591436.jpeg",
    descriptionTitle: "Scrap Metal",
    timeAdded: "1 hour ago",
    description: "Pieces of metal from old machinery or household items.",
    recycleIdeaOrReuseIdea: [
      {
        title: "Sell to Scrap Dealers",
        description:
          "Metal scraps can be sold to recycling facilities or scrap dealers.",
      },
      {
        title: "DIY Projects",
        description:
          "Use metal scraps to create decorative or functional items like lamps.",
      },
    ],
    binCategory: "Metal",
  },
  {
    id: "6",
    imageUri:
      "https://images.pexels.com/photos/947407/pexels-photo-947407.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    descriptionTitle: "Old Smartphone",
    timeAdded: "1 day ago",
    description: "A non-functioning smartphone with recyclable components.",
    recycleIdeaOrReuseIdea: [
      {
        title: "Recycle E-Waste",
        description: "Take the smartphone to an e-waste recycling facility.",
      },
      {
        title: "Parts Harvesting",
        description:
          "Extract useful parts like the screen or battery for reuse.",
      },
    ],
    binCategory: "Electronics",
  },
  {
    id: "7",
    imageUri:
      "https://images.pexels.com/photos/1301410/pexels-photo-1301410.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    descriptionTitle: "Used Tire",
    timeAdded: "3 days ago",
    description:
      "An old tire made of rubber, commonly used in vehicles and heavy machinery.",
    recycleIdeaOrReuseIdea: [
      {
        title: "Playground Swing",
        description:
          "Repurpose the tire as a swing by attaching it to a sturdy rope and securing it to a tree.",
      },
      {
        title: "Garden Planter",
        description:
          "Use the tire as a decorative garden planter by filling it with soil and planting flowers or shrubs.",
      },
    ],
    binCategory: "Others",
  },
];

export function fetchRecentItemById(id) {
  const item = dummyData.find((data) => data.id === id);
  return item ? item : null; // Return null if no item matches the ID
}

export function fetchRecentItemsByBinCategory(binCategoryName) {
  const items = dummyData.filter(
    (data) => data.binCategory === binCategoryName
  );
  return items.length > 0 ? items : null; // Return null if no items match the binCategory
}
