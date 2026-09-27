import { PrismaClient, Role, DonationStatus, CommissionType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Clean existing data
  await prisma.donationStatusHistory.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.conversion.deleteMany();
  await prisma.referral.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.commission.deleteMany();
  await prisma.nGO.deleteMany();
  await prisma.seller.deleteMany();
  await prisma.address.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await bcrypt.hash('password123', 10);

  // 2. Create Core Users & Roles
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@impactapp.org',
      passwordHash: defaultPassword,
      name: 'System Administrator',
      phone: '+91 98765 00000',
      role: Role.ADMIN,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  // Normal Users
  const user1 = await prisma.user.create({
    data: {
      email: 'user@example.com',
      passwordHash: defaultPassword,
      name: 'Aanya Sharma',
      phone: '+91 98123 45678',
      role: Role.USER,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      addresses: {
        create: [
          {
            fullName: 'Aanya Sharma',
            phone: '+91 98123 45678',
            streetAddress: '42 Lotus Boulevard, Sector 128',
            city: 'Noida',
            state: 'Uttar Pradesh',
            pincode: '201304',
            isDefault: true,
          },
          {
            fullName: 'Aanya Sharma (Office)',
            phone: '+91 98123 45678',
            streetAddress: 'Cyber City, Tower B, 5th Floor',
            city: 'Gurugram',
            state: 'Haryana',
            pincode: '122002',
            isDefault: false,
          }
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'rohit.v@example.com',
      passwordHash: defaultPassword,
      name: 'Rohit Verma',
      phone: '+91 97654 32109',
      role: Role.USER,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      addresses: {
        create: [
          {
            fullName: 'Rohit Verma',
            phone: '+91 97654 32109',
            streetAddress: '78 MG Road, Indiranagar',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560038',
            isDefault: true,
          }
        ]
      }
    },
  });

  // 3. Create Sellers
  const sellerUser1 = await prisma.user.create({
    data: {
      email: 'seller@auraeco.com',
      passwordHash: defaultPassword,
      name: 'Aura Eco Atelier',
      phone: '+91 99887 76655',
      role: Role.SELLER,
    },
  });

  const seller1 = await prisma.seller.create({
    data: {
      userId: sellerUser1.id,
      shopName: 'Aura Eco Atelier',
      logoUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=150',
      description: 'Sustainable, organic cotton & handloom artisan clothing made ethically in India.',
      websiteUrl: 'https://auraecoatelier.demo',
      location: 'Jaipur, Rajasthan',
      isApproved: true,
      isVerified: true,
    },
  });

  const sellerUser2 = await prisma.user.create({
    data: {
      email: 'contact@urbanstitch.co',
      passwordHash: defaultPassword,
      name: 'Urban Stitch Co.',
      phone: '+91 98989 89898',
      role: Role.SELLER,
    },
  });

  const seller2 = await prisma.seller.create({
    data: {
      userId: sellerUser2.id,
      shopName: 'Urban Stitch Co.',
      logoUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=150',
      description: 'Minimalist contemporary streetwear crafted from upcycled denim and low-impact dyes.',
      websiteUrl: 'https://urbanstitch.demo',
      location: 'Mumbai, Maharashtra',
      isApproved: true,
      isVerified: true,
    },
  });

  const sellerUser3 = await prisma.user.create({
    data: {
      email: 'hello@vedicthreads.in',
      passwordHash: defaultPassword,
      name: 'Vedic Threads',
      phone: '+91 91234 56789',
      role: Role.SELLER,
    },
  });

  const seller3 = await prisma.seller.create({
    data: {
      userId: sellerUser3.id,
      shopName: 'Vedic Threads',
      logoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150',
      description: 'Traditional heritage weaves, Chanderi silk kurtas, and handcrafted ethnic wear.',
      websiteUrl: 'https://vedicthreads.demo',
      location: 'Varanasi, Uttar Pradesh',
      isApproved: true,
      isVerified: true,
    },
  });

  const sellerUser4 = await prisma.user.create({
    data: {
      email: 'info@loomandcrafts.com',
      passwordHash: defaultPassword,
      name: 'Loom & Crafts',
      phone: '+91 95432 10987',
      role: Role.SELLER,
    },
  });

  const seller4 = await prisma.seller.create({
    data: {
      userId: sellerUser4.id,
      shopName: 'Loom & Crafts',
      logoUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=150',
      description: 'Zero-waste luxury knitwear and hand-spun linen essentials.',
      websiteUrl: 'https://loomandcrafts.demo',
      location: 'Kochi, Kerala',
      isApproved: true,
      isVerified: true,
    },
  });

  const sellerUser5 = await prisma.user.create({
    data: {
      email: 'hello@kalaweaves.org',
      passwordHash: defaultPassword,
      name: 'Kala Weaves Collective',
      phone: '+91 97777 66666',
      role: Role.SELLER,
    },
  });

  const seller5 = await prisma.seller.create({
    data: {
      userId: sellerUser5.id,
      shopName: 'Kala Weaves Collective',
      logoUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=150',
      description: 'Khadi and organic linen garments supporting village weaving cooperatives.',
      websiteUrl: 'https://kalaweaves.demo',
      location: 'Ahmedabad, Gujarat',
      isApproved: true,
      isVerified: true,
    },
  });

  // 4. Create NGOs
  const ngoUser1 = await prisma.user.create({
    data: {
      email: 'ngo@clothforall.org',
      passwordHash: defaultPassword,
      name: 'Cloth For All Foundation',
      phone: '+91 98222 33344',
      role: Role.NGO,
    },
  });

  const ngo1 = await prisma.nGO.create({
    data: {
      userId: ngoUser1.id,
      orgName: 'Cloth For All Foundation',
      logoUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=150',
      description: 'Nationwide non-profit collecting usable garments to distribute to underprivileged rural communities and disaster survivors.',
      registrationNumber: 'NGO-84920-DL-2018',
      isVerified: true,
      address: '12 Community Centre, Okhla Phase 3',
      city: 'New Delhi',
      state: 'Delhi',
      phone: '+91 98222 33344',
      email: 'donations@clothforall.org',
      donationRequirements: 'Clean, wearable clothes for men, women, and kids. Blankets and winter garments urgently needed.',
      acceptsPickup: true,
    },
  });

  const ngoUser2 = await prisma.user.create({
    data: {
      email: 'contact@rewearhumanity.org',
      passwordHash: defaultPassword,
      name: 'ReWear Humanity',
      phone: '+91 97111 22233',
      role: Role.NGO,
    },
  });

  const ngo2 = await prisma.nGO.create({
    data: {
      userId: ngoUser2.id,
      orgName: 'ReWear Humanity',
      logoUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=150',
      description: 'Empowering women shelters and night shelter residents with dignity kits and quality refurbished clothing.',
      registrationNumber: 'NGO-51209-MH-2020',
      isVerified: true,
      address: 'Plot 45, Bandra Kurla Complex',
      city: 'Mumbai',
      state: 'Maharashtra',
      phone: '+91 97111 22233',
      email: 'help@rewearhumanity.org',
      donationRequirements: 'Women ethnic wear, kids school attire, warm jackets, footwear in good condition.',
      acceptsPickup: true,
    },
  });

  const ngoUser3 = await prisma.user.create({
    data: {
      email: 'info@hopeandthreads.org',
      passwordHash: defaultPassword,
      name: 'Hope & Threads India',
      phone: '+91 96000 11122',
      role: Role.NGO,
    },
  });

  const ngo3 = await prisma.nGO.create({
    data: {
      userId: ngoUser3.id,
      orgName: 'Hope & Threads India',
      logoUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=150',
      description: 'Providing warmth and apparel security to homeless populations across South India.',
      registrationNumber: 'NGO-11984-KA-2019',
      isVerified: true,
      address: '88 Residency Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      phone: '+91 96000 11122',
      email: 'connect@hopeandthreads.org',
      donationRequirements: 'All clothing items accepted. Special requirement for children sweaters and footwear.',
      acceptsPickup: true,
    },
  });

  // 5. Create Categories
  const catWomens = await prisma.category.create({
    data: {
      name: "Women's Clothing",
      slug: 'womens-clothing',
      description: 'Sustainable dresses, ethnic tops, kurtas, and eco-friendly coats.',
      imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600',
    },
  });

  const catMens = await prisma.category.create({
    data: {
      name: "Men's Clothing",
      slug: 'mens-clothing',
      description: 'Organic cotton shirts, relaxed trousers, handloom jackets, and casual wear.',
      imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600',
    },
  });

  const catEthnic = await prisma.category.create({
    data: {
      name: 'Ethnic & Traditional Wear',
      slug: 'ethnic-traditional-wear',
      description: 'Handcrafted sarees, kurta sets, silk dupattas, and heritage outfits.',
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600',
    },
  });

  const catWinter = await prisma.category.create({
    data: {
      name: 'Winter Wear',
      slug: 'winter-wear',
      description: 'Zero-waste wool cardigans, handcrafted shawls, jackets, and thermal wear.',
      imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600',
    },
  });

  const catKids = await prisma.category.create({
    data: {
      name: 'Kids & Baby Wear',
      slug: 'kids-baby-wear',
      description: 'Soft organic cotton apparel for infants, toddlers, and young kids.',
      imageUrl: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600',
    },
  });

  const catFootwear = await prisma.category.create({
    data: {
      name: 'Footwear & Accessories',
      slug: 'footwear-accessories',
      description: 'Handmade vegan leather juttis, tote bags, and sustainable accessories.',
      imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600',
    },
  });

  // 6. Create Products (20 Products)
  const productsData = [
    {
      title: 'Handloom Organic Cotton Oversized Kurta',
      slug: 'handloom-organic-cotton-oversized-kurta',
      description: 'Breathable, hand-spun organic cotton shirt tunic crafted by master weavers in Rajasthan. Features coconut shell buttons and natural plant dyes.',
      price: 2499,
      originalPrice: 3200,
      categoryId: catEthnic.id,
      sellerId: seller1.id,
      sizes: 'S,M,L,XL',
      colors: 'Sage Green,Natural Cream,Terracotta',
      material: '100% Organic Handloom Cotton',
      brand: 'Aura Eco',
      externalProductUrl: 'https://auraecoatelier.demo/product/kurta-01',
      isFeatured: true,
      likesCount: 142,
      images: [
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800'
      ]
    },
    {
      title: 'Upcycled Patchwork Denim Utility Jacket',
      slug: 'upcycled-patchwork-denim-utility-jacket',
      description: 'One-of-a-kind structured denim jacket reconstructed from pre-loved post-consumer denim cuts. Reduces textile landfill waste by 4.2 kg.',
      price: 3899,
      originalPrice: 4500,
      categoryId: catMens.id,
      sellerId: seller2.id,
      sizes: 'M,L,XL',
      colors: 'Vintage Indigo Blue',
      material: 'Recycled Denim',
      brand: 'Urban Stitch',
      externalProductUrl: 'https://urbanstitch.demo/product/denim-jacket-02',
      isFeatured: true,
      likesCount: 98,
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
        'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800'
      ]
    },
    {
      title: 'Chanderi Silk Floral Hand-Block Saree',
      slug: 'chanderi-silk-floral-hand-block-saree',
      description: 'Graceful weightless Chanderi silk saree with intricate zardosi border and hand-carved wooden block print motifs.',
      price: 5499,
      originalPrice: 6999,
      categoryId: catEthnic.id,
      sellerId: seller3.id,
      sizes: 'Free Size',
      colors: 'Mustard Gold,Emerald Green',
      material: 'Chanderi Silk Cotton',
      brand: 'Vedic Threads',
      externalProductUrl: 'https://vedicthreads.demo/product/chanderi-saree',
      isFeatured: true,
      likesCount: 230,
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800'
      ]
    },
    {
      title: 'Zero-Waste Wool Merino Cardigan',
      slug: 'zero-waste-wool-merino-cardigan',
      description: 'Ultra-soft hand-knitted merino wool cardigan with relaxed silhouette and seamless shoulder construction.',
      price: 4299,
      originalPrice: 4999,
      categoryId: catWinter.id,
      sellerId: seller4.id,
      sizes: 'S,M,L',
      colors: 'Oatmeal,Charcoal Grey',
      material: '100% Merino Wool',
      brand: 'Loom & Crafts',
      externalProductUrl: 'https://loomandcrafts.demo/product/cardigan-wool',
      isFeatured: true,
      likesCount: 184,
      images: [
        'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800',
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800'
      ]
    },
    {
      title: 'Pure Linen Breezy Summer Dress',
      slug: 'pure-linen-breezy-summer-dress',
      description: 'Tiered midi dress in natural unbleached flax linen. Includes side pockets and adjustable waist tie.',
      price: 2999,
      originalPrice: 3800,
      categoryId: catWomens.id,
      sellerId: seller1.id,
      sizes: 'XS,S,M,L',
      colors: 'Sand Beige,Dusty Rose,Olive',
      material: '100% French Flax Linen',
      brand: 'Aura Eco',
      externalProductUrl: 'https://auraecoatelier.demo/product/linen-dress',
      isFeatured: false,
      likesCount: 112,
      images: [
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800'
      ]
    },
    {
      title: 'Handcrafted Vegan Leather Mojris',
      slug: 'handcrafted-vegan-leather-mojris',
      description: 'Traditional embroidered footwear with cushioned double-padded sole for maximum daily comfort.',
      price: 1899,
      originalPrice: 2400,
      categoryId: catFootwear.id,
      sellerId: seller3.id,
      sizes: '36,37,38,39,40',
      colors: 'Antique Gold,Maroon',
      material: 'Eco Vegan Leather & Cotton Embroidery',
      brand: 'Vedic Threads',
      externalProductUrl: 'https://vedicthreads.demo/product/mojri-gold',
      isFeatured: false,
      likesCount: 76,
      images: [
        'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800'
      ]
    },
    {
      title: 'Khadi Handspun Unstructured Blazer',
      slug: 'khadi-handspun-unstructured-blazer',
      description: 'Smart casual blazer tailored from handspun Khadi fabric. Lightweight, breathable, and versatile for work or leisure.',
      price: 4799,
      originalPrice: 5600,
      categoryId: catMens.id,
      sellerId: seller5.id,
      sizes: 'M,L,XL,XXL',
      colors: 'Indico Navy,Natural Beige',
      material: '100% Handspun Khadi Cotton',
      brand: 'Kala Weaves',
      externalProductUrl: 'https://kalaweaves.demo/product/khadi-blazer',
      isFeatured: true,
      likesCount: 155,
      images: [
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'
      ]
    },
    {
      title: 'Organic Cotton Kids Dungaree & Tee Set',
      slug: 'organic-cotton-kids-dungaree-tee-set',
      description: 'Hypoallergenic organic cotton overalls for toddlers with soft snap buttons and non-toxic dye finishes.',
      price: 1499,
      originalPrice: 1999,
      categoryId: catKids.id,
      sellerId: seller1.id,
      sizes: '1-2Y,2-3Y,3-4Y,4-5Y',
      colors: 'Mustard Yellow,Sage',
      material: 'Organic Soft Cotton',
      brand: 'Aura Eco',
      externalProductUrl: 'https://auraecoatelier.demo/product/kids-dungaree',
      isFeatured: false,
      likesCount: 65,
      images: [
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'
      ]
    },
    {
      title: 'Handcrafted Pashmina Weave Winter Shawl',
      slug: 'handcrafted-pashmina-weave-winter-shawl',
      description: 'Authentic Kashmir valley hand-loomed shawl featuring traditional Kashmiri needle embroidery.',
      price: 6999,
      originalPrice: 8500,
      categoryId: catWinter.id,
      sellerId: seller3.id,
      sizes: 'Free Size',
      colors: 'Crimson Red,Ivory White',
      material: 'Fine Kashmir Wool Pashmina',
      brand: 'Vedic Threads',
      externalProductUrl: 'https://vedicthreads.demo/product/pashmina-shawl',
      isFeatured: true,
      likesCount: 310,
      images: [
        'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800'
      ]
    },
    {
      title: 'Streetwear Relaxed Oversized Graphic Tee',
      slug: 'streetwear-relaxed-oversized-graphic-tee',
      description: 'Heavyweight 240 GSM organic cotton t-shirt with eco-friendly water-based screen printed artwork.',
      price: 1299,
      originalPrice: 1699,
      categoryId: catMens.id,
      sellerId: seller2.id,
      sizes: 'S,M,L,XL,XXL',
      colors: 'Off White,Washed Black',
      material: '100% Heavyweight Cotton',
      brand: 'Urban Stitch',
      externalProductUrl: 'https://urbanstitch.demo/product/graphic-tee-05',
      isFeatured: false,
      likesCount: 140,
      images: [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'
      ]
    },
    {
      title: 'Artisan Embroidered Silk Anarkali Suit',
      slug: 'artisan-embroidered-silk-anarkali-suit',
      description: 'Floor-length flared silhouette paired with matching churidar and organza embroidered dupatta.',
      price: 7499,
      originalPrice: 9200,
      categoryId: catEthnic.id,
      sellerId: seller3.id,
      sizes: 'S,M,L,XL',
      colors: 'Royal Navy,Pastel Peach',
      material: 'Art Silk & Organza',
      brand: 'Vedic Threads',
      externalProductUrl: 'https://vedicthreads.demo/product/anarkali-set',
      isFeatured: false,
      likesCount: 289,
      images: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800'
      ]
    },
    {
      title: 'Handloom Cotton Wrap Top',
      slug: 'handloom-cotton-wrap-top',
      description: 'V-neck wrap style blouse made with breathable handwoven cotton. Pairs beautifully with high-waist trousers.',
      price: 1799,
      originalPrice: 2200,
      categoryId: catWomens.id,
      sellerId: seller5.id,
      sizes: 'XS,S,M,L',
      colors: 'Indigo Blue,Terracotta Red',
      material: 'Handwoven Cotton',
      brand: 'Kala Weaves',
      externalProductUrl: 'https://kalaweaves.demo/product/wrap-top',
      isFeatured: false,
      likesCount: 94,
      images: [
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800'
      ]
    },
    {
      title: 'Recycled Canvas Tote Bag with Pockets',
      slug: 'recycled-canvas-tote-bag-with-pockets',
      description: 'Sturdy everyday utility tote crafted from upcycled industrial cotton canvas with reinforced stitching.',
      price: 899,
      originalPrice: 1200,
      categoryId: catFootwear.id,
      sellerId: seller2.id,
      sizes: 'One Size',
      colors: 'Natural Canvas,Olive Green',
      material: '100% Recycled Cotton Canvas',
      brand: 'Urban Stitch',
      externalProductUrl: 'https://urbanstitch.demo/product/canvas-tote',
      isFeatured: false,
      likesCount: 167,
      images: [
        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800'
      ]
    },
    {
      title: 'Knit Linen Tailored Trousers',
      slug: 'knit-linen-tailored-trousers',
      description: 'Tapered linen pants featuring an elasticized back waistband and pleated front detailing.',
      price: 3199,
      originalPrice: 3900,
      categoryId: catMens.id,
      sellerId: seller4.id,
      sizes: '30,32,34,36',
      colors: 'Charcoal,Khaki Tan',
      material: 'Pure Linen Blend',
      brand: 'Loom & Crafts',
      externalProductUrl: 'https://loomandcrafts.demo/product/linen-trousers',
      isFeatured: false,
      likesCount: 88,
      images: [
        'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800'
      ]
    },
    {
      title: 'Handwoven Ikat Silk Nehru Jacket',
      slug: 'handwoven-ikat-silk-nehru-jacket',
      description: 'Sophisticated sleeveless bandhgala jacket in double ikat silk pattern with brass metallic buttons.',
      price: 3699,
      originalPrice: 4400,
      categoryId: catEthnic.id,
      sellerId: seller5.id,
      sizes: '38,40,42,44',
      colors: 'Black Gold,Teal Pattern',
      material: 'Pochampally Ikat Silk',
      brand: 'Kala Weaves',
      externalProductUrl: 'https://kalaweaves.demo/product/nehru-jacket',
      isFeatured: false,
      likesCount: 120,
      images: [
        'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800'
      ]
    },
    {
      title: 'Waffle Knit Handspun Sweater',
      slug: 'waffle-knit-handspun-sweater',
      description: 'Cozy textured thermal sweater woven from recycled cotton yarns for chilly evenings.',
      price: 2799,
      originalPrice: 3400,
      categoryId: catWinter.id,
      sellerId: seller4.id,
      sizes: 'S,M,L,XL',
      colors: 'Cream White,Rust Orange',
      material: 'Recycled Waffle Cotton Knit',
      brand: 'Loom & Crafts',
      externalProductUrl: 'https://loomandcrafts.demo/product/waffle-sweater',
      isFeatured: false,
      likesCount: 104,
      images: [
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800'
      ]
    },
    {
      title: 'Organic Cotton Printed Kids Frock',
      slug: 'organic-cotton-printed-kids-frock',
      description: 'Playful A-line dress with hand block printed floral motifs and soft cotton lining.',
      price: 1199,
      originalPrice: 1599,
      categoryId: catKids.id,
      sellerId: seller1.id,
      sizes: '2-3Y,4-5Y,6-7Y',
      colors: 'Coral Pink,Sky Blue',
      material: '100% Organic Cotton',
      brand: 'Aura Eco',
      externalProductUrl: 'https://auraecoatelier.demo/product/kids-frock',
      isFeatured: false,
      likesCount: 45,
      images: [
        'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800'
      ]
    },
    {
      title: 'Handloomed Ajrakh Print Kaftan',
      slug: 'handloomed-ajrakh-print-kaftan',
      description: 'Flowy resort wear kaftan with traditional Kutch Ajrakh block printing and tassel ties.',
      price: 2699,
      originalPrice: 3100,
      categoryId: catWomens.id,
      sellerId: seller5.id,
      sizes: 'Free Size',
      colors: 'Deep Indigo & Madder Red',
      material: 'Modal Silk Handloom',
      brand: 'Kala Weaves',
      externalProductUrl: 'https://kalaweaves.demo/product/ajrakh-kaftan',
      isFeatured: false,
      likesCount: 178,
      images: [
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800'
      ]
    },
    {
      title: 'Casual Linen Button-Down Shirt',
      slug: 'casual-linen-button-down-shirt',
      description: 'Relaxed fit long sleeve shirt featuring a mandarin collar and coconut wood buttons.',
      price: 2199,
      originalPrice: 2800,
      categoryId: catMens.id,
      sellerId: seller1.id,
      sizes: 'S,M,L,XL',
      colors: 'Sky Blue,White,Mint Green',
      material: '100% Linen',
      brand: 'Aura Eco',
      externalProductUrl: 'https://auraecoatelier.demo/product/linen-shirt',
      isFeatured: false,
      likesCount: 132,
      images: [
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800'
      ]
    },
    {
      title: 'Eco Jute Handmade Shoulder Bag',
      slug: 'eco-jute-handmade-shoulder-bag',
      description: 'Handwoven natural jute bag with interior zipper pocket and genuine leather handles.',
      price: 1150,
      originalPrice: 1500,
      categoryId: catFootwear.id,
      sellerId: seller5.id,
      sizes: 'One Size',
      colors: 'Natural Tan',
      material: 'Natural Jute & Leather',
      brand: 'Kala Weaves',
      externalProductUrl: 'https://kalaweaves.demo/product/jute-bag',
      isFeatured: false,
      likesCount: 91,
      images: [
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800'
      ]
    }
  ];

  for (const p of productsData) {
    const product = await prisma.product.create({
      data: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        categoryId: p.categoryId,
        sellerId: p.sellerId,
        sizes: p.sizes,
        colors: p.colors,
        material: p.material,
        brand: p.brand,
        externalProductUrl: p.externalProductUrl,
        isFeatured: p.isFeatured,
        likesCount: p.likesCount,
        commissionType: CommissionType.PERCENTAGE,
        commissionValue: 12.5,
        images: {
          create: p.images.map((url, idx) => ({
            url,
            alt: `${p.title} Image ${idx + 1}`,
            position: idx,
          })),
        },
      },
    });
  }

  const allProducts = await prisma.product.findMany();

  // 7. Seed Wishlist
  const wishlist = await prisma.wishlist.create({
    data: {
      userId: user1.id,
      items: {
        create: [
          { productId: allProducts[0].id },
          { productId: allProducts[2].id },
          { productId: allProducts[3].id },
        ],
      },
    },
  });

  // 8. Seed Referrals & Conversions
  const referral1 = await prisma.referral.create({
    data: {
      userId: user1.id,
      productId: allProducts[0].id,
      sellerId: seller1.id,
      trackingCode: 'REF-USER1-PROD0-2026',
      source: 'product_page',
      clickedAt: new Date(Date.now() - 3600000 * 24 * 2), // 2 days ago
      conversion: {
        create: {
          orderValue: 2499,
          commissionAmount: 312.37,
          status: 'APPROVED',
        },
      },
    },
  });

  const referral2 = await prisma.referral.create({
    data: {
      userId: user2.id,
      productId: allProducts[1].id,
      sellerId: seller2.id,
      trackingCode: 'REF-USER2-PROD1-2026',
      source: 'landing_featured',
      clickedAt: new Date(Date.now() - 3600000 * 12),
    },
  });

  // 9. Seed Sample Clothing Donations & Status Histories
  const donation1 = await prisma.donation.create({
    data: {
      trackingNumber: 'IMP-DON-948201',
      userId: user1.id,
      ngoId: ngo1.id,
      donorName: 'Aanya Sharma',
      donorPhone: '+91 98123 45678',
      donorEmail: 'user@example.com',
      streetAddress: '42 Lotus Boulevard, Sector 128',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201304',
      clothingCategory: 'Winter clothes & Blankets',
      approximateQuantity: 12,
      condition: 'LIKE_NEW',
      pickupRequired: true,
      preferredPickupDate: '2026-10-02',
      additionalNotes: 'Includes 4 woolen sweaters, 2 heavy blankets, and 6 warm hoodies in pristine condition.',
      status: DonationStatus.PICKUP_SCHEDULED,
      statusHistory: {
        create: [
          { status: DonationStatus.SUBMITTED, notes: 'Donation request submitted by donor', updatedBy: 'Aanya Sharma' },
          { status: DonationStatus.UNDER_REVIEW, notes: 'Reviewed and verified by NGO coordinator', updatedBy: 'Cloth For All Foundation' },
          { status: DonationStatus.ACCEPTED, notes: 'Donation accepted for rural winter drive', updatedBy: 'Cloth For All Foundation' },
          { status: DonationStatus.PICKUP_SCHEDULED, notes: 'Volunteers assigned for doorstep pickup on Oct 2nd', updatedBy: 'Cloth For All Foundation' },
        ],
      },
    },
  });

  const donation2 = await prisma.donation.create({
    data: {
      trackingNumber: 'IMP-DON-730194',
      userId: user2.id,
      ngoId: ngo2.id,
      donorName: 'Rohit Verma',
      donorPhone: '+91 97654 32109',
      donorEmail: 'rohit.v@example.com',
      streetAddress: '78 MG Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      clothingCategory: "Men's & Kids Wear",
      approximateQuantity: 25,
      condition: 'GOOD',
      pickupRequired: true,
      preferredPickupDate: '2026-09-28',
      additionalNotes: 'Assorted trousers, shirts, and children school uniforms.',
      status: DonationStatus.DISTRIBUTED,
      statusHistory: {
        create: [
          { status: DonationStatus.SUBMITTED, notes: 'Donation request created' },
          { status: DonationStatus.ACCEPTED, notes: 'Accepted by ReWear Humanity' },
          { status: DonationStatus.PICKUP_SCHEDULED, notes: 'Pickup completed' },
          { status: DonationStatus.COLLECTED, notes: 'Received at Bengaluru warehouse' },
          { status: DonationStatus.DISTRIBUTED, notes: 'Successfully distributed to 15 families at shelter partner', updatedBy: 'ReWear Humanity' },
        ],
      },
    },
  });

  const donation3 = await prisma.donation.create({
    data: {
      trackingNumber: 'IMP-DON-551928',
      userId: user1.id,
      ngoId: ngo3.id,
      donorName: 'Aanya Sharma',
      donorPhone: '+91 98123 45678',
      donorEmail: 'user@example.com',
      streetAddress: '42 Lotus Boulevard, Sector 128',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201304',
      clothingCategory: "Women's Ethnic Wear",
      approximateQuantity: 8,
      condition: 'NEW',
      pickupRequired: true,
      preferredPickupDate: '2026-10-05',
      additionalNotes: 'Gently used silk kurtis and dupattas.',
      status: DonationStatus.SUBMITTED,
      statusHistory: {
        create: [
          { status: DonationStatus.SUBMITTED, notes: 'Donation request submitted successfully' },
        ],
      },
    },
  });

  // 10. Seed Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user1.id,
        title: 'Donation Pickup Scheduled',
        message: 'Cloth For All Foundation has scheduled pickup for donation #IMP-DON-948201 on Oct 2nd.',
        type: 'DONATION',
      },
      {
        userId: user1.id,
        title: 'Thank you for giving back!',
        message: 'Your past donation helped 15 families receive warm apparel this season.',
        type: 'INFO',
      },
    ],
  });

  console.log('✅ Seed completed successfully!');
  console.log('----------------------------------------------------');
  console.log('Demo Credentials created:');
  console.log('🔐 Normal User : user@example.com | password123');
  console.log('🔐 Shop Owner  : seller@auraeco.com | password123');
  console.log('🔐 NGO Manager : ngo@clothforall.org | password123');
  console.log('🔐 Platform Admin: admin@impactapp.org | password123');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
