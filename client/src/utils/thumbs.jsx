// פונקציות נרמול קלות כדי ש"הבדלי גרשיים/רווחים" לא יפילו אותנו
const norm = (s='') =>
  String(s)
    .toLowerCase()
    .replace(/[״"]/g, '')      // " → ריק
    .replace(/[׳']/g, '')      // ' → ריק
    .replace(/\s+/g, ' ')      // רווחים מרובים → רווח אחד
    .trim();

const keyOf = (name, brand, qty) => [norm(name), norm(brand), norm(qty)].join('|');

// ✅ כאן ממפים צירופים לתמונות ששמרת ב־public/packshots/dairy/
// אפשר להרחיב בהמשך לעוד קטגוריות/מוצרים
const DAIRY_MAP = {
  [keyOf('חלב', 'תנובה', '1 ליטר')]:           'milk-tnuva.png',
  [keyOf('חלב דל לקטוז', 'יוטבתה', '1 ליטר')]: 'dal-laktoz.png',
  [keyOf('יוגורט טבעי', 'דנונה', '150 גרם')]:   'yogurt.png',
  [keyOf('שוקו', 'שוקוליו', '250 מ\"ל')]:       'shoko.png',
  [keyOf('גבינה לבנה', 'שטראוס', '250 גרם')]:   'gvina.png',
  [keyOf('גבינת קוטג', 'תנובה', '250 גרם')]:    'kotege.png',
};

// אם תרצי לעבוד לפי IDs — זה אפילו יותר פשוט:
const ID_MAP = {
  // 1: 'milk-tnuva.png',
  // 2: 'dal-laktoz.png',
};

export function getLocalPackshot(p) {
  // נסיון לפי id (אם תרצי להשתמש)
  if (p?.id && ID_MAP[p.id]) return `/packshots/dairy/${ID_MAP[p.id]}`;

  // נסיון לפי (name+brand+quantity)
  const key = keyOf(p?.name, p?.brand, p?.quantity);
  if (DAIRY_MAP[key]) return `/packshots/dairy/${DAIRY_MAP[key]}`;

  // נפילת-מדרגה (אין התאמה): פלייסהולדר/איקון קטגוריה
  return '/placeholder.svg';
}
