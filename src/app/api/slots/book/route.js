import connectDB from "../../../../lib/mongodb";
import Slot from "../../../../models/Slot";
import User from "../../../../models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your-secret-key";

export async function POST(request) {
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

    const { slotId } = await request.json();
    const user = await User.findById(decoded.userId);

    // Check if user already has a slot
    const existingSlot = await Slot.findOne({ bookedBy: decoded.userId });

    if (existingSlot) {
      existingSlot.isBooked = false;
      existingSlot.bookedBy = null;
      existingSlot.studentName = null;
      existingSlot.studentEmail = null;
      await existingSlot.save();
    }

    // Handle new slot booking
    let slot;
    if (slotId.includes("-")) {
      const [datePart, timePart] = slotId.split("-").reduce(
        (acc, curr, i, arr) => {
          if (i < 3) acc[0].push(curr); // collect year, month, day parts
          else acc[1].push(curr); // collect remaining as time parts (if any)
          return acc;
        },
        [[], []]
      );

      const date = datePart.join("-");
      const fullTime = timePart.join("-");
      console.log("Parsed date:", date, "and time:", fullTime);
      slot = await Slot.findOne({ date, time: fullTime });
      if (!slot) {
        slot = new Slot({ date, time: fullTime });
      }
    } else {
      slot = await Slot.findById(slotId);
    }

    if (!slot) {
      return new Response(JSON.stringify({ message: "Slot not found" }), {
        status: 404,
      });
    }

    if (slot.isBooked && slot.bookedBy.toString() !== decoded.userId) {
      return new Response(JSON.stringify({ message: "Slot already booked" }), {
        status: 400,
      });
    }

    slot.isBooked = true;
    slot.bookedBy = decoded.userId;
    slot.studentName = user.name;
    slot.studentEmail = user.email;
    await slot.save();

    return new Response(
      JSON.stringify({ message: "Slot booked successfully", slot }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Book slot error:", error);
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return new Response(JSON.stringify({ message: "Invalid or expired token" }), {
        status: 401,
      });
    }
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
