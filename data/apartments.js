// מאגר הדירות. Claude מעדכן את הקובץ הזה בכל פעם שנשלחת מודעה חדשה.
// צילומי מסך נשמרים בתיקייה screenshots/ ומקושרים בשדה screenshot.
//
// ערכים אפשריים:
//   status:   "not_contacted" | "waiting" | "answered" | "visit_scheduled" | "visited" | "irrelevant"
//   platform: "whatsapp" | "phone" | "facebook" | "yad2" | "sms" | "other"
//   ratings:  כל פרמטר 1–5, או null אם עוד לא דורג
//   תאריכים בפורמט YYYY-MM-DD
//
// מבנה רשומה:
// {
//   id: "apt-001",
//   location: "רחוב, שכונה, עיר",
//   description: "תיאור כללי מהמודעה",
//   price: 5200,          // שכר דירה חודשי ב-₪
//   rooms: 3,
//   size: 75,             // מ"ר
//   floor: "2 מתוך 4",
//   link: "https://www.yad2.co.il/...",
//   source: "yad2",       // "yad2" | "facebook" | "other"
//   screenshot: "screenshots/apt-001.jpg",
//   contactName: "",
//   contactPhone: "",
//   status: "not_contacted",
//   platform: "whatsapp",
//   visitDate: null,
//   entryDate: null,
//   ratings: { renovated: null, location: null, price: null, shelter: null, size: null, furnished: null },
//   notes: "",
//   addedAt: "2026-10-11"
// }

window.APARTMENTS = [
];
