import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

type HotmartPayload = {
  id?: string;
  event?: string;
  hottok?: string;
  data?: {
    buyer?: { email?: string; name?: string };
    purchase?: {
      transaction?: string;
      status?: string;
      approved_date?: number;
      price?: { value?: number; currency_value?: string };
      offer?: { code?: string };
      recurrence_number?: number;
    };
    subscription?: {
      subscriber?: { code?: string };
      status?: string;
      plan?: { name?: string };
    };
    product?: { id?: number | string; name?: string };
  };
};

const GRANT_EVENTS = new Set([
  "PURCHASE_APPROVED",
  "PURCHASE_COMPLETE",
  "SUBSCRIPTION_REACTIVATION",
]);

const REVOKE_EVENTS = new Set([
  "PURCHASE_REFUNDED",
  "PURCHASE_CHARGEBACK",
  "PURCHASE_CANCELED",
  "PURCHASE_EXPIRED",
  "SUBSCRIPTION_CANCELLATION",
]);

function admin() {
  return createClient(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_SERVICE_ROLE_KEY"]!,
    { auth: { persistSession: false } },
  );
}

async function findUserIdByEmail(
  db: ReturnType<typeof admin>,
  email: string,
): Promise<string | null> {
  const { data } = await db
    .from("profiles")
    .select("id")
    .ilike("email", email)
    .maybeSingle();
  return (data?.["id"] as string) ?? null;
}

async function defaultCourseId(db: ReturnType<typeof admin>): Promise<string | null> {
  const { data } = await db
    .from("courses")
    .select("id")
    .order("ordem", { ascending: true })
    .limit(1)
    .maybeSingle();
  return (data?.["id"] as string) ?? null;
}

export const Route = createFileRoute("/api/public/hotmart/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env["HOTMART_HOTTOK"];
        if (!expected) {
          console.error("HOTMART_HOTTOK is not configured");
          return new Response("Not configured", { status: 500 });
        }

        const raw = await request.text();
        let payload: HotmartPayload;
        try {
          payload = JSON.parse(raw) as HotmartPayload;
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const token =
          request.headers.get("x-hotmart-hottok") ??
          request.headers.get("hottok") ??
          payload.hottok ??
          "";
        if (token !== expected) {
          console.error("Hotmart webhook rejected: invalid hottok");
          return new Response("Unauthorized", { status: 401 });
        }

        const event = payload.event ?? "";
        const email = payload.data?.buyer?.email?.trim().toLowerCase();
        const purchase = payload.data?.purchase;
        const transaction = purchase?.transaction ?? payload.id ?? null;

        if (!email) {
          console.warn("Hotmart webhook without buyer email:", event);
          return Response.json({ received: true, ignored: "no email" });
        }

        try {
          const db = admin();
          const userId = await findUserIdByEmail(db, email);
          if (!userId) {
            console.warn("Hotmart buyer has no account yet:", email, event);
            return Response.json({ received: true, pending: "user not found" });
          }

          const courseId = await defaultCourseId(db);
          const valorCents = Math.round((purchase?.price?.value ?? 0) * 100);

          if (GRANT_EVENTS.has(event)) {
            if (transaction) {
              await db.from("purchases").insert({
                user_id: userId,
                course_id: courseId,
                valor_cents: valorCents,
                status: "pago",
                provider: "hotmart",
                provider_payment_id: transaction,
              });
            }
            if (courseId) {
              await db.from("course_access").insert({
                user_id: userId,
                course_id: courseId,
                origem: "hotmart",
              });
            }
            const subscriberCode = payload.data?.subscription?.subscriber?.code;
            if (subscriberCode) {
              await db.from("subscriptions").insert({
                user_id: userId,
                status: "ativa",
                provider: "hotmart",
                provider_subscription_id: subscriberCode,
              });
            }
          } else if (REVOKE_EVENTS.has(event)) {
            if (courseId) {
              await db
                .from("course_access")
                .delete()
                .eq("user_id", userId)
                .eq("course_id", courseId)
                .eq("origem", "hotmart");
            }
            if (transaction) {
              await db
                .from("purchases")
                .update({
                  status: "reembolsado",
                  reembolsado_em: new Date().toISOString(),
                })
                .eq("provider_payment_id", transaction);
            }
            await db
              .from("subscriptions")
              .update({ status: "cancelada" })
              .eq("user_id", userId)
              .eq("provider", "hotmart");
          } else {
            console.log("Hotmart event ignored:", event);
          }

          return Response.json({ received: true });
        } catch (e) {
          console.error("Hotmart webhook error:", e);
          return new Response("Webhook error", { status: 500 });
        }
      },
    },
  },
});
