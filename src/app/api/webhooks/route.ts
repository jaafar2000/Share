import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { createOrUpdateUser } from "@/lib/actions/actions";
import { deleteUser } from "@/lib/actions/actions";
export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`
    );
    console.log("Webhook payload:", evt.data);

    if (eventType === "user.created" || eventType === "user.updated") {
      const {
        id,
        first_name,
        last_name,
        image_url,
        email_addresses,
        username,
      } = evt.data as {
        id: string;
        first_name: string | null;
        last_name: string | null;
        image_url: string;
        email_addresses: { email_address: string }[];
        username: string | null;
      };
      try {
        await createOrUpdateUser(
          id,
          first_name ?? "",
          last_name ?? "",
          image_url,
          email_addresses[0]?.email_address ?? "", // ✅
          username ?? ""
        );
        return new Response("User is created or updated", {
          status: 200,
        });
      } catch (error) {
        console.log("Error creating or updating user:", error);
        return new Response("Error occured", {
          status: 400,
        });
      }
    }

    if (eventType === "user.deleted") {
      const { id } = evt?.data as { id: string };
      try {
        deleteUser(id);
        return new Response("User is deleted", {
          status: 200,
        });
      } catch (error) {
        console.log("Error deleting user:", error);
        return new Response("Error occured", {
          status: 400,
        });
      }
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
