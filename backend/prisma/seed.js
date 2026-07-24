import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const vehicles = [
  // SEDAN
  {
    make: "Honda",
    model: "Accord",
    year: 2024,
    trim: "Touring",
    category: "Sedan",
    price: 38900,
    quantity: 12,
    status: "In Stock",
    color: "Platinum White",
    fuelType: "Hybrid",
    transmission: "eCVT",
    mileage: 0,
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80",
    description: "The premium midsize sedan with advanced hybrid efficiency and elegant styling."
  },
  {
    make: "Tesla",
    model: "Model 3",
    year: 2024,
    trim: "Long Range",
    category: "Sedan",
    price: 47740,
    quantity: 8,
    status: "In Stock",
    color: "Solid Black",
    fuelType: "Electric",
    transmission: "Single-Speed Direct Drive",
    mileage: 15,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80",
    description: "The definitive electric sedan offering long range and blistering performance."
  },
  {
    make: "Honda",
    model: "Civic",
    year: 2025,
    trim: "Touring",
    category: "Sedan",
    price: 31500,
    quantity: 15,
    status: "In Stock",
    color: "Rallye Red",
    fuelType: "Gasoline",
    transmission: "CVT",
    mileage: 5,
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80",
    description: "Sporty, dynamic, and reliable compact sedan for the modern driver."
  },
  {
    make: "Toyota",
    model: "Camry",
    year: 2025,
    trim: "XSE",
    category: "Sedan",
    price: 36200,
    quantity: 6,
    status: "In Transit",
    color: "Wind Chill Pearl",
    fuelType: "Hybrid",
    transmission: "eCVT",
    mileage: 0,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    description: "The 2025 redesign brings striking looks and standard hybrid power to the iconic Camry."
  },
  {
    make: "Toyota",
    model: "Camry",
    year: 2024,
    trim: "SE",
    category: "Sedan",
    price: 32000,
    quantity: 5,
    status: "In Stock",
    color: "Celestial Silver",
    fuelType: "Gasoline",
    transmission: "Automatic",
    mileage: 120,
    image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80",
    description: "Proven reliability and sharp styling in this legendary mid-size sedan."
  },
  {
    make: "BMW",
    model: "3 Series",
    year: 2024,
    trim: "330i",
    category: "Sedan",
    price: 45500,
    quantity: 3,
    status: "Reserved",
    color: "Portimao Blue",
    fuelType: "Gasoline",
    transmission: "Automatic",
    mileage: 20,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
    description: "The quintessential sports sedan delivering perfect balance and dynamic driving."
  },
  {
    make: "Audi",
    model: "A8 L",
    year: 2024,
    trim: "Prestige",
    category: "Sedan",
    price: 89900,
    quantity: 2,
    status: "In Stock",
    color: "Mythos Black",
    fuelType: "Hybrid",
    transmission: "Automatic",
    mileage: 45,
    image: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=1200&q=80",
    description: "Executive luxury sedan with unmatched rear-seat comfort and premium technology."
  },

  // SUV
  {
    make: "Toyota",
    model: "RAV4",
    year: 2025,
    trim: "Limited AWD",
    category: "SUV",
    price: 39500,
    quantity: 20,
    status: "In Stock",
    color: "Magnetic Gray",
    fuelType: "Hybrid",
    transmission: "eCVT",
    mileage: 10,
    image: "https://autoimage.capitalone.com/dealer/2025-Toyota-RAV4-XLE-2T3W1RFV4SC316824-vauto_2T3W1RFV4SC316824_MP16521-6342c0954382829d41ccf8906558e68eff2549ac240aa5b2eaa0beb106c970fd.jpg?width=640&height=480",
    description: "The best-selling crossover SUV featuring excellent economy and rugged styling."
  },
  {
    make: "Honda",
    model: "CR-V",
    year: 2025,
    trim: "Sport Touring",
    category: "SUV",
    price: 40800,
    quantity: 14,
    status: "In Transit",
    color: "Urban Gray",
    fuelType: "Hybrid",
    transmission: "eCVT",
    mileage: 0,
    image: "https://us-west-2.graphassets.com/ALxjZdtQIQOudrzeO6hSgz/cmaikpfj4unue07mxkrlbsxy2",
    description: "Premium versatile SUV offering spacious interior and advanced safety systems."
  },
  {
    make: "BMW",
    model: "X5",
    year: 2025,
    trim: "xDrive40i Sports",
    category: "SUV",
    price: 68500,
    quantity: 4,
    status: "In Stock",
    color: "Alpine White",
    fuelType: "Hybrid",
    transmission: "Automatic",
    mileage: 25,
    image: "https://cdn.max.auto/t_4x3/l_110640:693c88ba714a267d80b156ad/o_100/t_center_overlay/t_hres/110640/5UX23EU02S9Y00285/6a1e016b98a7f95b39829999.jpg",
    description: "Dynamic mid-size luxury SAV with confident xDrive and sporty aerodynamics."
  },
  {
    make: "Land Rover",
    model: "Range Rover Sport",
    year: 2025,
    trim: "Dynamic SE Stealth P400",
    category: "SUV",
    price: 92400,
    quantity: 2,
    status: "Reserved",
    color: "Carpathian Grey",
    fuelType: "Hybrid",
    transmission: "Automatic",
    mileage: 12,
    image: "https://media.production.jlrms.com/2024-04-03/image/ee5f300e-8dc9-49a5-bd86-cb429e80159d/RRS_25MY_STEALTH_040424_09.jpg?VersionId=NO7DQEhgwbc3rqUv02vglZyln7n7lx4B",
    description: "Incredible presence with the Stealth pack and dynamic on-road performance."
  },
  {
    make: "Mercedes-Benz",
    model: "G-Class",
    year: 2025,
    trim: "G550 [US]",
    category: "SUV",
    price: 144100,
    quantity: 1,
    status: "In Stock",
    color: "Obsidian Black",
    fuelType: "Gasoline",
    transmission: "Automatic",
    mileage: 50,
    image: "https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=1200&q=80",
    description: "Iconic ultra-luxury SUV with unparalleled off-road capability and presence."
  },
  {
    make: "Chevrolet",
    model: "Tahoe",
    year: 2025,
    trim: "High Country",
    category: "SUV",
    price: 78900,
    quantity: 5,
    status: "In Transit",
    color: "Iridescent Pearl",
    fuelType: "Gasoline",
    transmission: "Automatic",
    mileage: 0,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
    description: "Full-size premium SUV built to carry the whole family in uncompromising comfort."
  },

  // TRUCK
  {
    make: "Ford",
    model: "F-150",
    year: 2026,
    trim: "Lariat",
    category: "Truck",
    price: 66500,
    quantity: 18,
    status: "In Stock",
    color: "Agate Black",
    fuelType: "Gasoline",
    transmission: "Automatic",
    mileage: 12,
    image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=80",
    description: "The undisputed king of the road, featuring immense towing capability and tough luxury."
  },
  {
    make: "Chevrolet",
    model: "Silverado 1500",
    year: 2025,
    trim: "LTZ",
    category: "Truck",
    price: 59800,
    quantity: 8,
    status: "In Stock",
    color: "Summit White",
    fuelType: "Gasoline",
    transmission: "Automatic",
    mileage: 22,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    description: "New 2025 highly capable full-size pickup equipped for the toughest jobs."
  },
  {
    make: "Ram",
    model: "1500",
    year: 2025,
    trim: "Longhorn 4x4 Crew Cab 5'7\"",
    category: "Truck",
    price: 68400,
    quantity: 3,
    status: "In Transit",
    color: "Delmonico Red",
    fuelType: "Gasoline",
    transmission: "Automatic",
    mileage: 0,
    image: "https://media.chromedata.com/MediaGallery/media/MjkzOTU4Xk1lZGlhIEdhbGxlcnk/g6p07OzHqVom0Du1llN-ti8dqPqDmmi7tFiAhpvjbRJ8ajc79j2yp18pF3AOKV2IoXEsEz1Age9fEQ_EsQdafICMHPIIKIDJiMTln1uBk7NUvxDWqNYd7AM1iZL9HOBpDnpGrxqGxdCrvGiyk3r-j0d0fhj4-x69_NkL90RuiWo3iD-mgfUXU1egYPTMq2n5/cc_2025RMT111976000_01_640_PRV.png",
    description: "Luxurious capability with authentic southwestern charm and premium leather."
  },
  {
    make: "Toyota",
    model: "Tacoma",
    year: 2025,
    trim: "TRD Pro",
    category: "Truck",
    price: 52300,
    quantity: 6,
    status: "Reserved",
    color: "Ice Cap",
    fuelType: "Hybrid",
    transmission: "Automatic",
    mileage: 15,
    image: "https://di-uploads-pod47.dealerinspire.com/valleyhitoyota/uploads/2025/09/2025-toyota-tacoma-ice-cap.webp",
    description: "The ultimate off-road adventure machine with legendary durability."
  },

  // ELECTRIC
  {
    make: "Tesla",
    model: "Model Y",
    year: 2024,
    trim: "Performance",
    category: "Electric",
    price: 52490,
    quantity: 11,
    status: "In Stock",
    color: "Midnight Silver",
    fuelType: "Electric",
    transmission: "Single-Speed Direct Drive",
    mileage: 20,
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80",
    description: "Tesla's highly anticipated new Model Y with upgraded suspension and track capabilities."
  },
  {
    make: "Tesla",
    model: "Model S",
    year: 2025,
    trim: "Plaid",
    category: "Electric",
    price: 89990,
    quantity: 2,
    status: "In Transit",
    color: "Deep Blue Metallic",
    fuelType: "Electric",
    transmission: "Single-Speed Direct Drive",
    mileage: 0,
    image: "https://unpluggedperformance.com/wp-content/uploads/2023/03/Deep-Blue-Metallic-Unplugged-Performance-Tesla-Model-S-Plaid-Image-4.jpg",
    description: "Incredible acceleration and premium grand touring capabilities."
  },
  {
    make: "Ford",
    model: "Mustang Mach-E",
    year: 2025,
    trim: "GT",
    category: "Electric",
    price: 59995,
    quantity: 5,
    status: "In Stock",
    color: "Grabber Blue",
    fuelType: "Electric",
    transmission: "Single-Speed Direct Drive",
    mileage: 30,
    image: "https://media.drive.com.au/obj/tx_q:50,rs:auto:1920:1080:1/driveau/upload/cms/uploads/b8055bd6-a86f-52b4-b9a8-59702e250000",
    description: "Electrifying Mustang performance infused into a sleek, aggressive SUV."
  },
  {
    make: "Hyundai",
    model: "Ioniq 5",
    year: 2025,
    trim: "Limited AWD",
    category: "Electric",
    price: 53500,
    quantity: 7,
    status: "In Stock",
    color: "Cyber Gray",
    fuelType: "Electric",
    transmission: "Single-Speed Direct Drive",
    mileage: 18,
    image: "https://media.drive.com.au/obj/tx_q:50,rs:auto:1920:1080:1/driveau/upload/cms/uploads/a695e67a-3da0-5880-98b0-6504a9e50000",
    description: "Award-winning retro-futuristic electric crossover with ultra-fast charging."
  },
  {
    make: "Rivian",
    model: "R1S",
    year: 2025,
    trim: "Quad-Motor",
    category: "Electric",
    price: 92000,
    quantity: 2,
    status: "Reserved",
    color: "Forest Green",
    fuelType: "Electric",
    transmission: "Single-Speed Direct Drive",
    mileage: 8,
    image: "https://evsportline.com/cdn/shop/articles/ForestGreen-RivianR1S-RunningBoards-SatinPPF-12_75e3a808-951e-413e-be1b-f33dca954e5b_1280x.jpg?v=1760115462",
    description: "The ultimate electric adventure SUV built for extreme terrains."
  },
  {
    make: "Rivian",
    model: "R1T",
    year: 2025,
    trim: "Quad-Motor",
    category: "Electric",
    price: 87000,
    quantity: 3,
    status: "In Stock",
    color: "Rivian Blue",
    fuelType: "Electric",
    transmission: "Single-Speed Direct Drive",
    mileage: 12,
    image: "https://images.axios.com/LLHVbTisdKBBqR9sQ3D970R5F40=/0x148:2560x1588/1920x1080/2021/01/19/1611072991424.jpg",
    description: "The world's first fully capable luxury electric adventure truck."
  },

  // LUXURY
  {
    make: "Mercedes-Benz",
    model: "S-Class",
    year: 2025,
    trim: "S 580",
    category: "Luxury",
    price: 117000,
    quantity: 2,
    status: "In Stock",
    color: "Diamond White",
    fuelType: "Hybrid",
    transmission: "Automatic",
    mileage: 35,
    image: "https://di-uploads-pod3.dealerinspire.com/fletcherjonesmbnewport/uploads/2024/07/Newport-S-CLASS-SEDAN-1024x683.png",
    description: "The global benchmark for automotive luxury, comfort, and advanced technology."
  },
  {
    make: "Lexus",
    model: "LS",
    year: 2025,
    trim: "LS 500h",
    category: "Luxury",
    price: 114500,
    quantity: 1,
    status: "In Transit",
    color: "Eminent White",
    fuelType: "Hybrid",
    transmission: "CVT",
    mileage: 0,
    image: "https://static0.carbuzzimages.com/wordpress/wp-content/uploads/2025/02/2025-lexus-ls-exterior-5.jpg?q=49&fit=contain&w=750&h=422&dpr=2",
    description: "Unparalleled Japanese craftsmanship and serene hybrid performance."
  },
  {
    make: "Bentley",
    model: "Continental GT",
    year: 2025,
    trim: "Speed",
    category: "Luxury",
    price: 295000,
    quantity: 1,
    status: "Reserved",
    color: "Beluga Black",
    fuelType: "Gasoline",
    transmission: "Automatic",
    mileage: 50,
    image: "https://www.marshallgoldmanbh.com/imagetag/4334/6/l/Used-2025-Bentley-Continental-GT-Speed-First-Edition-1746822140.jpg",
    description: "The pinnacle of grand touring luxury featuring exhilarating Speed performance."
  },

  // PERFORMANCE
  {
    make: "Ford",
    model: "Mustang",
    year: 2024,
    trim: "Dark Horse",
    category: "Performance",
    price: 62195,
    quantity: 4,
    status: "In Stock",
    color: "Blue Ember",
    fuelType: "Gasoline",
    transmission: "Manual",
    mileage: 18,
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80",
    description: "The most track-capable street legal 5.0 V8 Mustang ever created."
  },
  {
    make: "Chevrolet",
    model: "Corvette",
    year: 2024,
    trim: "Z06",
    category: "Performance",
    price: 112000,
    quantity: 2,
    status: "In Stock",
    color: "Torch Red",
    fuelType: "Gasoline",
    transmission: "Automatic",
    mileage: 30,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    description: "Supercar-level performance from an all-American flat-plane crank V8."
  },
  {
    make: "BMW",
    model: "M4",
    year: 2024,
    trim: "Competition xDrive",
    category: "Performance",
    price: 86300,
    quantity: 3,
    status: "In Transit",
    color: "Isle of Man Green",
    fuelType: "Gasoline",
    transmission: "Automatic",
    mileage: 0,
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1200&q=80",
    description: "Relentless track performance paired with secure xDrive capabilities."
  },
  {
    make: "Porsche",
    model: "911",
    year: 2025,
    trim: "Carrera S",
    category: "Performance",
    price: 135000,
    quantity: 2,
    status: "In Stock",
    color: "Guards Red",
    fuelType: "Gasoline",
    transmission: "Automatic",
    mileage: 10,
    image: "https://mediaassets.pca.org/pages/pca/images/content/01-2025-Porsche-911-Carrera-S.jpg",
    description: "The quintessential sports car continuing decades of rear-engine heritage."
  },
  {
    make: "Toyota",
    model: "GR Supra",
    year: 2025,
    trim: "3.0 Premium",
    category: "Performance",
    price: 58500,
    quantity: 3,
    status: "Reserved",
    color: "Renaissance Red",
    fuelType: "Gasoline",
    transmission: "Manual",
    mileage: 22,
    image: "https://di-uploads-pod11.dealerinspire.com/germaintoyotaofcolumbus/uploads/2025/07/Toyota-GR-Supra-Exterior.webp",
    description: "Dynamic handling and raw power in an incredibly sleek and stunning coupe."
  }
];

async function main() {
  console.log('🔄 Cleaning up existing data...');
  // WARNING: Delete operations order matters due to foreign keys if they exist
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  console.log('👤 Creating admin user...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('demo1234', salt);
  
  await prisma.user.create({
    data: {
      email: 'admin@globalmotors.com',
      passwordHash,
      name: 'Victoria Chen',
      role: 'admin',
      dealership: 'Global Motors',
    }
  });

  console.log('🚗 Seeding production-ready flagship vehicles...');
  let i = 1;
  for (const vehicle of vehicles) {
    const vinCounter = String(i).padStart(3, '0');
    let generatedVin = "";
    if (vehicle.make === "Toyota") generatedVin = `4T1B11HK5SU${vinCounter}123`;
    else if (vehicle.make === "Tesla") generatedVin = `5YJ3E1EA5NF${vinCounter}123`;
    else if (vehicle.make === "BMW") generatedVin = `WBA53AR06MF${vinCounter}123`;
    else generatedVin = `1HGCM5F68RA${vinCounter}123`;

    await prisma.vehicle.create({
      data: {
        ...vehicle,
        vin: generatedVin
      }
    });
    i++;
  }

  const count = await prisma.vehicle.count();
  console.log(`✅ Success! Seeded ${count} high-fidelity vehicles and 1 admin user.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
