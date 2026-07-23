import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─── High-quality car images (Unsplash, free-to-use) ───────────────────────
const IMAGES = {
  // Sedans — verified working Unsplash photo IDs
  camry: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80",
  accord: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80",
  model3: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80",
  civic: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
  bmw3: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
  // SUVs
  rav4: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80",
  crv: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80",
  x5: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80",
  rangeRover: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80",
  gWagon: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=800&q=80",
  tahoe: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=800&q=80",
  // Trucks
  f150: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80",
  silverado: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80",
  ram1500: "https://images.unsplash.com/photo-1616455579100-2ceaa4eb2d37?auto=format&fit=crop&w=800&q=80",
  tacoma: "https://images.unsplash.com/photo-1612825173281-9a193378527e?auto=format&fit=crop&w=800&q=80",
  // Electric
  modelY: "https://images.unsplash.com/photo-1619317190536-29e225ab90e7?auto=format&fit=crop&w=800&q=80",
  modelS: "https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=800&q=80",
  mustangMachE: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80",
  ioniq5: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
  rivianR1T: "https://images.unsplash.com/photo-1611016186353-652e63e0f8d7?auto=format&fit=crop&w=800&q=80",
  // Luxury
  sClass: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",
  a8: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80",
  ls500: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
  bentley: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
  rollsRoyce: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
  // Performance
  mustang: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80",
  corvette: "https://images.unsplash.com/photo-1547744152-14d985cb937f?auto=format&fit=crop&w=800&q=80",
  m4: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
  porsche911: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80",
  supra: "https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?auto=format&fit=crop&w=800&q=80",
};

// ─── Vehicle seed data (30 production-grade vehicles) ──────────────────────
const VEHICLES = [
  // ═══ SEDANS (6) ═══
  {
    make: "Toyota", model: "Camry", trim: "XSE V6", year: 2025,
    category: "Sedan", vin: "4T1K61AK5SU082451", dealerId: "GM-TY-001",
    price: 35420, quantity: 6, status: "In Stock",
    image: IMAGES.camry, mileage: 0, color: "Midnight Black Metallic",
    fuelType: "Gasoline", transmission: "8-Speed Automatic",
    description: "The 2025 Camry XSE V6 delivers 301hp with sport-tuned suspension, leather-trimmed seats, and a 9-inch touchscreen with wireless Apple CarPlay.",
  },
  {
    make: "Honda", model: "Accord", trim: "Touring Hybrid", year: 2025,
    category: "Sedan", vin: "1HGCV3F96SA012847", dealerId: "GM-HN-002",
    price: 38990, quantity: 4, status: "In Stock",
    image: IMAGES.accord, mileage: 0, color: "Still Night Pearl",
    fuelType: "Hybrid", transmission: "e-CVT",
    description: "Premium hybrid sedan with 204 combined HP, 12.3-inch OLED display, head-up display, wireless charging, and Honda SENSING 360 safety suite.",
  },
  {
    make: "Tesla", model: "Model 3", trim: "Long Range AWD", year: 2025,
    category: "Sedan", vin: "5YJ3E1EA5SF234891", dealerId: "GM-TS-003",
    price: 42990, quantity: 3, status: "In Stock",
    image: IMAGES.model3, mileage: 0, color: "Ultra White",
    fuelType: "Electric", transmission: "Single-Speed Direct Drive",
    description: "358-mile range, dual motor AWD, 15-inch cinematic touchscreen, Autopilot, over-the-air updates, and 0-60 in 4.2 seconds.",
  },
  {
    make: "Honda", model: "Civic", trim: "Sport Touring", year: 2025,
    category: "Sedan", vin: "2HGFE2F94SH543210", dealerId: "GM-HN-004",
    price: 31450, quantity: 5, status: "In Stock",
    image: IMAGES.civic, mileage: 0, color: "Rallye Red",
    fuelType: "Gasoline", transmission: "CVT",
    description: "Turbocharged 1.5L with Bose premium audio, leather seating, adaptive cruise, wireless Apple CarPlay/Android Auto.",
  },
  {
    make: "BMW", model: "3 Series", trim: "330i xDrive", year: 2025,
    category: "Sedan", vin: "WBA5R7C51SFH12345", dealerId: "GM-BM-005",
    price: 47295, quantity: 2, status: "In Stock",
    image: IMAGES.bmw3, mileage: 0, color: "Alpine White",
    fuelType: "Gasoline", transmission: "8-Speed Steptronic",
    description: "255hp turbocharged inline-4, xDrive AWD, curved iDrive display, M Sport package, live cockpit professional navigation.",
  },
  {
    make: "Toyota", model: "Camry", trim: "LE", year: 2024,
    category: "Sedan", vin: "4T1K61AK1RU098765", dealerId: "GM-TY-006",
    price: 28855, quantity: 1, status: "Reserved",
    image: IMAGES.camry, mileage: 3200, color: "Celestial Silver Metallic",
    fuelType: "Gasoline", transmission: "8-Speed Automatic",
    description: "Reliable daily sedan with Toyota Safety Sense 3.0, 8-inch touchscreen, and excellent fuel economy at 32 combined MPG.",
  },

  // ═══ SUVs (6) ═══
  {
    make: "Toyota", model: "RAV4", trim: "TRD Off-Road", year: 2025,
    category: "SUV", vin: "2T3P1RFV5SW112233", dealerId: "GM-TY-007",
    price: 41285, quantity: 4, status: "In Stock",
    image: IMAGES.rav4, mileage: 0, color: "Lunar Rock",
    fuelType: "Gasoline", transmission: "8-Speed Automatic",
    description: "Trail-ready compact SUV with multi-terrain select, dynamic torque vectoring AWD, TRD-tuned suspension, and panoramic moonroof.",
  },
  {
    make: "Honda", model: "CR-V", trim: "Hybrid Sport-L", year: 2025,
    category: "SUV", vin: "7FARS6H74SE445566", dealerId: "GM-HN-008",
    price: 39845, quantity: 3, status: "In Stock",
    image: IMAGES.crv, mileage: 0, color: "Canyon River Blue Metallic",
    fuelType: "Hybrid", transmission: "e-CVT",
    description: "Best-selling hybrid SUV with 204hp, 40 MPG combined, hands-free tailgate, Bose audio, and Honda SENSING 360.",
  },
  {
    make: "BMW", model: "X5", trim: "xDrive40i M Sport", year: 2025,
    category: "SUV", vin: "5UXCR6C07S9L77889", dealerId: "GM-BM-009",
    price: 68295, quantity: 2, status: "In Stock",
    image: IMAGES.x5, mileage: 0, color: "Phytonic Blue Metallic",
    fuelType: "Gasoline", transmission: "8-Speed Steptronic Sport",
    description: "Luxury midsize SAV with 375hp inline-6, curved display, Harman Kardon surround, panoramic sky lounge LED roof, and parking assistant plus.",
  },
  {
    make: "Land Rover", model: "Range Rover Sport", trim: "Dynamic SE", year: 2025,
    category: "SUV", vin: "SALWS2RUXSA334455", dealerId: "GM-LR-010",
    price: 84900, quantity: 1, status: "In Transit",
    image: IMAGES.rangeRover, mileage: 0, color: "Santorini Black",
    fuelType: "Gasoline", transmission: "8-Speed Automatic",
    description: "395hp twin-turbo inline-6, air suspension, Meridian 3D audio, 13.1-inch floating touchscreen, and ClearSight digital rearview mirror.",
  },
  {
    make: "Mercedes-Benz", model: "G-Class", trim: "G 550", year: 2025,
    category: "SUV", vin: "WDCYC3KF5SX556677", dealerId: "GM-MB-011",
    price: 145000, quantity: 1, status: "Reserved",
    image: IMAGES.gWagon, mileage: 0, color: "Obsidian Black Metallic",
    fuelType: "Gasoline", transmission: "9-Speed Automatic",
    description: "Iconic luxury off-roader with 416hp V8, three locking differentials, Burmester 3D audio, MBUX with augmented reality navigation.",
  },
  {
    make: "Chevrolet", model: "Tahoe", trim: "RST 4WD", year: 2025,
    category: "SUV", vin: "1GNSKCKD5SR889900", dealerId: "GM-CH-012",
    price: 62300, quantity: 3, status: "In Stock",
    image: IMAGES.tahoe, mileage: 0, color: "Empire Beige Metallic",
    fuelType: "Gasoline", transmission: "10-Speed Automatic",
    description: "Full-size SUV with 420hp 6.2L V8, magnetic ride control, panoramic sunroof, 3rd row seating, and 10.2-inch infotainment.",
  },

  // ═══ TRUCKS (4) ═══
  {
    make: "Ford", model: "F-150", trim: "Lariat SuperCrew", year: 2025,
    category: "Truck", vin: "1FTFW1E82SFA11223", dealerId: "GM-FD-013",
    price: 58770, quantity: 4, status: "In Stock",
    image: IMAGES.f150, mileage: 0, color: "Iconic Silver Metallic",
    fuelType: "Gasoline", transmission: "10-Speed Automatic",
    description: "America's best-selling truck with 3.5L EcoBoost V6 (400hp), Pro Power Onboard 2.4kW, 12-inch SYNC 4 display, and Max Recline seats.",
  },
  {
    make: "Chevrolet", model: "Silverado 1500", trim: "High Country", year: 2025,
    category: "Truck", vin: "3GCUDHEL5SG445566", dealerId: "GM-CH-014",
    price: 64300, quantity: 2, status: "In Stock",
    image: IMAGES.silverado, mileage: 0, color: "Summit White",
    fuelType: "Gasoline", transmission: "10-Speed Automatic",
    description: "Premium full-size truck with 6.2L V8 (420hp), Super Cruise hands-free driving, multi-flex tailgate, and 13.4-inch touchscreen.",
  },
  {
    make: "Ram", model: "1500", trim: "Laramie Longhorn", year: 2025,
    category: "Truck", vin: "1C6SRFKT3SN778899", dealerId: "GM-RM-015",
    price: 63590, quantity: 2, status: "In Stock",
    image: IMAGES.ram1500, mileage: 0, color: "Granite Crystal Metallic",
    fuelType: "Gasoline", transmission: "8-Speed Automatic",
    description: "Luxury truck with 395hp 5.7L HEMI V8, air ride suspension, 12-inch Uconnect 5 display, and hand-wrapped premium leather interior.",
  },
  {
    make: "Toyota", model: "Tacoma", trim: "TRD Pro", year: 2025,
    category: "Truck", vin: "3TMCZ5AN9SM112233", dealerId: "GM-TY-016",
    price: 52320, quantity: 1, status: "In Transit",
    image: IMAGES.tacoma, mileage: 0, color: "Terra (Orange)",
    fuelType: "Gasoline", transmission: "8-Speed Automatic",
    description: "Trail-dominating midsize with 278hp turbocharged 2.4L, Fox internal bypass shocks, electronic locking rear diff, and crawl control.",
  },

  // ═══ ELECTRIC (5) ═══
  {
    make: "Tesla", model: "Model Y", trim: "Performance AWD", year: 2025,
    category: "Electric", vin: "7SAYGDEE1SF556677", dealerId: "GM-TS-017",
    price: 54990, quantity: 5, status: "In Stock",
    image: IMAGES.modelY, mileage: 0, color: "Quicksilver",
    fuelType: "Electric", transmission: "Dual Motor Direct Drive",
    description: "303-mile range, 0-60 in 3.5s, 15-inch touchscreen, full self-driving capable hardware, glass roof, and over-the-air updates.",
  },
  {
    make: "Tesla", model: "Model S", trim: "Plaid", year: 2025,
    category: "Electric", vin: "5YJSA1E62SF889900", dealerId: "GM-TS-018",
    price: 89990, quantity: 1, status: "Reserved",
    image: IMAGES.modelS, mileage: 0, color: "Pearl White Multi-Coat",
    fuelType: "Electric", transmission: "Tri-Motor Direct Drive",
    description: "1,020hp, 0-60 in 1.99s, 17-inch cinematic display, 22-speaker audio, ventilated front seats, and 348-mile estimated range.",
  },
  {
    make: "Ford", model: "Mustang Mach-E", trim: "GT Performance", year: 2025,
    category: "Electric", vin: "3FMTK4SX3SMA11223", dealerId: "GM-FD-019",
    price: 56275, quantity: 3, status: "In Stock",
    image: IMAGES.mustangMachE, mileage: 0, color: "Grabber Blue Metallic",
    fuelType: "Electric", transmission: "Dual Motor Direct Drive",
    description: "480hp AWD electric crossover with MagneRide damping, 15.5-inch SYNC 4A display, BlueCruise hands-free driving, and 270-mile range.",
  },
  {
    make: "Hyundai", model: "IONIQ 5", trim: "Limited AWD", year: 2025,
    category: "Electric", vin: "KM8KWDGE7SU334455", dealerId: "GM-HY-020",
    price: 52600, quantity: 4, status: "In Stock",
    image: IMAGES.ioniq5, mileage: 0, color: "Atlas White",
    fuelType: "Electric", transmission: "Dual Motor Direct Drive",
    description: "320hp dual motor, 303-mile range, 800V ultra-fast charging (10-80% in 18 min), V2L vehicle-to-load, and augmented reality HUD.",
  },
  {
    make: "Rivian", model: "R1T", trim: "Dual Max", year: 2025,
    category: "Electric", vin: "7FCTGAAL0SN556677", dealerId: "GM-RV-021",
    price: 75900, quantity: 1, status: "In Transit",
    image: IMAGES.rivianR1T, mileage: 0, color: "Forest Green",
    fuelType: "Electric", transmission: "Dual Motor Direct Drive",
    description: "Adventure-grade electric truck with 533hp, 400+ mile range, gear tunnel storage, camp kitchen compatible, and 11,000 lb towing.",
  },

  // ═══ LUXURY (4) ═══
  {
    make: "Mercedes-Benz", model: "S-Class", trim: "S 580 4MATIC", year: 2025,
    category: "Luxury", vin: "W1K6G7GB3SA778899", dealerId: "GM-MB-022",
    price: 124850, quantity: 2, status: "In Stock",
    image: IMAGES.sClass, mileage: 0, color: "Obsidian Black Metallic",
    fuelType: "Hybrid", transmission: "9-Speed Automatic",
    description: "Flagship luxury sedan with 510hp biturbo V8, MBUX hyperscreen, rear-axle steering, E-ACTIVE body control, and Burmester 4D audio.",
  },
  {
    make: "Audi", model: "A8 L", trim: "55 TFSI quattro", year: 2025,
    category: "Luxury", vin: "WAU8DAF82SN112233", dealerId: "GM-AU-023",
    price: 98495, quantity: 1, status: "In Stock",
    image: IMAGES.a8, mileage: 0, color: "Mythos Black Metallic",
    fuelType: "Hybrid", transmission: "8-Speed Tiptronic",
    description: "453hp twin-turbo V8, predictive active suspension, Bang & Olufsen 3D premium audio, rear seat executive package, and matrix LED headlights.",
  },
  {
    make: "Lexus", model: "LS", trim: "500h AWD", year: 2025,
    category: "Luxury", vin: "JTHB51FF8S5445566", dealerId: "GM-LX-024",
    price: 82900, quantity: 2, status: "In Stock",
    image: IMAGES.ls500, mileage: 0, color: "Manganese Lustre",
    fuelType: "Hybrid", transmission: "Multi-Stage Hybrid CVT",
    description: "Japanese luxury flagship with 354hp hybrid V6, hand-pleated Kiriko glass interior trim, 23-speaker Mark Levinson audio, and Lexus Safety System+ 3.0.",
  },
  {
    make: "Bentley", model: "Continental GT", trim: "Speed", year: 2025,
    category: "Luxury", vin: "SCBCH63W8SC778899", dealerId: "GM-BT-025",
    price: 284100, quantity: 1, status: "Reserved",
    image: IMAGES.bentley, mileage: 0, color: "Cambrian Grey",
    fuelType: "Gasoline", transmission: "8-Speed Dual-Clutch",
    description: "650hp W12 twin-turbo grand tourer with 208 mph top speed, rotating dashboard display, diamond-knurled controls, and Naim audio.",
  },

  // ═══ PERFORMANCE (5) ═══
  {
    make: "Ford", model: "Mustang", trim: "Dark Horse Premium", year: 2025,
    category: "Performance", vin: "1FA6P8CF7S5112233", dealerId: "GM-FD-026",
    price: 62270, quantity: 3, status: "In Stock",
    image: IMAGES.mustang, mileage: 0, color: "Vapor Blue Metallic",
    fuelType: "Gasoline", transmission: "6-Speed Tremec Manual",
    description: "500hp 5.0L Coyote V8 with unique Dark Horse crank, MagneRide 4.0 dampers, Recaro seats, digital dashboard, and Brembo brakes.",
  },
  {
    make: "Chevrolet", model: "Corvette", trim: "Z06 3LZ", year: 2025,
    category: "Performance", vin: "1G1YK2D46S5445566", dealerId: "GM-CH-027",
    price: 118500, quantity: 1, status: "In Stock",
    image: IMAGES.corvette, mileage: 0, color: "Torch Red",
    fuelType: "Gasoline", transmission: "8-Speed Dual-Clutch",
    description: "670hp flat-plane crank 5.5L V8, 8,600 RPM redline, carbon fiber aero package, front-lift adjustable suspension, and performance data recorder.",
  },
  {
    make: "BMW", model: "M4", trim: "Competition xDrive", year: 2025,
    category: "Performance", vin: "WBS43AZ01S3778899", dealerId: "GM-BM-028",
    price: 82895, quantity: 2, status: "In Stock",
    image: IMAGES.m4, mileage: 0, color: "Isle of Man Green Metallic",
    fuelType: "Gasoline", transmission: "8-Speed M Steptronic",
    description: "523hp twin-turbo inline-6, M xDrive AWD, carbon fiber roof, M Drive Professional, laser headlights, and 3.4s 0-60 time.",
  },
  {
    make: "Porsche", model: "911", trim: "Carrera GTS", year: 2025,
    category: "Performance", vin: "WP0AB2A97SS112233", dealerId: "GM-PR-029",
    price: 149800, quantity: 1, status: "In Transit",
    image: IMAGES.porsche911, mileage: 0, color: "GT Silver Metallic",
    fuelType: "Hybrid", transmission: "8-Speed PDK",
    description: "New T-Hybrid powertrain with 532hp, electric turbo compressor, rear-axle steering, PASM sport suspension, and Sport Chrono package.",
  },
  {
    make: "Toyota", model: "GR Supra", trim: "A91-MT Edition", year: 2025,
    category: "Performance", vin: "WZ1DB0C05SW445566", dealerId: "GM-TY-030",
    price: 58950, quantity: 2, status: "In Stock",
    image: IMAGES.supra, mileage: 0, color: "Renaissance Red 2.0",
    fuelType: "Gasoline", transmission: "6-Speed iMT Manual",
    description: "382hp BMW-sourced inline-6, limited-edition manual transmission, Brembo brakes, active differential, and JBL premium 12-speaker audio.",
  },
];

// ─── Demo users ────────────────────────────────────────────────────────────
const USERS = [
  {
    email: "admin@globalmotors.com",
    password: "demo1234",
    name: "Victoria Chen",
    role: "admin",
    dealership: "Global Motors",
    avatar: "",
  },
  {
    email: "manager@globalmotors.com",
    password: "demo1234",
    name: "Fleet Manager",
    role: "user",
    dealership: "Global Motors",
    avatar: "",
  },
  {
    email: "sarah.j@globalmotors.com",
    password: "demo1234",
    name: "Sarah Johnson",
    role: "user",
    dealership: "Global Motors — East",
    avatar: "",
  },
];

// ─── Main seed function ────────────────────────────────────────────────────
async function main() {
  console.log("🌱 Seeding DriveFlow production database...\n");

  // Clear existing data
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  // Seed users
  for (const u of USERS) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await prisma.user.create({
      data: {
        email: u.email,
        passwordHash,
        name: u.name,
        role: u.role,
        dealership: u.dealership,
        avatar: u.avatar,
      },
    });
    console.log(`  ✅ User: ${u.email} (${u.role})`);
  }

  // Seed vehicles (stagger createdAt so "Recent Activity" ordering is meaningful)
  const now = Date.now();
  for (let i = 0; i < VEHICLES.length; i++) {
    const v = VEHICLES[i];
    await prisma.vehicle.create({
      data: {
        ...v,
        // Stagger creation timestamps: newest vehicles first in the list
        createdAt: new Date(now - i * 3600_000), // 1-hour gaps
      },
    });
    console.log(`  🚗 ${v.year} ${v.make} ${v.model} ${v.trim} — $${v.price.toLocaleString()} [${v.status}]`);
  }

  const totalUnits = VEHICLES.reduce((sum, v) => sum + v.quantity, 0);
  console.log(`\n✨ Seed complete: ${USERS.length} users, ${VEHICLES.length} vehicles (${totalUnits} total units)\n`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("❌ Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
