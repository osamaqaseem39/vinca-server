import dotenv from 'dotenv';
import User from '../models/User.model';
import Category from '../models/Category.model';
import Product from '../models/Product.model';
import connectDB from '../config/database';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@vinca.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin'
    });

    // Create test user
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user'
    });

    // Create categories
    const eyeglasses = await Category.create({
      name: 'Eyeglasses',
      slug: 'eyeglasses',
      description: 'Prescription eyeglasses for everyday wear'
    });

    const sunglasses = await Category.create({
      name: 'Sunglasses',
      slug: 'sunglasses',
      description: 'Stylish sunglasses with UV protection'
    });

    await Category.create({
      name: 'Reading Glasses',
      slug: 'reading-glasses',
      description: 'Reading glasses for close-up work'
    });

    // Create sample products
    const products = [
      {
        name: 'Classic Aviator',
        description: 'Timeless aviator style frames with metal construction and UV protection.',
        longDescription: 'Our Classic Aviator frames combine timeless style with modern technology. Crafted from premium metal alloys, these frames offer exceptional durability while maintaining a lightweight feel. The polarized lenses provide 100% UV protection and reduce glare, making them perfect for both sunny days and driving. The adjustable nose pads ensure a comfortable fit for all face shapes, while the spring hinges add flexibility and longevity to the frames.',
        brand: 'Vinca',
        category: sunglasses._id,
        price: 149.99,
        discountPrice: 129.99,
        images: ['https://example.com/aviator1.jpg', 'https://example.com/aviator2.jpg'],
        stockQuantity: 50,
        sku: 'VINCA-AVI-001',
        frameType: 'aviator',
        frameMaterial: 'metal',
        frameColor: { primary: 'Black', finish: 'matte' },
        lensType: 'sunglasses',
        lensMaterial: 'polycarbonate',
        gender: 'unisex',
        size: { eye: 58, bridge: 18, temple: 140 },
        features: ['UV Protection', 'Polarized', 'Lightweight'],
        specifications: {
          weight: '25g',
          lensWidth: '58mm',
          bridgeWidth: '18mm',
          templeLength: '140mm',
          frameWidth: '145mm',
          lensHeight: '45mm',
          warranty: '2 years manufacturer warranty'
        },
        careInstructions: 'Clean with microfiber cloth only. Avoid using paper towels or clothing. Store in provided case when not in use. Keep away from extreme temperatures.',
        whatsIncluded: ['Hard protective case', 'Microfiber cleaning cloth', 'Prescription lens installation (if applicable)'],
        lensOptions: {
          availableTypes: ['single-vision', 'bifocal', 'progressive'],
          availableCoatings: ['anti-reflective', 'blue-light-filter', 'UV-protection', 'scratch-resistant'],
          availableTints: ['none', 'light', 'medium', 'dark', 'gradient']
        }
      },
      {
        name: 'Modern Round',
        description: 'Contemporary round frames with acetate construction and anti-reflective lenses.',
        longDescription: 'The Modern Round frames feature a sleek, contemporary design that pays homage to classic eyewear styles. Made from high-quality acetate, these frames are both durable and comfortable. The round shape flatters most face types and provides excellent peripheral vision. Available with various lens options including blue light filtering for digital eye strain relief.',
        brand: 'Vinca',
        category: eyeglasses._id,
        price: 179.99,
        images: ['https://example.com/round1.jpg'],
        stockQuantity: 30,
        sku: 'VINCA-RND-001',
        frameType: 'round',
        frameMaterial: 'acetate',
        frameColor: { primary: 'Tortoise', secondary: 'Brown', finish: 'glossy' },
        lensType: 'single-vision',
        gender: 'unisex',
        size: { eye: 52, bridge: 20, temple: 145 },
        features: ['Anti-reflective coating', 'Blue light filter', 'Acetate construction'],
        specifications: {
          weight: '22g',
          lensWidth: '52mm',
          bridgeWidth: '20mm',
          templeLength: '145mm',
          frameWidth: '140mm',
          lensHeight: '48mm',
          warranty: '1 year manufacturer warranty'
        },
        careInstructions: 'Clean with lens cleaning solution and microfiber cloth. Store in case when not in use. Avoid placing lenses down on hard surfaces.',
        whatsIncluded: ['Soft case', 'Cleaning cloth', 'Prescription lens installation'],
        lensOptions: {
          availableTypes: ['single-vision', 'bifocal', 'progressive', 'reading'],
          availableCoatings: ['anti-reflective', 'blue-light-filter', 'UV-protection', 'scratch-resistant', 'anti-fog'],
          availableTints: ['none'],
          prescriptionRange: {
            sphere: { min: -10.0, max: 6.0 },
            cylinder: { min: -4.0, max: 4.0 }
          }
        }
      },
      {
        name: 'Browline Classic',
        description: 'Vintage-inspired browline frames with modern comfort and progressive lens compatibility.',
        longDescription: 'The Browline Classic combines vintage aesthetics with contemporary engineering. These frames feature a distinctive browline design that adds sophistication to any look. The upper portion uses premium acetate while the lower half is rimless, creating a unique visual appeal. Perfect for progressive lenses, these frames offer excellent clarity and comfort for all-day wear. The Havana colorway provides a warm, classic appearance that complements both formal and casual attire.',
        brand: 'Vinca',
        category: eyeglasses._id,
        price: 199.99,
        images: ['https://example.com/browline1.jpg'],
        stockQuantity: 25,
        sku: 'VINCA-BRW-001',
        frameType: 'browline',
        frameMaterial: 'acetate',
        frameColor: { primary: 'Havana', secondary: 'Brown', finish: 'satin' },
        lensType: 'progressive',
        gender: 'men',
        size: { eye: 54, bridge: 19, temple: 142 },
        features: ['Progressive lens compatible', 'Durable', 'Vintage design', 'Lightweight'],
        specifications: {
          weight: '20g',
          lensWidth: '54mm',
          bridgeWidth: '19mm',
          templeLength: '142mm',
          frameWidth: '148mm',
          lensHeight: '42mm',
          warranty: '2 years manufacturer warranty'
        },
        careInstructions: 'Handle with care due to rimless lower portion. Clean with microfiber cloth. Store in hard case. Avoid dropping or placing heavy objects on frames.',
        whatsIncluded: ['Hard case', 'Microfiber cloth', 'Progressive lens installation', 'Adjustment kit'],
        lensOptions: {
          availableTypes: ['single-vision', 'bifocal', 'progressive'],
          availableCoatings: ['anti-reflective', 'blue-light-filter', 'UV-protection', 'scratch-resistant'],
          availableTints: ['none']
        }
      }
    ];

    await Product.insertMany(products);

    console.log('✅ Database seeded successfully!');
    console.log(`Admin: ${admin.email} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log(`User: ${user.email} / password123`);
    console.log(`Created ${products.length} products`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

