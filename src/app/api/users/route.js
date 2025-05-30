import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export async function POST(req) {
  await connectDB();

  const { name, email, passcode } = await req.json();

  if (!name || !email || !passcode) {
    return new Response(
      JSON.stringify({ message: "All fields are required" }),
      { status: 400 }
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ message: "User already exists" }), {
      status: 400,
    });
  }

  const user = new User({ name, email, passcode });
  await user.save();

  return new Response(
    JSON.stringify({ message: "User created successfully" }),
    { status: 201 }
  );
}
