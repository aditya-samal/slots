import connectDB from "../../../../lib/mongodb";
import User from "../../../../models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your-secret-key";

export async function POST(request) {
  await connectDB();

  let { email, passcode } = await request.json();

  // Append @iitg.ac.in if not already present
  if (email && !email.includes("@")) {
    email = email + "@iitg.ac.in";
  }

  // Normalize email to lowercase
  email = email.toLowerCase().trim();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
      });
    }

    const isPasscodeValid = await user.comparePasscode(passcode);
    if (!isPasscodeValid) {
      console.log(`Invalid passcode for email: ${email}`);
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return new Response(
      JSON.stringify({
        token,
        user: { name: user.name, email: user.email },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
