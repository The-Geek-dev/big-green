import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  transactionId: string;
  userEmail: string;
  status: "verified" | "rejected";
  transactionHash: string;
  cryptoType: string;
  amountUsd: number;
  cryptoAmount: string;
  adminNotes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      userEmail,
      status,
      transactionHash,
      cryptoType,
      amountUsd,
      cryptoAmount,
      adminNotes,
    }: NotificationRequest = await req.json();

    console.log("Sending crypto notification email to:", userEmail);

    const statusText = status === "verified" ? "Verified ✓" : "Rejected ✗";
    const statusColor = status === "verified" ? "#16a34a" : "#dc2626";
    const message = status === "verified" 
      ? "Your cryptocurrency donation has been successfully verified!"
      : "Unfortunately, your cryptocurrency donation could not be verified.";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Transaction ${statusText}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Big Green</h1>
                    </td>
                  </tr>
                  
                  <!-- Status Badge -->
                  <tr>
                    <td style="padding: 30px 40px 20px; text-align: center;">
                      <div style="display: inline-block; padding: 12px 24px; background-color: ${statusColor}; color: #ffffff; border-radius: 6px; font-size: 18px; font-weight: bold;">
                        ${statusText}
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Message -->
                  <tr>
                    <td style="padding: 0 40px 30px; text-align: center;">
                      <p style="margin: 0; font-size: 16px; color: #333333; line-height: 1.5;">
                        ${message}
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Transaction Details -->
                  <tr>
                    <td style="padding: 0 40px 30px;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 6px; padding: 20px;">
                        <tr>
                          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #666666; font-size: 14px;">Amount:</strong>
                          </td>
                          <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #333333; font-size: 14px;">$${amountUsd}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #666666; font-size: 14px;">Crypto Amount:</strong>
                          </td>
                          <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">
                            <span style="color: #333333; font-size: 14px;">${cryptoAmount} ${cryptoType}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px;">
                            <strong style="color: #666666; font-size: 14px;">Transaction Hash:</strong>
                          </td>
                          <td style="padding: 10px; text-align: right;">
                            <code style="color: #333333; font-size: 12px; background-color: #ffffff; padding: 4px 8px; border-radius: 4px; word-break: break-all;">${transactionHash.substring(0, 20)}...</code>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  ${adminNotes ? `
                  <!-- Admin Notes -->
                  <tr>
                    <td style="padding: 0 40px 30px;">
                      <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px;">
                        <p style="margin: 0 0 8px 0; font-weight: bold; color: #92400e; font-size: 14px;">Note from Admin:</p>
                        <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.5;">${adminNotes}</p>
                      </div>
                    </td>
                  </tr>
                  ` : ''}
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                        Thank you for your support!
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

    const emailResponse = await resend.emails.send({
      from: "Big Green <onboarding@resend.dev>",
      to: [userEmail],
      subject: `Crypto Donation ${statusText}`,
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
    console.error("Error in send-crypto-notification function:", error);
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
