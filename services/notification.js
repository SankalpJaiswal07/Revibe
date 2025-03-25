// notification.js
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Initialize notification handler and request permissions
export const initializeNotifications = async () => {
  await Notifications.requestPermissionsAsync();
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};

// Schedule a notification for a random entry from the provided data
export const scheduleRandomNotification = async (seconds, notificationData) => {
  // Select a random notification from the provided data
  const randomIndex = Math.floor(Math.random() * notificationData.length);
  const notification = notificationData[randomIndex];

  const trigger = new Date(Date.now() + seconds * 1000);

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: notification.title || "Default Title",
      body: notification.body || "Default Body",
    },
    trigger,
  });

  return identifier;
};

// Convert notification times into seconds and schedule notifications
export const scheduleMultipleNotifications = async (
  notificationTimes,
  notificationData
) => {
  for (let i = 0; i < notificationTimes.length; i++) {
    const { hour, minute } = notificationTimes[i];

    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(hour, minute, 0, 0);

    let seconds = (targetTime.getTime() - now.getTime()) / 1000;
    if (seconds < 0) {
      // If the target time is in the past, schedule for the next day
      seconds += 24 * 60 * 60;
    }

    // Schedule a random notification for each time
    await scheduleRandomNotification(seconds, notificationData);
  }
};
// Cancel all scheduled notifications
export const cancelAllScheduledNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

// Example usage of scheduling notifications
export const setupNotifications = async () => {
  const notificationTimes = [
    { hour: 7, minute: 30 },
    { hour: 8, minute: 45 },
    { hour: 12, minute: 30 },
    { hour: 13, minute: 45 },
    { hour: 15, minute: 15 },
    { hour: 16, minute: 45 },
    { hour: 18, minute: 15 },
    { hour: 19, minute: 45 },
    { hour: 21, minute: 30 },
    { hour: 22, minute: 45 },
  ];

  const notificationData = [
    {
      id: "1",
      title: "Recycle Reminder",
      body: "Time to check your recyclables!",
    },
    { id: "2", title: "Eco Tip", body: "Reuse glass jars for storage." },
    { id: "3", title: "Sorting Help", body: "Plastic goes in the blue bin!" },
    {
      id: "4",
      title: "Paper Recycling",
      body: "Flatten cardboard boxes before recycling.",
    },
    {
      id: "5",
      title: "Metal Matters",
      body: "Rinse metal cans before recycling.",
    },
    {
      id: "6",
      title: "E-Waste Alert",
      body: "Dispose of old electronics responsibly.",
    },
    {
      id: "7",
      title: "Eco Challenge",
      body: "Try to go plastic-free for a day!",
    },
    {
      id: "8",
      title: "Composting Tip",
      body: "Add vegetable scraps to your compost bin.",
    },
    {
      id: "9",
      title: "Sustainable Shopping",
      body: "Choose products with minimal packaging.",
    },
    {
      id: "10",
      title: "Water Conservation",
      body: "Turn off the tap when brushing your teeth.",
    },
    {
      id: "11",
      title: "Plastic Tip",
      body: "Use reusable straws when dining out.",
    },
    {
      id: "12",
      title: "Recycle Tip",
      body: "Recycle magazines and newspapers for paper products.",
    },
    {
      id: "13",
      title: "Gift Wrapping Tip",
      body: "Use recycled paper or fabric to wrap gifts.",
    },
    {
      id: "14",
      title: "Battery Recycling",
      body: "Don’t throw batteries away—recycle them!",
    },
    {
      id: "15",
      title: "Plastic-Free Tip",
      body: "Avoid single-use plastic bags. Use cloth bags instead.",
    },
    {
      id: "16",
      title: "Reduce Waste",
      body: "Bring your own container when shopping.",
    },
    {
      id: "17",
      title: "Upcycling Tip",
      body: "Turn old jars into candle holders.",
    },
    {
      id: "18",
      title: "E-Waste Tip",
      body: "Recycle your phone when upgrading to a new one.",
    },
    {
      id: "19",
      title: "Composting Fact",
      body: "Avoid adding dairy or meat products to your compost.",
    },
    {
      id: "20",
      title: "Energy Tip",
      body: "Turn off lights when you leave a room.",
    },
    {
      id: "21",
      title: "Recycling Fact",
      body: "Recycling one ton of paper saves 17 trees.",
    },
    { id: "22", title: "Eco Challenge", body: "Plant a tree this weekend!" },
    {
      id: "23",
      title: "Recycling Tip",
      body: "Wash plastic containers before recycling.",
    },
    {
      id: "24",
      title: "Sustainable Packaging",
      body: "Opt for cardboard over plastic packaging.",
    },
    {
      id: "25",
      title: "Composting Reminder",
      body: "Your kitchen waste can turn into valuable compost.",
    },
    {
      id: "26",
      title: "Recycling Myth",
      body: "Recycling saves energy, not just the planet!",
    },
    {
      id: "27",
      title: "Eco Tip",
      body: "Choose products made from recycled materials.",
    },
    {
      id: "28",
      title: "Reduce Plastic",
      body: "Use reusable water bottles instead of plastic bottles.",
    },
    {
      id: "29",
      title: "E-Waste Tip",
      body: "Donate old electronics instead of discarding them.",
    },
    {
      id: "30",
      title: "Textile Recycling",
      body: "Donate or repurpose old clothes instead of throwing them away.",
    },
    {
      id: "31",
      title: "Upcycling Idea",
      body: "Turn old t-shirts into reusable shopping bags.",
    },
    {
      id: "32",
      title: "Recycling Fact",
      body: "Recycling aluminum saves up to 95% of the energy used to make new aluminum.",
    },
    {
      id: "33",
      title: "Plastic-Free Tip",
      body: "Opt for paper straws instead of plastic.",
    },
    {
      id: "34",
      title: "Compost Tip",
      body: "Add dried leaves to your compost pile for balance.",
    },
    {
      id: "35",
      title: "Sustainable Shopping",
      body: "Buy items with minimal or no plastic packaging.",
    },
    {
      id: "36",
      title: "Recycling Reminder",
      body: "Check your office for paper waste to recycle.",
    },
    {
      id: "37",
      title: "Energy Tip",
      body: "Use natural light when possible instead of turning on lights.",
    },
    { id: "38", title: "Eco Challenge", body: "Try a zero-waste week!" },
    {
      id: "39",
      title: "Recycle Tip",
      body: "Remove lids from jars before recycling them.",
    },
    {
      id: "40",
      title: "E-Waste Tip",
      body: "Recycle old printers and fax machines properly.",
    },
    {
      id: "41",
      title: "Sustainable Fashion Tip",
      body: "Buy clothes from brands that use sustainable materials.",
    },
    {
      id: "42",
      title: "Recycling Tip",
      body: "Keep recyclables clean to avoid contamination.",
    },
    {
      id: "43",
      title: "Plastic-Free Tip",
      body: "Carry your own reusable shopping bag wherever you go.",
    },
    {
      id: "44",
      title: "Energy Tip",
      body: "Unplug electronics when not in use to save power.",
    },
    {
      id: "45",
      title: "Composting Fact",
      body: "Composting can reduce your household waste by up to 30%.",
    },
    {
      id: "46",
      title: "Upcycling Idea",
      body: "Turn wine corks into a bulletin board.",
    },
    {
      id: "47",
      title: "Plastic Tip",
      body: "Avoid using disposable plastic coffee cups.",
    },
    {
      id: "48",
      title: "Recycling Fact",
      body: "Recycling one glass bottle saves enough energy to power a light bulb for four hours.",
    },
    {
      id: "49",
      title: "Water Conservation Tip",
      body: "Install low-flow showerheads to save water.",
    },
    {
      id: "50",
      title: "Composting Tip",
      body: "Add green waste like grass clippings to your compost.",
    },
    {
      id: "51",
      title: "Plastic-Free Tip",
      body: "Avoid plastic wrap by using reusable containers.",
    },
    {
      id: "52",
      title: "Upcycling Tip",
      body: "Use old bottles to create planters for your garden.",
    },
    {
      id: "53",
      title: "Eco Challenge",
      body: "Go a week without buying any plastic products.",
    },
    {
      id: "54",
      title: "Recycling Tip",
      body: "Check if your local recycling program accepts certain plastics.",
    },
    {
      id: "55",
      title: "Energy Tip",
      body: "Switch to energy-efficient light bulbs.",
    },
    {
      id: "56",
      title: "Composting Tip",
      body: "Avoid adding plastic to your compost bin.",
    },
    {
      id: "57",
      title: "Sustainable Product Tip",
      body: "Buy items with eco-friendly packaging.",
    },
    {
      id: "58",
      title: "Plastic-Free Tip",
      body: "Opt for bar soap instead of liquid soap in plastic bottles.",
    },
    {
      id: "59",
      title: "Water Conservation Tip",
      body: "Fix leaky faucets to save water.",
    },
    {
      id: "60",
      title: "Recycle Tip",
      body: "Don’t throw away plastic containers—check if they can be recycled.",
    },
    {
      id: "61",
      title: "Eco Challenge",
      body: "Switch to a plant-based diet for a week!",
    },
    {
      id: "62",
      title: "Composting Tip",
      body: "Turn your compost pile regularly for better results.",
    },
    {
      id: "63",
      title: "E-Waste Tip",
      body: "Dispose of your old batteries at a certified recycling center.",
    },
    {
      id: "64",
      title: "Sustainable Living Tip",
      body: "Opt for cloth diapers instead of disposable ones.",
    },
    {
      id: "65",
      title: "Energy Tip",
      body: "Use a programmable thermostat to reduce energy consumption.",
    },
    {
      id: "66",
      title: "Plastic-Free Tip",
      body: "Use beeswax wraps instead of plastic wrap.",
    },
    {
      id: "67",
      title: "Water Conservation Tip",
      body: "Collect rainwater to water your plants.",
    },
    {
      id: "68",
      title: "Recycle Tip",
      body: "Separate recyclables by material type for easier sorting.",
    },
    {
      id: "69",
      title: "E-Waste Tip",
      body: "Donate old phones to charity or recycle them.",
    },
    {
      id: "70",
      title: "Composting Reminder",
      body: "Remember to compost your coffee grounds!",
    },
    {
      id: "71",
      title: "Upcycling Tip",
      body: "Repurpose old plastic containers into storage solutions.",
    },
    {
      id: "72",
      title: "Plastic-Free Tip",
      body: "Use a refillable pen instead of disposable ones.",
    },
    {
      id: "73",
      title: "Eco Tip",
      body: "Use paperless billing to reduce paper waste.",
    },
    {
      id: "74",
      title: "Sustainable Shopping Tip",
      body: "Buy items that can be easily recycled at the end of their life.",
    },
    {
      id: "75",
      title: "Water Conservation Tip",
      body: "Install a water-efficient irrigation system.",
    },
    {
      id: "76",
      title: "Energy Tip",
      body: "Air dry your laundry to save energy.",
    },
    {
      id: "77",
      title: "Composting Tip",
      body: "Compost your yard waste instead of sending it to the landfill.",
    },
    {
      id: "78",
      title: "Recycle Tip",
      body: "Rinse your recyclables before putting them in the bin.",
    },
    {
      id: "79",
      title: "Sustainable Living Tip",
      body: "Switch to natural cleaning products to reduce chemical waste.",
    },
    {
      id: "80",
      title: "Plastic-Free Tip",
      body: "Avoid buying individually packaged snacks.",
    },
    {
      id: "81",
      title: "Recycling Myth",
      body: "Not all plastics are recyclable. Check your local guidelines.",
    },
    {
      id: "82",
      title: "Composting Tip",
      body: "Shred large materials before composting them for faster decomposition.",
    },
    {
      id: "83",
      title: "Sustainable Fashion Tip",
      body: "Choose clothing made from organic cotton.",
    },
    {
      id: "84",
      title: "Plastic-Free Tip",
      body: "Use a metal or bamboo toothbrush instead of plastic.",
    },
    {
      id: "85",
      title: "Recycling Reminder",
      body: "Remember to recycle your old newspapers!",
    },
    {
      id: "86",
      title: "Upcycling Idea",
      body: "Repurpose old jeans into a stylish bag.",
    },
    {
      id: "87",
      title: "Energy Tip",
      body: "Turn off electronics when not in use to reduce energy consumption.",
    },
    {
      id: "88",
      title: "Sustainable Living Tip",
      body: "Buy locally grown food to reduce food miles.",
    },
    {
      id: "89",
      title: "Composting Reminder",
      body: "Your food scraps can become nutrient-rich soil.",
    },
    {
      id: "90",
      title: "Plastic-Free Tip",
      body: "Opt for a bamboo cutlery set instead of plastic.",
    },
    {
      id: "91",
      title: "Recycling Fact",
      body: "Recycling helps conserve natural resources and energy.",
    },
    {
      id: "92",
      title: "Water Conservation Tip",
      body: "Take shorter showers to conserve water.",
    },
    {
      id: "93",
      title: "E-Waste Alert",
      body: "Recycling e-waste prevents harmful chemicals from entering the environment.",
    },
    {
      id: "94",
      title: "Recycling Tip",
      body: "Be mindful of the materials you throw away—try to recycle them!",
    },
    {
      id: "95",
      title: "Eco Challenge",
      body: "Switch to a paper-free office for a month!",
    },
    {
      id: "96",
      title: "Upcycling Idea",
      body: "Transform old wine bottles into unique vases.",
    },
    {
      id: "97",
      title: "Sustainable Product Tip",
      body: "Opt for a stainless steel razor instead of disposable ones.",
    },
    {
      id: "98",
      title: "Plastic-Free Tip",
      body: "Use cloth diapers instead of disposable ones.",
    },
    {
      id: "99",
      title: "Recycling Fact",
      body: "Recycling plastic saves energy and reduces waste.",
    },
    {
      id: "100",
      title: "Composting Tip",
      body: "Turn your compost pile regularly to speed up the process.",
    },
  ];

  await scheduleMultipleNotifications(notificationTimes, notificationData);
};
