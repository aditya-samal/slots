import connectDB from "../src/lib/mongodb.js";
import User from "../src/models/User.js";

const usersData = [
  {
    name: "Swapnil Maurya",
    email: "m.swapnil@iitg.ac.in",
    rollNumber: "250106071",
  },
  {
    name: "Aditya Kumar",
    email: "adityak1004@iitg.ac.in",
    rollNumber: "250101004",
  },
  {
    name: "Ansh Bansal",
    email: "ansh.bansal@iitg.ac.in",
    rollNumber: "250123013",
  },
  {
    name: "Rishabh Thakur",
    email: "t.rishabh@iitg.ac.in",
    rollNumber: "250101084",
  },
  {
    name: "Rohit Ameet Hudlikar",
    email: "h.rohit@iitg.ac.in",
    rollNumber: "250151016",
  },
  {
    name: "Ronit Sonawane",
    email: "k.sonawane@iitg.ac.in",
    rollNumber: "250101099",
  },
  {
    name: "Prince Kumar Singh",
    email: "princeksingh@iitg.ac.in",
    rollNumber: "250102075",
  },
  {
    name: "Yukta Rathodia",
    email: "r.yukta@iitg.ac.in",
    rollNumber: "250101116",
  },
  {
    name: "Rudrajeet Pal",
    email: "p.rudrajeet@iitg.ac.in",
    rollNumber: "250123054",
  },
  {
    name: "Ankita Satpathy",
    email: "a.satpathy@iitg.ac.in",
    rollNumber: "250122008",
  },
  {
    name: "Anshita Kalwat",
    email: "anshita.kalawat@iitg.ac.in",
    rollNumber: "250123014",
  },
  {
    name: "Rahul Jain",
    email: "rahulj2080@iitg.ac.in",
    rollNumber: "250102080",
  },
];

function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function extractSurname(name) {
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1]; // Last part is the surname
}

function generatePasscode(name, rollNumber) {
  const surname = extractSurname(name);
  const last5Digits = rollNumber.slice(-5); // Last 5 digits of roll number
  return `${surname}_${last5Digits}`;
}

async function createUsers() {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Connected to database successfully!\n");

    const results = {
      created: [],
      skipped: [],
      errors: [],
    };

    for (const userData of usersData) {
      const { name, email, rollNumber } = userData;
      const titleCaseName = toTitleCase(name);
      const passcode = generatePasscode(titleCaseName, rollNumber);

      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          console.log(`⚠️  User already exists: ${titleCaseName} (${email})`);
          results.skipped.push({ name: titleCaseName, email, passcode });
          continue;
        }

        // Create new user with title case name
        const user = new User({
          name: titleCaseName,
          email,
          passcode,
        });

        await user.save();
        console.log(`✅ Created user: ${titleCaseName}`);
        console.log(`   Email: ${email}`);
        console.log(`   Passcode: ${passcode}\n`);
        results.created.push({ name: titleCaseName, email, passcode });
      } catch (error) {
        console.error(
          `❌ Error creating user ${titleCaseName}:`,
          error.message
        );
        results.errors.push({
          name: titleCaseName,
          email,
          error: error.message,
        });
      }
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("SUMMARY");
    console.log("=".repeat(50));
    console.log(`✅ Created: ${results.created.length}`);
    console.log(`⚠️  Skipped (already exists): ${results.skipped.length}`);
    console.log(`❌ Errors: ${results.errors.length}`);

    if (results.created.length > 0) {
      console.log("\nCreated users:");
      results.created.forEach((u) => {
        console.log(`  - ${u.name}: ${u.email} (passcode: ${u.passcode})`);
      });
    }

    if (results.skipped.length > 0) {
      console.log("\nSkipped users (already exist):");
      results.skipped.forEach((u) => {
        console.log(`  - ${u.name}: ${u.email}`);
      });
    }

    if (results.errors.length > 0) {
      console.log("\nErrors:");
      results.errors.forEach((u) => {
        console.log(`  - ${u.name}: ${u.error}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

createUsers();
