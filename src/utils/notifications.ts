import { supabase } from "@/integrations/supabase/client";

type NotificationType = 
  | "transaction_submitted"
  | "transaction_verified"
  | "transaction_rejected"
  | "grant_submitted"
  | "grant_approved"
  | "grant_rejected"
  | "application_submitted"
  | "application_approved"
  | "application_rejected"
  | "withdrawal_submitted"
  | "withdrawal_approved"
  | "withdrawal_rejected"
  | "tier_upgrade_submitted"
  | "tier_upgrade_verified"
  | "tier_upgrade_rejected";

interface NotificationDetails {
  amount?: number;
  cryptoType?: string;
  cryptoAmount?: string;
  transactionHash?: string;
  grantType?: string;
  applicationId?: string;
  walletAddress?: string;
  tierLevel?: number;
  adminNotes?: string;
}

export const sendNotification = async (
  type: NotificationType,
  userEmail: string,
  userName?: string,
  details?: NotificationDetails
) => {
  try {
    const { data, error } = await supabase.functions.invoke("send-notification", {
      body: {
        type,
        userEmail,
        userName,
        details,
      },
    });

    if (error) {
      console.error("Failed to send notification:", error);
      return { success: false, error };
    }

    console.log("Notification sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error sending notification:", error);
    return { success: false, error };
  }
};
