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

const getNotificationContent = (type: NotificationType, details?: NotificationDetails) => {
  const templates: Record<NotificationType, { title: string; message: string }> = {
    transaction_submitted: {
      title: "Transaction Submitted",
      message: `Your crypto transaction${details?.amount ? ` of $${details.amount}` : ''} has been submitted and is pending verification.`
    },
    transaction_verified: {
      title: "Transaction Verified ✓",
      message: `Your crypto transaction${details?.amount ? ` of $${details.amount}` : ''} has been verified successfully!`
    },
    transaction_rejected: {
      title: "Transaction Rejected",
      message: `Your transaction could not be verified.${details?.adminNotes ? ` Note: ${details.adminNotes}` : ''}`
    },
    grant_submitted: {
      title: "Grant Application Submitted",
      message: `Your ${details?.grantType || 'grant'} application has been submitted and is under review.`
    },
    grant_approved: {
      title: "Grant Approved! 🎉",
      message: `Congratulations! Your ${details?.grantType || 'grant'} application has been approved.`
    },
    grant_rejected: {
      title: "Grant Application Update",
      message: `Your grant application was not approved at this time.${details?.adminNotes ? ` Note: ${details.adminNotes}` : ''}`
    },
    application_submitted: {
      title: "Application Submitted",
      message: "Your application has been submitted and is being reviewed."
    },
    application_approved: {
      title: "Application Approved! 🎉",
      message: "Great news! Your application has been approved."
    },
    application_rejected: {
      title: "Application Update",
      message: `Your application was not approved.${details?.adminNotes ? ` Note: ${details.adminNotes}` : ''}`
    },
    withdrawal_submitted: {
      title: "Withdrawal Request Submitted",
      message: `Your withdrawal request for $${details?.amount || 0} in ${details?.cryptoType || 'crypto'} is being processed.`
    },
    withdrawal_approved: {
      title: "Withdrawal Approved ✓",
      message: `Your withdrawal of $${details?.amount || 0} has been approved and will be sent to your wallet.`
    },
    withdrawal_rejected: {
      title: "Withdrawal Request Update",
      message: `Your withdrawal request could not be processed.${details?.adminNotes ? ` Note: ${details.adminNotes}` : ''}`
    },
    tier_upgrade_submitted: {
      title: "Tier Upgrade Payment Submitted",
      message: `Your tier upgrade payment of $${details?.amount || 0} is pending verification.`
    },
    tier_upgrade_verified: {
      title: "Tier Upgrade Successful! 🎉",
      message: `Welcome to your new tier! Your upgrade has been verified.`
    },
    tier_upgrade_rejected: {
      title: "Tier Upgrade Payment Issue",
      message: `Your tier upgrade payment could not be verified.${details?.adminNotes ? ` Note: ${details.adminNotes}` : ''}`
    }
  };

  return templates[type];
};

export const sendNotification = async (
  type: NotificationType,
  userEmail: string,
  userName?: string,
  details?: NotificationDetails,
  userId?: string
) => {
  try {
    // Get user ID if not provided
    let targetUserId = userId;
    if (!targetUserId) {
      const { data: { session } } = await supabase.auth.getSession();
      targetUserId = session?.user?.id;
    }

    // Save in-app notification if we have a user ID
    if (targetUserId) {
      const content = getNotificationContent(type, details);
      await supabase.from("notifications").insert({
        user_id: targetUserId,
        title: content.title,
        message: content.message,
        type: type,
        metadata: details || {},
        is_read: false
      } as any);
    }

    // Send email notification if email is provided
    if (userEmail && userEmail.trim() !== "") {
      const { data, error } = await supabase.functions.invoke("send-notification", {
        body: {
          type,
          userEmail,
          userName,
          details,
        },
      });

      if (error) {
        console.error("Failed to send email notification:", error);
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending notification:", error);
    return { success: false, error };
  }
};

// Helper to create in-app notification only (for admin actions where we have user_id)
export const createInAppNotification = async (
  userId: string,
  type: NotificationType,
  details?: NotificationDetails
) => {
  try {
    const content = getNotificationContent(type, details);
    const { error } = await supabase.from("notifications").insert({
      user_id: userId,
      title: content.title,
      message: content.message,
      type: type,
      metadata: details || {},
      is_read: false
    } as any);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error creating in-app notification:", error);
    return { success: false, error };
  }
};
