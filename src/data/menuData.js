/**
 * Mingo Mates – Static Menu Data
 * In production, replace this with Firestore:
 *   const [menu, setMenu] = useState([]);
 *   useEffect(() => {
 *     const unsub = onSnapshot(collection(db, 'menu'), snap => {
 *       setMenu(snap.docs.map(d => ({ id: d.id, ...d.data() })));
 *     });
 *     return unsub;
 *   }, []);
 */

export const CATEGORIES = [
  { id: 'all',    label: 'All Items',    emoji: '🍽️' },
  { id: 'meal',   label: 'Mingo Meals',  emoji: '🥘' },
  { id: 'snack',  label: 'Quick Snacks', emoji: '🍟' },
  { id: 'drink',  label: 'Chilled Drinks', emoji: '🥤' },
];

export const MENU_ITEMS = [
  // ─── Mingo Meals ──────────────────────────────────────────────────────────
  {
    id: 'm1',
    name: 'Mingo Burger',
    category: 'meal',
    price: 80,
    emoji: '🍔',
    description: 'Juicy double-patty burger with house-made chutney sauce',
    popular: true,
  },
  {
    id: 'm2',
    name: 'Masala Dosa',
    category: 'meal',
    price: 70,
    emoji: '🫓',
    description: 'Crispy golden dosa with spiced potato filling & chutneys',
    popular: true,
  },
  {
    id: 'm3',
    name: 'Veg Thali',
    category: 'meal',
    price: 120,
    emoji: '🍛',
    description: 'Full meal: dal, sabzi, roti, rice & papad',
    popular: false,
  },
  {
    id: 'm4',
    name: 'Paneer Butter Masala Bowl',
    category: 'meal',
    price: 110,
    emoji: '🍲',
    description: 'Rich tomato-cream gravy with soft paneer cubes over rice',
    popular: true,
  },
  {
    id: 'm5',
    name: 'Egg Fried Rice',
    category: 'meal',
    price: 90,
    emoji: '🍳',
    description: 'Wok-tossed fried rice with egg & mixed veggies',
    popular: false,
  },
  {
    id: 'm6',
    name: 'Chicken Biryani',
    category: 'meal',
    price: 150,
    emoji: '🍚',
    description: 'Fragrant basmati layered with tender chicken & whole spices',
    popular: true,
  },
  {
    id: 'm7',
    name: 'Rajma Chawal',
    category: 'meal',
    price: 85,
    emoji: '🫘',
    description: 'Slow-cooked kidney beans over steaming white rice',
    popular: false,
  },

  // ─── Quick Snacks ─────────────────────────────────────────────────────────
  {
    id: 's1',
    name: 'Paneer Roll',
    category: 'snack',
    price: 50,
    emoji: '🌯',
    description: 'Grilled paneer tikka wrapped in soft roomali roti',
    popular: true,
  },
  {
    id: 's2',
    name: 'Samosa (2 pcs)',
    category: 'snack',
    price: 30,
    emoji: '🔺',
    description: 'Crispy golden samosas with tamarind & mint chutney',
    popular: false,
  },
  {
    id: 's3',
    name: 'Maggi Masala',
    category: 'snack',
    price: 40,
    emoji: '🍜',
    description: 'Classic Maggi noodles, tossed with butter & spices',
    popular: true,
  },
  {
    id: 's4',
    name: 'Bread Omelette',
    category: 'snack',
    price: 45,
    emoji: '🥚',
    description: 'Fluffy omelette sandwiched in buttered bread slices',
    popular: false,
  },
  {
    id: 's5',
    name: 'French Fries',
    category: 'snack',
    price: 60,
    emoji: '🍟',
    description: 'Crispy golden fries with a dusting of chaat masala',
    popular: true,
  },
  {
    id: 's6',
    name: 'Vada Pav',
    category: 'snack',
    price: 25,
    emoji: '🍞',
    description: 'Mumbai-style spiced potato vada in a soft pav bun',
    popular: true,
  },

  // ─── Chilled Drinks ───────────────────────────────────────────────────────
  {
    id: 'd1',
    name: 'Mango Lassi',
    category: 'drink',
    price: 40,
    emoji: '🥭',
    description: 'Thick, chilled yogurt smoothie blended with Alphonso mangoes',
    popular: true,
  },
  {
    id: 'd2',
    name: 'Cold Coffee',
    category: 'drink',
    price: 60,
    emoji: '☕',
    description: 'Blended cold brew with milk froth & chocolate drizzle',
    popular: true,
  },
  {
    id: 'd3',
    name: 'Nimbu Pani',
    category: 'drink',
    price: 20,
    emoji: '🍋',
    description: 'Chilled fresh lime water with a pinch of kala namak',
    popular: false,
  },
  {
    id: 'd4',
    name: 'Masala Chaas',
    category: 'drink',
    price: 25,
    emoji: '🥛',
    description: 'Spiced buttermilk with cumin, coriander & green chilli',
    popular: false,
  },
  {
    id: 'd5',
    name: 'Oreo Shake',
    category: 'drink',
    price: 80,
    emoji: '🍦',
    description: 'Blended Oreo milkshake with whipped cream topping',
    popular: true,
  },
  {
    id: 'd6',
    name: 'Virgin Mojito',
    category: 'drink',
    price: 70,
    emoji: '🌿',
    description: 'Fresh mint, lime & soda — chilled and energising',
    popular: false,
  },
];
