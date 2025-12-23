import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

interface NotificationRequest {
  type: NotificationType;
  userEmail: string;
  userId?: string; // Optional - for looking up email from database
  userName?: string;
  details?: {
    amount?: number;
    cryptoType?: string;
    cryptoAmount?: string;
    transactionHash?: string;
    grantType?: string;
    applicationId?: string;
    walletAddress?: string;
    tierLevel?: number;
    adminNotes?: string;
  };
}

const getNotificationContent = (type: NotificationType, details: NotificationRequest["details"] = {}) => {
  const templates: Record<NotificationType, { subject: string; title: string; message: string; statusColor: string; statusText: string }> = {
    // Transaction notifications
    transaction_submitted: {
      subject: "Transaction Submitted - Pending Verification",
      title: "Transaction Received",
      message: "Your cryptocurrency transaction has been submitted and is pending verification by our team.",
      statusColor: "#f59e0b",
      statusText: "Pending ⏳"
    },
    transaction_verified: {
      subject: "Transaction Verified ✓",
      title: "Transaction Verified",
      message: "Your cryptocurrency transaction has been successfully verified!",
      statusColor: "#16a34a",
      statusText: "Verified ✓"
    },
    transaction_rejected: {
      subject: "Transaction Rejected",
      title: "Transaction Rejected",
      message: "Unfortunately, your cryptocurrency transaction could not be verified.",
      statusColor: "#dc2626",
      statusText: "Rejected ✗"
    },
    
    // Grant notifications
    grant_submitted: {
      subject: "Grant Application Submitted",
      title: "Grant Application Received",
      message: `Your grant application for ${details.grantType || 'funding'} has been submitted and is under review.`,
      statusColor: "#f59e0b",
      statusText: "Under Review ⏳"
    },
    grant_approved: {
      subject: "Grant Application Approved! 🎉",
      title: "Congratulations!",
      message: `Your grant application for ${details.grantType || 'funding'} has been approved!`,
      statusColor: "#16a34a",
      statusText: "Approved ✓"
    },
    grant_rejected: {
      subject: "Grant Application Update",
      title: "Application Update",
      message: "We regret to inform you that your grant application was not approved at this time.",
      statusColor: "#dc2626",
      statusText: "Not Approved"
    },
    
    // Application notifications
    application_submitted: {
      subject: "Application Submitted Successfully",
      title: "Application Received",
      message: "Your application has been submitted and is being reviewed by our team.",
      statusColor: "#f59e0b",
      statusText: "Submitted ⏳"
    },
    application_approved: {
      subject: "Application Approved! 🎉",
      title: "Application Approved",
      message: "Great news! Your application has been approved.",
      statusColor: "#16a34a",
      statusText: "Approved ✓"
    },
    application_rejected: {
      subject: "Application Update",
      title: "Application Update",
      message: "We regret to inform you that your application was not approved at this time.",
      statusColor: "#dc2626",
      statusText: "Not Approved"
    },
    
    // Withdrawal notifications
    withdrawal_submitted: {
      subject: "Withdrawal Request Submitted",
      title: "Withdrawal Request Received",
      message: `Your withdrawal request for $${details.amount || 0} in ${details.cryptoType || 'crypto'} is being processed.`,
      statusColor: "#f59e0b",
      statusText: "Processing ⏳"
    },
    withdrawal_approved: {
      subject: "Withdrawal Approved ✓",
      title: "Withdrawal Approved",
      message: `Your withdrawal request for $${details.amount || 0} in ${details.cryptoType || 'crypto'} has been approved and will be sent to your wallet.`,
      statusColor: "#16a34a",
      statusText: "Approved ✓"
    },
    withdrawal_rejected: {
      subject: "Withdrawal Request Update",
      title: "Withdrawal Update",
      message: "Your withdrawal request could not be processed at this time.",
      statusColor: "#dc2626",
      statusText: "Rejected ✗"
    },
    
    // Tier upgrade notifications
    tier_upgrade_submitted: {
      subject: "Tier Upgrade Payment Submitted",
      title: "Tier Upgrade Request",
      message: `Your tier upgrade payment of $${details.amount || 0} has been submitted and is pending verification.`,
      statusColor: "#f59e0b",
      statusText: "Pending ⏳"
    },
    tier_upgrade_verified: {
      subject: "Tier Upgrade Successful! 🎉",
      title: "Welcome to Your New Tier!",
      message: `Congratulations! Your tier upgrade to Level ${details.tierLevel || ''} has been verified. Enjoy your new benefits!`,
      statusColor: "#16a34a",
      statusText: "Upgraded ✓"
    },
    tier_upgrade_rejected: {
      subject: "Tier Upgrade Payment Issue",
      title: "Tier Upgrade Update",
      message: "Unfortunately, your tier upgrade payment could not be verified.",
      statusColor: "#dc2626",
      statusText: "Rejected ✗"
    }
  };

  return templates[type];
};

const generateEmailHtml = (
  content: ReturnType<typeof getNotificationContent>,
  userName: string,
  details: NotificationRequest["details"] = {}
) => {
  const detailsSection = [];
  
  if (details.amount) {
    detailsSection.push(`
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
          <strong style="color: #666666; font-size: 14px;">Amount:</strong>
        </td>
        <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">
          <span style="color: #333333; font-size: 14px;">$${details.amount}</span>
        </td>
      </tr>
    `);
  }
  
  if (details.cryptoAmount && details.cryptoType) {
    detailsSection.push(`
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
          <strong style="color: #666666; font-size: 14px;">Crypto Amount:</strong>
        </td>
        <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">
          <span style="color: #333333; font-size: 14px;">${details.cryptoAmount} ${details.cryptoType}</span>
        </td>
      </tr>
    `);
  }
  
  if (details.transactionHash) {
    detailsSection.push(`
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
          <strong style="color: #666666; font-size: 14px;">Transaction Hash:</strong>
        </td>
        <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">
          <code style="color: #333333; font-size: 12px; background-color: #ffffff; padding: 4px 8px; border-radius: 4px; word-break: break-all;">${details.transactionHash.substring(0, 20)}...</code>
        </td>
      </tr>
    `);
  }
  
  if (details.walletAddress) {
    detailsSection.push(`
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
          <strong style="color: #666666; font-size: 14px;">Wallet Address:</strong>
        </td>
        <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">
          <code style="color: #333333; font-size: 12px; background-color: #ffffff; padding: 4px 8px; border-radius: 4px; word-break: break-all;">${details.walletAddress.substring(0, 15)}...</code>
        </td>
      </tr>
    `);
  }
  
  if (details.grantType) {
    detailsSection.push(`
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
          <strong style="color: #666666; font-size: 14px;">Grant Type:</strong>
        </td>
        <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">
          <span style="color: #333333; font-size: 14px;">${details.grantType}</span>
        </td>
      </tr>
    `);
  }
  
  if (details.tierLevel) {
    const tierNames: Record<number, string> = { 1: "Gateway", 2: "Quantum Leap", 3: "VIP Legacy" };
    detailsSection.push(`
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
          <strong style="color: #666666; font-size: 14px;">Tier Level:</strong>
        </td>
        <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">
          <span style="color: #333333; font-size: 14px;">${tierNames[details.tierLevel] || `Level ${details.tierLevel}`}</span>
        </td>
      </tr>
    `);
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${content.subject}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Big Green</h1>
                  </td>
                </tr>
                
                <!-- Greeting -->
                <tr>
                  <td style="padding: 30px 40px 10px;">
                    <p style="margin: 0; font-size: 16px; color: #333333;">
                      Hello${userName ? ` ${userName}` : ''},
                    </p>
                  </td>
                </tr>
                
                <!-- Status Badge -->
                <tr>
                  <td style="padding: 20px 40px; text-align: center;">
                    <div style="display: inline-block; padding: 12px 24px; background-color: ${content.statusColor}; color: #ffffff; border-radius: 6px; font-size: 18px; font-weight: bold;">
                      ${content.statusText}
                    </div>
                  </td>
                </tr>
                
                <!-- Title -->
                <tr>
                  <td style="padding: 0 40px 10px; text-align: center;">
                    <h2 style="margin: 0; font-size: 22px; color: #333333;">${content.title}</h2>
                  </td>
                </tr>
                
                <!-- Message -->
                <tr>
                  <td style="padding: 0 40px 30px; text-align: center;">
                    <p style="margin: 0; font-size: 16px; color: #666666; line-height: 1.5;">
                      ${content.message}
                    </p>
                  </td>
                </tr>
                
                ${detailsSection.length > 0 ? `
                <!-- Details -->
                <tr>
                  <td style="padding: 0 40px 30px;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 6px;">
                      ${detailsSection.join('')}
                    </table>
                  </td>
                </tr>
                ` : ''}
                
                ${details.adminNotes ? `
                <!-- Admin Notes -->
                <tr>
                  <td style="padding: 0 40px 30px;">
                    <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px;">
                      <p style="margin: 0 0 8px 0; font-weight: bold; color: #92400e; font-size: 14px;">Note from Admin:</p>
                      <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.5;">${details.adminNotes}</p>
                    </div>
                  </td>
                </tr>
                ` : ''}
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                      Thank you for being part of Big Green!
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #999999;">
                      If you have any questions, please contact our support team.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, userEmail, userId, userName, details }: NotificationRequest = await req.json();

    // Skip if no email provided
    if (!userEmail || userEmail.trim() === "") {
      console.log("No user email provided, skipping notification");
      return new Response(JSON.stringify({ skipped: true, reason: "No email provided" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log(`Sending ${type} notification to:`, userEmail);

    const content = getNotificationContent(type, details);
    const emailHtml = generateEmailHtml(content, userName || "", details);

    const emailResponse = await resend.emails.send({
      from: "Big Green <onboarding@resend.dev>",
      to: [userEmail],
      subject: content.subject,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
