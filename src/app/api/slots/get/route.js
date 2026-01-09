import connectDB from "../../../../lib/mongodb";
import Slot from "../../../../models/Slot";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your-secret-key";

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return new Response(JSON.stringify({ message: "No token provided" }), {
      status: 401,
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    await connectDB();

    const slots = await Slot.find({});
    const userSlot = await Slot.findOne({ bookedBy: decoded.userId });

    return new Response(JSON.stringify({ slots, userSlot }), {
      status: 200,
    });
  } catch (error) {
    console.error("Get slots error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
