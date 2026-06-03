import { FoodItem, Recipe } from './types';

export const COMMON_FOODS: FoodItem[] = [
  { id: '1', name: 'Cooked White Rice', calories: 130, protein: 2.7, carbs: 28, fats: 0.3 },
  { id: '2', name: 'Cooked Brown Rice', calories: 111, protein: 2.6, carbs: 23, fats: 0.9 },
  { id: '3', name: 'Wheat Roti (1 medium)', calories: 120, protein: 3, carbs: 24, fats: 0.5, servingSize: 40 },
  { id: '4', name: 'Dal (Cooked)', calories: 116, protein: 9, carbs: 20, fats: 0.4 },
  { id: '5', name: 'Paneer', calories: 265, protein: 18, carbs: 1.2, fats: 20 },
  { id: '6', name: 'Chicken Breast (Cooked)', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
  { id: '7', name: 'Egg (Boiled, 1 large)', calories: 155, protein: 13, carbs: 1.1, fats: 11, servingSize: 50 },
  { id: '8', name: 'Idli (1 medium)', calories: 58, protein: 1.6, carbs: 12, fats: 0.1, servingSize: 40 },
  { id: '9', name: 'Dosa (Plain, 1 medium)', calories: 133, protein: 2.1, carbs: 26, fats: 2.4, servingSize: 60 },
  { id: '10', name: 'Sambar', calories: 60, protein: 2.5, carbs: 10, fats: 1.5 },
  { id: '11', name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fats: 0.3 },
  { id: '12', name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fats: 0.2 },
  { id: '13', name: 'Almonds', calories: 579, protein: 21, carbs: 22, fats: 49 },
  { id: '14', name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fats: 0.4 },
  { id: '15', name: 'Oats (Cooked)', calories: 68, protein: 2.4, carbs: 12, fats: 1.4 },
  { id: '16', name: 'Spinach (Cooked)', calories: 23, protein: 3, carbs: 3.6, fats: 0.3 },
  { id: '17', name: 'Broccoli (Cooked)', calories: 35, protein: 2.4, carbs: 7, fats: 0.4 },
  { id: '18', name: 'Curd (Indian)', calories: 61, protein: 3.5, carbs: 4.7, fats: 3.3 },
  { id: '19', name: 'Upma', calories: 132, protein: 3, carbs: 25, fats: 2.5 },
  { id: '20', name: 'Poha', calories: 110, protein: 2.3, carbs: 25, fats: 0.2 },
];

export const RECIPES: Recipe[] = [
  {
    id: 'r1',
    name: 'High Protein Paneer Salad',
    description: 'Crisp, cooling salad with fresh paneer cubes, organic cucumbers, tomatoes, and zesty lemon-herb dressing.',
    type: 'veg',
    category: 'Lunch',
    ingredients: [
      '100g Paneer, cubed',
      '1 English Cucumber, diced',
      '1 tomato, diced (deseeded)',
      '1/4 cup red onion, minced',
      '1 tbsp fresh lemon juice',
      '1 tsp extra-virgin olive oil',
      'Salt & black pepper to taste',
      'Coriander for garnish'
    ],
    instructions: [
      'Paneer: Cut into neat 1/2-inch cubes.',
      'Produce: Wash, dry, and dice cucumber, onion, and tomato.',
      'Blend: Toss veggies together in a clean bowl.',
      'Combine: Fold paneer cubes gently into the veggie base.',
      'Drizzle: Mix olive oil and lemon juice, pour over assembly.',
      'Season: Garnish with salt, black pepper, and coriander. Serves fresh.'
    ],
    calories: 180,
    protein: 15,
    carbs: 8,
    fats: 10,
    servingSize: 250,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r2',
    name: 'Grilled Chicken & Steamed Broccoli',
    description: 'A clean classic featuring lean herb-marinated grilled chicken served with vibrant tender-crisp steamed broccoli florets.',
    type: 'non-veg',
    category: 'Dinner',
    ingredients: [
      '150g skinless chicken breast',
      '100g fresh broccoli florets',
      '1 tsp olive oil',
      '2 garlic cloves, minced',
      '1/2 tsp dried Italian herbs',
      '1/4 tsp salt & black pepper',
      '1 tsp lemon juice'
    ],
    instructions: [
      'Prep: Flatten chicken to 1/2-inch thick for even cooking.',
      'Marinate: Mix chicken with garlic, herbs, lemon, half oil, salt, and pepper for 20 mins.',
      'Grill: Sear chicken on grill pan for 5-6 mins per side till cooked through.',
      'Rest: Transfer poultry to a board, cover with foil, let rest for 5 mins.',
      'Steam: Boil 1 inch of water, steam broccoli in basket for 4 mins.',
      'Assemble: Slice chicken diagonally and serve side-by-side with hot broccoli.'
    ],
    calories: 250,
    protein: 35,
    carbs: 5,
    fats: 8,
    servingSize: 300,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r3',
    name: 'Oats Idli',
    description: 'Light, fluffy steamed oat cakes enriched with grated orange carrots, green chilies, and mild traditional tempering.',
    type: 'veg',
    category: 'Breakfast',
    ingredients: [
      '1 cup rolled oats (powdered)',
      '1/2 cup low-fat yogurt, whisked',
      '1/4 cup carrots, grated',
      '1/2 tsp ginger, grated',
      '1 green chili, minced',
      '1/2 tsp mustard seeds',
      '1/4 tsp Eno fruit salt',
      '1 tsp oil'
    ],
    instructions: [
      'Roast: Dry-roast oats for 4 mins, let cool, and grind into fine flour.',
      'Temper: Heat oil, pop mustard seeds, then sauté curry leaves, ginger, and chili for 1 min.',
      'Batter: Mix oats flour, yogurt, carrots, tempering, salt, and 1/3 cup water. Rest 15 mins.',
      'Activate: Gently stir fruit salt (Eno) into batter just before baking to aerate.',
      'Steam: Pour into greased idli molds; steam on medium-high for 12 mins.',
      'Serve: Rest 2 mins, unmold carefully with wet spoon, and enjoy warm.'
    ],
    calories: 120,
    protein: 6,
    carbs: 20,
    fats: 2,
    servingSize: 150,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r4',
    name: 'Masala Moong Dal',
    description: 'Comforting, warm, high-protein yellow lentil soup simmered to velvety perfection with aromatic cumin, garlic, and coriander.',
    type: 'veg',
    category: 'Lunch',
    ingredients: [
      '1 cup split yellow moong dal',
      '1 onion, finely chopped',
      '1 tomato, diced',
      '1/2 tsp turmeric powder',
      '1/2 tsp cumin seeds',
      '1/2 tsp garam masala',
      '1 tsp ginger-garlic paste',
      '1 tsp ghee',
      '2.5 cups water',
      'Cilantro for garnish'
    ],
    instructions: [
      'Rinse & Soak: Wash yellow dal thoroughly. Soak in warm water for 15 mins.',
      'Cook: Pressure cook dal with water, turmeric, and salt for 3 whistles until buttery soft.',
      'Temper: Heat ghee, fry cumin seeds, then sauté onions and ginger-garlic paste for 5 mins.',
      'Tomatoes: Add tomatoes and garam masala; cook till soft and oil releases.',
      'Combine: Whisk cooked dal, stir in onion-tomato mixture, and simmer for 5 mins.',
      'Finish: Garnish with chopped fresh cilantro and serve in bowls.'
    ],
    calories: 150,
    protein: 10,
    carbs: 22,
    fats: 3,
    servingSize: 200,
    imageUrl: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r5',
    name: 'Healthy Chicken Biryani',
    description: 'A delicious low-oil recreation featuring tender yogurt-marinated breast chunks layered with fluffy brown Basmati rice.',
    type: 'non-veg',
    category: 'Dinner',
    ingredients: [
      '200g chicken breast chunks',
      '1 cup Basmati brown rice',
      '1/2 cup Greek yogurt',
      '1 tsp biryani masala',
      '1/2 tsp ginger-garlic paste',
      'Mint & coriander leaves, sliced',
      '1 red onion, sliced'
    ],
    instructions: [
      'Marinate: Toss chicken with yogurt, spices, herbs, and ginger-garlic. Refrigerate 1 hour.',
      'Rice: Boil brown rice in water with salt till 70% cooked (15 mins), then drain.',
      'Base: Cook marinated chicken in a non-stick pot for 8 mins until thick gravy forms.',
      'Layer: Top chicken with cooked rice, mint, coriander, and caramelized onions.',
      'Dum Cook: Seal pot tightly with foil + lid; slow-cook on lowest heat for 25 mins.',
      'Serve: Rest 5 mins, fluff layers gently from bottom, and serve hot.'
    ],
    calories: 350,
    protein: 28,
    carbs: 45,
    fats: 8,
    servingSize: 400,
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r6',
    name: 'Sprouts & Pomegranate Salad',
    description: 'An energizing, colorful salad combining crunchy steamed moong sprouts, roasted peanuts, and antioxidant pomegranate pearls.',
    type: 'veg',
    category: 'Snack',
    ingredients: [
      '1 cup green moong sprouts',
      '1/2 cup pomegranate seeds',
      '2 tbsp peanuts, roasted',
      '1/2 cucumber, diced',
      '1/2 tomato, diced',
      '1 tsp lemon juice',
      '1/2 tsp chaat masala',
      'Salt to taste'
    ],
    instructions: [
      'Steam: Microwave or steam sprouts for 2 mins with 1 tbsp water to retain snap.',
      'Prep: Wash, peel, and dice fresh cucumber and deseeded tomato.',
      'Bowl: Combine steamed sprouts, pomegranates, and vegetables in a wide bowl.',
      'Nuts: Toss in crushed roasted peanuts for texture and healthy fats.',
      'Spice: Sprinkle chaat masala, lemon juice, and black salt over mixture.',
      'Toss: Mix everything gently with spoons, serve immediately.'
    ],
    calories: 110,
    protein: 7,
    carbs: 18,
    fats: 2,
    servingSize: 150,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r7',
    name: 'Tangy Coastal Fish Curry',
    description: 'South Indian coastal white fish curry simmered gently in tangy tamarind pulp and light coconut milk broth.',
    type: 'non-veg',
    category: 'Lunch',
    ingredients: [
      '200g firm white fish chunks',
      '1 tbsp tamarind paste, diluted in 1/2 cup water',
      '1/2 cup light coconut milk',
      '10 curry leaves',
      '1/2 tsp mustard seeds',
      '1 onion, sliced',
      '1 tomato, chopped',
      'Turmeric & chili powder to taste'
    ],
    instructions: [
      'Temper: Heat oil, crack mustard and fenugreek seeds, then add curry leaves.',
      'Sauté: Add sliced onion and cook 5 mins; add ginger-garlic paste and sear.',
      'Spices: Add tomato, turmeric, chili, coriander powder, and cook till jammy.',
      'Simmer: Pour tamarind water and cook for 5 mins to blend flavors.',
      'Fish: Place fish pieces in curry. Cover and simmer 6 mins (sway pan, don\'t stir).',
      'Finish: Stir in light coconut milk, warm through for 2 mins, serve.'
    ],
    calories: 220,
    protein: 24,
    carbs: 6,
    fats: 12,
    servingSize: 300,
    imageUrl: 'https://images.unsplash.com/photo-1621510456681-23a23cfb5f57?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r8',
    name: 'Paneer Power Bowl',
    description: 'Sautéed cumin-spiced paneer cubes served fresh over a baby spinach, cherry tomato, and cucumber salad.',
    type: 'veg',
    category: 'Lunch',
    ingredients: [
      '150g paneer, sliced',
      '50g cucumber slices',
      '50g cherry tomatoes, cut',
      '1 cup fresh baby spinach',
      '1 tsp olive oil',
      '1/2 tsp roasted cumin',
      '1 tbsp lemon juice'
    ],
    instructions: [
      'Grill: Sear paneer slabs in a hot skillet for 2 mins per side.',
      'Season: Dust warm paneer with salt and cumin; chop into bite-sized cubes.',
      'Base: Arrange baby spinach in a deep serving bowl.',
      'Rainbow: Place cucumbers, cherry tomatoes, and onion rings on greens.',
      'Center: Top center with warm golden grilled paneer cubes.',
      'Drizzle: Splash olive oil and lemon dressing over bowl, serve.'
    ],
    calories: 320,
    protein: 22,
    carbs: 12,
    fats: 22,
    servingSize: 300,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r9',
    name: 'Soya Chunk Stir-Fry',
    description: 'A lightning-fast, high-protein vegan stir-fry featuring juicy soy chunks tossed with onions and crispy capsicum.',
    type: 'veg',
    category: 'Dinner',
    ingredients: [
      '50g dry soya chunks',
      '1 onions, cubed',
      '1 green bell pepper, cubed',
      '1 tsp ginger-garlic paste',
      '1 tsp dark soy sauce',
      '1 tsp chili sauce',
      '1 tsp oil'
    ],
    instructions: [
      'Boil: Cook soya chunks in salted boiling water for 6 mins until soft.',
      'Squeeze: Cool under running water, squeeze dry completely with hands.',
      'Marinate: Toss chunks with ginger-garlic paste and soy sauce for 10 mins.',
      'Sauté: Heat oil in wok, toss onions and peppers over high heat for 2 mins.',
      'Sizzler: Add marinated chunks, sauté 3 mins, glaze with chili sauce.',
      'Finish: Scatter chopped spring onions and serve hot.'
    ],
    calories: 300,
    protein: 26,
    carbs: 20,
    fats: 10,
    servingSize: 200,
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r10',
    name: 'Moong Dal Protein Chilla',
    description: 'Nutritious golden savory crepes made from yellow moong lentils, laced with finely chopped ginger, chilies, and onion.',
    type: 'veg',
    category: 'Breakfast',
    ingredients: [
      '120g split yellow moong (soaked)',
      '1 small onion, minced',
      '1 green chili, chopped',
      '1/4 tsp turmeric',
      '2 tbsp fresh coriander',
      '1 tsp oil'
    ],
    instructions: [
      'Blend: Grind drained dal, chili, turmeric, salt, and water into a smooth batter.',
      'Fold: Mix minced onions and fresh cilantro directly into batter.',
      'Crepe: Pour ladle of batter onto preheated hot non-stick tawa.',
      'Circles: Spread batter outward in concentric circles to form thin crepe.',
      'Crisp: Drizzle drops of oil on edges, cook 3 mins till golden brown.',
      'Flip: Sear reverse side for 1 min, fold and serve hot with chutney.'
    ],
    calories: 260,
    protein: 18,
    carbs: 28,
    fats: 6,
    servingSize: 180,
    imageUrl: 'https://images.unsplash.com/photo-1624462966581-bc6d768cbce5?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r11',
    name: 'Greek Yogurt Protein Bowl',
    description: 'Thick unsweetened Greek yogurt topped with blueberries, raw sliced almonds, organic chia seeds, and raw honey.',
    type: 'veg',
    category: 'Breakfast',
    ingredients: [
      '200g plain Greek yogurt',
      '15g raw almonds, chopped',
      '10g chia seeds',
      '1/4 cup fresh blueberries',
      '1 tsp raw honey',
      'Pinch of cinnamon'
    ],
    instructions: [
      'Smooth: Spoon Greek yogurt into bowl, whisk for 30 seconds.',
      'Garnish: Wash and dry berry toppings; layer on left side.',
      'Crunch: Sprinkle almonds and chia seeds in a neat row next to berries.',
      'Honey: Drizzle raw honey in zigzag patterns across surface.',
      'Serve: Dust with ground cinnamon and serve cold.'
    ],
    calories: 220,
    protein: 20,
    carbs: 10,
    fats: 8,
    servingSize: 240,
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r12',
    name: 'Spayed Paneer Scramble',
    description: 'Quick cottage cheese scramble sautéed with fresh onions, vine-ripe tomatoes, green chilies, turmeric, and fresh herbs.',
    type: 'veg',
    category: 'Breakfast',
    ingredients: [
      '150g paneer, crumbled',
      '1 onion, diced',
      '1 tomato, diced',
      '1 green chili, minced',
      '1/2 tsp cumin seeds',
      '1/4 tsp turmeric',
      '1/4 tsp chili powder',
      '1 tsp light butter'
    ],
    instructions: [
      'Butter: Melt butter, crack cumin seeds and saute green chili.',
      'Veggies: Stir in onion; cook 4 mins. Toss tomatoes, cook 2 mins.',
      'Spices: Add turmeric, chili powder, and salt; stir over low heat.',
      'Paneer: Crumble paneer into skillet; fold well into spicy base.',
      'Sauté: Cook on medium-low for 2 mins (don\'t overcook). Garnish with coriander.'
    ],
    calories: 310,
    protein: 21,
    carbs: 8,
    fats: 24,
    servingSize: 250,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r13',
    name: 'Grilled Protein Chicken Bowl',
    description: 'Juicy herb-rubbed seared chicken breast slices laid elegantly over fluffy steam-cooked white quinoa.',
    type: 'non-veg',
    category: 'Lunch',
    ingredients: [
      '150g chicken breast',
      '1 tsp olive oil',
      '2 garlic cloves, grated',
      '1/2 cup cooked quinoa',
      '1/2 tsp Italian herbs',
      '1/4 tsp paprika',
      'Lemon slice'
    ],
    instructions: [
      'Flatten: Pound chicken horizontally for uniform heat distribution.',
      'Rub: Massage olive oil, garlic, paprika, herbs, salt, and pepper on chicken.',
      'Sear: Grill chicken for 5 mins per side till golden brown and cooked.',
      'Rest: Keep covered in foil for 5 mins to retain natural juices.',
      'Assemble: Dice diagonally, arrange over warm quinoa, spritz with lemon.'
    ],
    calories: 350,
    protein: 35,
    carbs: 10,
    fats: 18,
    servingSize: 160,
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r14',
    name: 'Egg White Omelette',
    description: 'A light, double-volume high-protein breakfast omelette filled with organic baby spinach and diced bell peppers.',
    type: 'non-veg',
    category: 'Breakfast',
    ingredients: [
      '5 large egg whites',
      '1/4 cup red onions, minced',
      '1/4 cup bell peppers, chopped',
      '1/4 cup baby spinach, chopped',
      '1 tsp avocado oil',
      'Salt & black pepper to taste'
    ],
    instructions: [
      'Whisk: Beat egg whites in glass bowl 1 min till highly frothy.',
      'Veggies: Sauté onion and bell peppers in oil (3 mins). Add spinach.',
      'Pour: Reduce heat to medium-low. Pour aerated whites over pan veggies.',
      'Set: Cook undisturbed for 3 mins. Fold in half once bottom sets, plate.'
    ],
    calories: 200,
    protein: 22,
    carbs: 5,
    fats: 6,
    servingSize: 200,
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r15',
    name: 'Ginger Garlic Chicken Stir Fry',
    description: 'Thin chicken slices stir-fried quickly in a blazing wok with multi-colored bell peppers, red carrots, and dark soy.',
    type: 'non-veg',
    category: 'Dinner',
    ingredients: [
      '150g chicken breast, strips',
      '1/2 cup bell peppers, sliced',
      '1/2 cup broccoli & carrots',
      '1 tsp sesame oil',
      '1 tbsp low-sodium soy sauce',
      '1 garlic clove, minced'
    ],
    instructions: [
      'Marinate: Toss chicken strips with minced garlic and soy sauce for 10 mins.',
      'Sear: Sauté chicken in hot sesame oil in wok (4 mins). Set aside.',
      'Veggies: Toss broccoli, carrots, and peppers. Cook 2 mins on high.',
      'Direct Stir: Add chicken back, stir all with soy sauce for 1 min, serve.'
    ],
    calories: 330,
    protein: 32,
    carbs: 12,
    fats: 15,
    servingSize: 260,
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-685f548e7a1a?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r16',
    name: 'Hard-Boiled Egg Salad',
    description: 'Comforting, protein-packed light snack combining chopped hard-boiled eggs, cucumber slices, cherry tomatoes, and French Dijon mustard.',
    type: 'non-veg',
    category: 'Snack',
    ingredients: [
      '3 organic eggs',
      '50g cucumber, diced',
      '50g cherry tomatoes, cut',
      '1 tbsp fresh dill',
      '1/2 tsp Dijon mustard',
      '1/2 tsp lemon juice',
      'Salt & black pepper'
    ],
    instructions: [
      'Boil: Place eggs in cold water. Bring to boil, cover, turn off heat, let sit 9 mins.',
      'Shock: Put eggs in ice water for 5 mins, peel, and dice into cubes.',
      'Dressing: Whisk Dijon mustard, fresh lemon juice, salt, and pepper in a bowl.',
      'Mix: Gently fold in chopped eggs, cucumber, tomatoes, onions, and dill.'
    ],
    calories: 280,
    protein: 20,
    carbs: 6,
    fats: 20,
    servingSize: 250,
    imageUrl: 'https://images.unsplash.com/photo-1522747776116-64ee0d049c6f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r17',
    name: 'Tuna Protein Salad',
    description: 'Classic no-cook lunches featuring flaky premium canned tuna tossed with chopped red onion, parsley, and pure olive oil.',
    type: 'non-veg',
    category: 'Lunch',
    ingredients: [
      '120g canned tuna, drained',
      '30g red onion, minced',
      '1 garlic clove, minced',
      '1 tbsp lemon juice',
      '1 tsp extra virgin olive oil',
      '1 tbsp fresh parsley'
    ],
    instructions: [
      'Drain: Empty canned tuna into a fine sieve, press with a spoon to dry.',
      'Flake: Shred tuna flesh in a salad bowl using a dinner fork.',
      'Aromatics: Mix finely chopped red onion, garlic, and fresh parsley leaves.',
      'Dress: Drizzle olive oil, fresh lemon juice, salt, and pepper; toss well.'
    ],
    calories: 300,
    protein: 30,
    carbs: 5,
    fats: 15,
    servingSize: 160,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r18',
    name: 'Sesame Peanut Tofu Stir-Fry',
    description: 'Crispy firm organic tofu cubes stir-fried with broccoli and peppers, glazed with a velvety soy-peanut ginger sauce.',
    type: 'veg',
    category: 'Dinner',
    ingredients: [
      '150g firm tofu, cubed',
      '1 cup broccoli florets',
      '1/2 cup bell pepper strips',
      '1 tbsp peanut butter',
      '1 tbsp low-sodium tamari',
      '1 tsp sesame oil',
      '1 tsp minced ginger'
    ],
    instructions: [
      'Press: Weight tofu down for 10 mins to remove water. Cube neatly.',
      'Sear: Fry tofu cubes in sesame oil for 4 mins per side until golden.',
      'Glaze: Whisk peanut butter, soy sauce, ginger, garlic, and warm water till smooth.',
      'Sauté: Add broccoli and peppers to pan; cook 3 mins with splash of water.',
      'Combine: Reintroduce tofu, drizzle peanut glaze, toss 1 min over high heat.'
    ],
    calories: 280,
    protein: 16,
    carbs: 14,
    fats: 16,
    servingSize: 300,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r19',
    name: 'Avocado & Zesty Shrimp Salad',
    description: 'Heart-healthy, modern salad pairing lime-marinated seared shrimp with diced avocado, cherry tomatoes, and baby spinach.',
    type: 'non-veg',
    category: 'Lunch',
    ingredients: [
      '150g wild shrimp, peeled',
      '1/2 Haas avocado, cubed',
      '1 cup baby spinach',
      '1/2 cup cherry tomatoes',
      '1 tbsp lime juice',
      '1 tsp olive oil',
      'Paprika & chili flakes'
    ],
    instructions: [
      'Marinate: Toss shrimp with olive oil, paprika, chili flakes, and half lime juice.',
      'Sear: Dry-fry shrimp in griddle 2 mins per side till pink and firm.',
      'Base: Mix dry spinach, tomatoes, and diced cucumber in bowl.',
      'Avocado: Place avocado over greens, splash remainder lime juice immediately.',
      'Plate: Top with hot grilled shrimp, sprinkle sea salt, and serve instantly.'
    ],
    calories: 290,
    protein: 26,
    carbs: 8,
    fats: 16,
    servingSize: 280,
    imageUrl: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r20',
    name: 'Lemon Herb Baked Salmon',
    description: 'Atlantic salmon fillet baked with lemon juice, dill, and served with a side of asparagus spears and sweet potato.',
    type: 'non-veg',
    category: 'Dinner',
    ingredients: [
      '150g salmon fillet, skin-on',
      '8 fresh asparagus spears',
      '100g sweet potato slices',
      '1 tsp olive oil',
      '1 tbsp lemon juice',
      'Fresh dill, salt & pepper'
    ],
    instructions: [
      'Potato: Spray sweet potato slices with half oil, bake at 400°F (200°C) for 10 mins first.',
      'Setup: Place salmon skin-down and asparagus alongside sweet potatoes.',
      'Dress: Coat both with remaining oil, lemon juice, salt, pepper, and dill leaves.',
      'Bake: Cook 12-15 mins more in oven till salmon flakes easily with fork, serve.'
    ],
    calories: 340,
    protein: 28,
    carbs: 22,
    fats: 14,
    servingSize: 320,
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r21',
    name: 'Mediterranean Quinoa Salad Bowl',
    description: 'Prebiotic-rich bowl of fluffy white quinoa, spiced roasted chickpeas, cucumber, tomatoes, and creamy tahini drizzle.',
    type: 'veg',
    category: 'Lunch',
    ingredients: [
      '1/2 cup cooked white quinoa',
      '1/2 cup cooked chickpeas',
      '1/2 cup cucumber, diced',
      '1/2 cup cherry tomatoes',
      '6 kalamata olives',
      '1 tbsp tahini paste',
      '1 tsp cumin, olive oil'
    ],
    instructions: [
      'Chickpeas: Toss chickpeas with cumin and olive oil, sauté 5 mins till crisp.',
      'Tahini: Whisk tahini paste, lemon juice, and water to make a creamy dressing.',
      'Bowl: Spoon quinoa, cucumbers, tomatoes, and olives into sections of a bowl.',
      'Topping: Add spiced hot chickpeas next to quinoa, drizzle tahini and serve.'
    ],
    calories: 310,
    protein: 11,
    carbs: 42,
    fats: 11,
    servingSize: 350,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r22',
    name: 'Chia & Berry Protein Pudding',
    description: 'Thick, high-fiber chia seed gel soaked in vanilla almond milk, layered with antioxidant wild berries and almonds.',
    type: 'veg',
    category: 'Breakfast',
    ingredients: [
      '3 tbsp black chia seeds',
      '1 cup almond milk',
      '15g plant-protein powder',
      '1/4 cup raspberries & blackberries',
      '1 tsp honey, sliced almonds'
    ],
    instructions: [
      'Whisk: Shake almond milk and protein powder in a jar until fully dissolved.',
      'Set: Stir in chia seeds and honey. Rest 5 mins, stir again to prevent clumps.',
      'Chill: Refrigerate covered for 4+ hours or overnight to form thick pudding.',
      'Layer: Place pudding in glass, alternating with fresh raspberries and berries.'
    ],
    calories: 240,
    protein: 15,
    carbs: 18,
    fats: 10,
    servingSize: 220,
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r23',
    name: 'Spiced Egg White Shakshuka',
    description: 'Mediterranean poaching favorites, containing fresh egg whites simmered inside robust rustic bell-pepper and spiced tomato ragout.',
    type: 'non-veg',
    category: 'Breakfast',
    ingredients: [
      '1 cup crushed tomatoes',
      '1/2 cup red bell pepper, diced',
      '4 egg whites, 1 whole egg',
      '1/2 onion, chopped',
      '1 garlic clove, minced',
      '1/2 tsp paprika & cumin, 1 tsp oil'
    ],
    instructions: [
      'Base: Sauté onion and red peppers in oil 4 mins. Stir in garlic and spices (1 min).',
      'Sauce: Pour tomato pulp, salt. Simmer 6 mins until thick, reduced gravy.',
      'Poach: Make small wells in sauce; pour egg whites and the central whole egg.',
      'Steam: Cover pot with lid. Cook on medium-low for 5 mins until whites are set.'
    ],
    calories: 210,
    protein: 18,
    carbs: 12,
    fats: 8,
    servingSize: 280,
    imageUrl: 'https://images.unsplash.com/photo-1590412200988-a436bb7050a4?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r24',
    name: 'Dry Fruits Apple Cinnamon Oats',
    description: 'Soluble fiber oatmeal cooked with sweet Honeycrisp apple dice, flax seeds, and raw pepitas sprinkled with cinnamon.',
    type: 'veg',
    category: 'Breakfast',
    ingredients: [
      '1/2 cup rolled oats',
      '1 cup water',
      '1/2 organic red apple, chopped',
      '1 tsp flax seeds, grounded',
      '1 tsp pumpkin seeds, toasted',
      '1/4 tsp cinnamon, 1 tsp maple syrup'
    ],
    instructions: [
      'Boil: Combine oats, water, and cinnamon in saucepan; simmer over medium heat.',
      'Apple: Stir in apple cubes immediately so they cook tender with the oats.',
      'Seeds: Chop off heat, stir in ground flax flour and syrup just before ready.',
      'Serve: Pour into hot bowl, decorate with toasted crunchy pumpkin seeds.'
    ],
    calories: 190,
    protein: 6,
    carbs: 32,
    fats: 4,
    servingSize: 200,
    imageUrl: 'https://images.unsplash.com/photo-1517881917431-13488df373ec?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r25',
    name: 'Lean Grilled Turkey Avocado Wrap',
    description: 'Perfect travel-friendly lunch wrap featuring high-protein lean turkey slices, spinach greens, and fresh avocado.',
    type: 'non-veg',
    category: 'Lunch',
    ingredients: [
      '1 whole-wheat tortilla',
      '100g sliced roast turkey',
      '1/4 ripe avocado, sliced',
      '1/2 cup Romaine lettuce',
      '3 cucumber rounds, honey mustard'
    ],
    instructions: [
      'Warm: Heat whole-wheat wrap in dry skillet for 15 seconds per side to make pliable.',
      'Stack: Arrange turkey slices, cucumber slices, and avocado wedges in center third.',
      'Lettuce: Top with crunchy shredded Romaine and drizzle honey mustard spoon.',
      'Fold: Tuck lower flaps inwards, roll tightly in cylinder. Cut diagonally, serve.'
    ],
    calories: 290,
    protein: 24,
    carbs: 25,
    fats: 9,
    servingSize: 180,
    imageUrl: 'https://images.unsplash.com/photo-1626700051175-6518c4793f4f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r26',
    name: 'Avocado Toast with Poached Egg',
    description: 'Multi-grain toasted bread smashed with fresh Haas avocado and capped with a liquid-yolk poached farm egg.',
    type: 'non-veg',
    category: 'Breakfast',
    ingredients: [
      '1 slice multi-grain bread',
      '1/2 Haas avocado, ripe',
      '1 organic egg',
      '1 tsp lemon juice',
      'Chili flakes & sea salt'
    ],
    instructions: [
      'Toast: Crisp multi-grain bread in toaster until crunchy and dark.',
      'Smashed: Mash avocado flesh, lemon juice, pinch salt, and chili in small bowl.',
      'Poach: Swirl simmering vinegar-water; cook slide-in egg for 3 mins.',
      'Assemble: Spread mashed avocado on toast; top with soft-poached egg, enjoy.'
    ],
    calories: 260,
    protein: 12,
    carbs: 16,
    fats: 15,
    servingSize: 155,
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r27',
    name: 'Walnut & Pomegranate Green Salad',
    description: 'Healthy antioxidant dry fruit and vegetable salad using crisp spinach, walnuts, pomegranate, and light dressing.',
    type: 'veg',
    category: 'Lunch',
    ingredients: [
      '2 cups organic mixed baby greens',
      '30g walnut halves, toasted',
      '1/4 cup fresh pomegranate pearls',
      '1 tsp balsamic vinegar',
      '1 tsp extra virgin olive oil'
    ],
    instructions: [
      'Greens: Pour baby spinach and arugula leaves into salad bowl.',
      'Nuts: Toast walnut halves on dry pan for 2 mins till nutty, cool.',
      'Combine: Spread pomegranate seeds and toasted walnuts across garden greens.',
      'Drizzle: Shake olive oil and balsamic vinegar dressing; coat leaves lightly.'
    ],
    calories: 180,
    protein: 4,
    carbs: 10,
    fats: 14,
    servingSize: 180,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r28',
    name: 'Berry Banana Protein Smoothie',
    description: 'An immersive and antioxidant-boosted raw functional shake with berries, banana, Greek yogurt, and protein.',
    type: 'veg',
    category: 'Breakfast',
    ingredients: [
      '1/2 frozen organic banana',
      '1/2 cup frozen mixed strawberries & blueberries',
      '1/2 cup Greek yogurt',
      '1/2 cup skimmed/almond milk',
      '15g vanilla whey or soy protein'
    ],
    instructions: [
      'Liquid: Pour almond milk and cold Greek yogurt base into high-speed blender container.',
      'Frozen: Layer frozen banana logs and mixed berries on top of milk.',
      'Power: Scoop clean vanilla protein powder and a pinch of flax seeds.',
      'Blend: Blitz on max speed for 45 seconds till thick and frosty, serve.'
    ],
    calories: 220,
    protein: 20,
    carbs: 26,
    fats: 3,
    servingSize: 300,
    imageUrl: 'https://images.unsplash.com/photo-1553530593-7e5b2695c52c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r29',
    name: 'Garlic Butter Mushroom & Spinach',
    description: 'Warm, fiber-packed vegetable side sautéing earthy button mushrooms with baby spinach in aromatic garlic ghee.',
    type: 'veg',
    category: 'Dinner',
    ingredients: [
      '150g white button mushrooms, sliced',
      '2 cups organic baby spinach, washed',
      '1 tsp real cow ghee or butter',
      '2 garlic cloves, finely minced',
      'Sea salt & black pepper to taste'
    ],
    instructions: [
      'Ghee: Melt butter or ghee in skillet over medium-high heat.',
      'Sauté Mushrooms: Sauté garlic and mushroom slices for 5 mins till brownish.',
      'Fold Greens: Toss fresh baby spinach in pan; stir till limp and bright green (1 min).',
      'Season: Add freshly ground black peppercorn, salt, and plate hot.'
    ],
    calories: 130,
    protein: 5,
    carbs: 7,
    fats: 10,
    servingSize: 200,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r30',
    name: 'Oven-Spiced Roasted Chickpeas',
    description: 'Crunchy snack substitute consisting of dry roasted garbanzo beans coated in paprika, cumin, and sea salt.',
    type: 'veg',
    category: 'Snack',
    ingredients: [
      '1 cup cooked chickpeas, well-dried',
      '1 tsp olive oil',
      '1/2 tsp smoked paprika powder',
      '1/2 tsp ground cumin powder',
      '1/4 tsp sea salt'
    ],
    instructions: [
      'Dry: Towel-dry boiled chickpeas thoroughly (crucial for maximum crunch).',
      'Shake: Toss chickpeas with olive oil, paprika, cumin, and salt in bowl.',
      'Roast: Lay on baking tray; roast at 400°F (200°C) for 25 mins.',
      'Cool: Let cool on flat sheet 5 mins to firm up, serve as crunchy snack.'
    ],
    calories: 140,
    protein: 6,
    carbs: 22,
    fats: 3,
    servingSize: 80,
    imageUrl: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r31',
    name: 'Steamed Ginger Garlic Fish',
    description: 'Clean high-protein seafood dinner of steam-cooked sea bass fillet topped with ginger slivers and low-sodium tamari.',
    type: 'non-veg',
    category: 'Dinner',
    ingredients: [
      '150g sea bass or cod fillet',
      '1 tbsp ginger, julienned',
      '2 garlic cloves, crushed',
      '1 tbsp low-sodium soy sauce',
      '1 tsp sesame oil',
      '2 scallion stalks, shredded'
    ],
    instructions: [
      'Fillet: Lay fresh white fish skin-side down on heat-proof plate.',
      'Ginger: Scatter scallion bottoms, ginger juliennes, and garlic on fish.',
      'Steam: Steam in covered wok over boiling water for 8 mins till opaque.',
      'Glaze: Remove, toss green scallion ribbons. Drizzle warm soy + sesame oil.'
    ],
    calories: 180,
    protein: 26,
    carbs: 4,
    fats: 7,
    servingSize: 210,
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r32',
    name: 'Mango Greek Yogurt Parfait',
    description: 'Luscious, rich prebiotic dessert stacking honeyed Greek yogurt, fresh Alphonso mango cubes, and oats granola.',
    type: 'veg',
    category: 'Breakfast',
    ingredients: [
      '150g non-fat Greek yogurt',
      '1/2 cup fresh mango, cubed',
      '2 tbsp organic granola',
      '1 tsp honey or chia seeds'
    ],
    instructions: [
      'Layer 1: Spoon 75g Greek yogurt at the bottom of a dessert cup.',
      'Fruit: Place half of sweet diced mangoes above yogurt base.',
      'Granola: Sprinkle 1 tbsp crunchy oats granola for structure.',
      'Repeat: Top with remaining yogurt, mango cubes, granola, and honey glaze.'
    ],
    calories: 190,
    protein: 14,
    carbs: 28,
    fats: 3,
    servingSize: 220,
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r33',
    name: 'Lean Beef & Broccoli Sauté',
    description: 'Slices of lean flank beef and fresh broccoli florets stir-fried in a savory ginger-soy garlic glaze.',
    type: 'non-veg',
    category: 'Dinner',
    ingredients: [
      '150g lean beef sirloin, thinly sliced',
      '1.5 cups broccoli florets',
      '2 garlic cloves, sliced',
      '1 tbsp soy sauce, low sodium',
      '1 tsp sesame oil, 1 tsp cornstarch'
    ],
    instructions: [
      'Velveting: Toss beef slices in tamari and cornstarch; rest 10 mins.',
      'Sauté: Sear beef in hot wok with sesame oil for 3 mins. Set aside.',
      'Veggies: Sauté garlic slices and broccoli for 3 mins with 2 tbsp water.',
      'Glaze: Re-add beef, pour wok sauce, heat 1 min till shiny glaze covers all.'
    ],
    calories: 320,
    protein: 30,
    carbs: 10,
    fats: 14,
    servingSize: 300,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r34',
    name: 'Keto Cauliflower Fried Rice',
    description: 'Low-carb keto-friendly alternative featuring grated cauliflower stir-fried with farm eggs, peas, and sesame.',
    type: 'veg',
    category: 'Dinner',
    ingredients: [
      '2 cups cauliflower heads (riced)',
      '1 organic egg, beaten',
      '1/4 cup green peas & carrots',
      '1 tsp toasted sesame oil',
      '1 tbsp low-sodium soy sauce'
    ],
    instructions: [
      'Rice: Grate or pulse cauliflower florets in processor to make grain rice.',
      'Dry Cook: Stir-fry riced cauliflower in dry pan 3 mins to dry out water.',
      'Scramble: Push cauliflower aside; scramble egg in center of pan.',
      'Stir: Add peas, carrots, sesame oil, and soy sauce. Toss all on high for 2 mins.'
    ],
    calories: 160,
    protein: 8,
    carbs: 11,
    fats: 9,
    servingSize: 250,
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r35',
    name: 'Roasted Veggie & Beet Salad',
    description: 'Antioxidant-filled salad combining roasted sweet red beet segments and organic asparagus spears.',
    type: 'veg',
    category: 'Lunch',
    ingredients: [
      '1 small beet, scrubbed & diced',
      '8 fresh asparagus spears',
      '1 cup spinach or baby greens',
      '1 tsp extra virgin olive oil',
      '1 tbsp lemon juice, salt'
    ],
    instructions: [
      'Bake: Roast beet cubes in baking tray with olive oil at 400°F for 20 mins.',
      'Asparagus: Add asparagus spears alongside, roast 8 mins till tender-crisp.',
      'Greens: Toss fresh greens at base of serving salad bowl.',
      'Top: Layer warm roasted beets and asparagus spears, drizzle fresh lemon juice.'
    ],
    calories: 130,
    protein: 3,
    carbs: 16,
    fats: 6,
    servingSize: 220,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r36',
    name: 'Sweet Potato Lentil Curry',
    description: 'A comforting, thick vegan red lentil stew loaded with soft sweet potato chunks, turmeric, and cumin.',
    type: 'veg',
    category: 'Dinner',
    ingredients: [
      '1/2 cup sweet potato, cubed',
      '1/2 cup red lentils (washed)',
      '1/2 onion, finely chopped',
      '1/2 tsp turmeric & curry powder',
      '1.5 cups filtered water',
      '1 tsp coconut oil, cilantro'
    ],
    instructions: [
      'Base: Sauté chopped red onions in coconut oil for 3 mins inside pot.',
      'Spices: Stir in turmeric, cumin, and curry powder; cook 1 min.',
      'Simmer: Add sweet potatoes, lentils, and water. Bring to rolling boil.',
      'Ready: Cover, reduce heat to low, simmer 20 mins till lentils cook thick.'
    ],
    calories: 290,
    protein: 11,
    carbs: 48,
    fats: 6,
    servingSize: 320,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r37',
    name: 'Healthy Carrot-Ginger Soup',
    description: 'Vibrant, warm prebiotic pureed soup showcasing freshly simmered orange carrots and hand-grated ginger root.',
    type: 'veg',
    category: 'Dinner',
    ingredients: [
      '1.5 cups yellow carrots, chopped',
      '1 tsp ginger root, grated',
      '1/2 sweet onion, diced',
      '1.5 cups vegetable broth',
      '1 tsp light butter or olive oil'
    ],
    instructions: [
      'Sauté: Sauté onions and grated ginger in butter for 3 mins in saucepan.',
      'Boil: Add chopped carrots and vegetable broth. Cook till carrots are tender.',
      'Puree: Let cool slightly, blend in high-speed mixer till smooth velvet.',
      'Serve: Reheat inside soup bowl; crack black pepper on top.'
    ],
    calories: 110,
    protein: 3,
    carbs: 18,
    fats: 4,
    servingSize: 280,
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r38',
    name: 'Tangy Cucumber-Mint Salad',
    description: 'Hydrating, low-calorie summer snack mixing organic sliced Persian cucumbers, fresh mint leaves, and lime dressing.',
    type: 'veg',
    category: 'Snack',
    ingredients: [
      '2 regional Persian cucumbers, sliced',
      '2 tbsp fresh mint leaves, slivered',
      '1 tsp lime juice',
      '1/4 tsp olive oil, salt'
    ],
    instructions: [
      'Slices: Wash cucumbers, slice into razor thin translucent rounds.',
      'Herbs: Rinse fresh mint sprigs, dry-pat, and slice leaves finely.',
      'Toss: Place ingredients together inside wide ceramic salad plate.',
      'Dress: Spray light olive oil, lime juice, sea salt, toss actively.'
    ],
    calories: 70,
    protein: 2,
    carbs: 8,
    fats: 3,
    servingSize: 150,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r39',
    name: 'Sautéed Bell Pepper & Paneer Wrap',
    description: 'Classic lunch wrap enclosing warm stir-fried paneer cubes, red peppers, and hummus in a whole-wheat skin.',
    type: 'veg',
    category: 'Lunch',
    ingredients: [
      '1 whole-wheat tortilla wrap',
      '80g fresh paneer, cubed',
      '1/2 bell pepper, sliced thin',
      '1 tbsp classic hummus spread',
      '1/4 tsp cumin & olive oil'
    ],
    instructions: [
      'Sauté: Flash-cook paneer and sliced bell peppers with olive oil (4 mins).',
      'Hummus: Heat wrap, spread 1 spoonful of hummus across middle line.',
      'Layer: Lay sautéed paneer cubes and peppers over hummus base.',
      'Wrap: Fold sides inward and roll up tightly. Toast briefly in hot pan.'
    ],
    calories: 320,
    protein: 18,
    carbs: 28,
    fats: 14,
    servingSize: 190,
    imageUrl: 'https://images.unsplash.com/photo-1626700051175-6518c4793f4f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'r40',
    name: 'Apple & Walnut Cinnamon Oatmeal',
    description: 'Fresh soluble-fiber breakfast oats cooked with apple chunks, flax seeds, cinnamon, and toasted walnuts.',
    type: 'veg',
    category: 'Breakfast',
    ingredients: [
      '1/2 cup organic rolled oats',
      '1 cup water or direct skim milk',
      '1/2 organic red apple, chopped',
      '15g sweet walnut halves, crushed',
      '1/4 tsp Ceylon cinnamon'
    ],
    instructions: [
      'Simmer: Cook oats and cinnamon in milk/water over medium-low heat.',
      'Fruit: Heat chopped apples in pot alongside oats, cooking till soft.',
      'Nuts: Toast crushed walnuts on dry skillet, set aside.',
      'Bowl: Spoon creamy oatmeal, scatter toasted walnuts and apple skin.'
    ],
    calories: 240,
    protein: 6,
    carbs: 38,
    fats: 8,
    servingSize: 220,
    imageUrl: 'https://images.unsplash.com/photo-1517881917431-13488df373ec?q=80&w=800&auto=format&fit=crop'
  }
];
