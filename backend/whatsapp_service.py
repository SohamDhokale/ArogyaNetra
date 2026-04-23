import os
import logging
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# Twilio Credentials (to be set in .env)
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_WHATSAPP_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER", "whatsapp:+14155238886")
TWILIO_CONTENT_SID = os.getenv("TWILIO_CONTENT_SID")

class WhatsAppService:
    def __init__(self):
        self.client = None
        if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
            try:
                from twilio.rest import Client
                self.client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
                logger.info("Twilio client initialized successfully.")
            except ImportError:
                logger.warning("Twilio library not installed. WhatsApp messages will be logged only.")
            except Exception as e:
                logger.error(f"Failed to initialize Twilio client: {e}")
        else:
            logger.warning("Twilio credentials missing. WhatsApp messages will be logged only.")

    def _format_number(self, to_number: str) -> str:
        """
        Ensures the number is in E.164 format for WhatsApp.
        E.g., '+917028154299' -> 'whatsapp:+917028154299'
        If '+' is missing, assumes '91' prefix if it starts with 10 digits.
        """
        # Remove all non-digit characters except +
        clean_number = "".join(c for c in to_number if c.isdigit() or c == '+')
        
        # Add + if missing
        if not clean_number.startswith('+'):
            if len(clean_number) == 10:
                clean_number = f"+91{clean_number}" # Default to India
            else:
                clean_number = f"+{clean_number}"
        
        return f"whatsapp:{clean_number}"

    def send_message(self, to_number: str, message: str) -> bool:
        """
        Sends a standard text-based WhatsApp message.
        """
        formatted_to = self._format_number(to_number)

        if self.client:
            try:
                msg = self.client.messages.create(
                    body=message,
                    from_=TWILIO_WHATSAPP_NUMBER,
                    to=formatted_to
                )
                print(f"DEBUG: WhatsApp message sent to {formatted_to}. SID: {msg.sid}")
                return True
            except Exception as e:
                print(f"ERROR: Failed to send WhatsApp message to {formatted_to}: {e}")
                return False
        else:
            self._mock_log(formatted_to, message)
            return True

    def send_template_message(self, to_number: str, content_sid: str, variables: dict) -> bool:
        """
        Sends a template-based WhatsApp message using Twilio Content SID.
        """
        formatted_to = self._format_number(to_number)

        import json
        variables_str = json.dumps(variables)

        if self.client:
            try:
                msg = self.client.messages.create(
                    from_=TWILIO_WHATSAPP_NUMBER,
                    content_sid=content_sid,
                    content_variables=variables_str,
                    to=formatted_to
                )
                print(f"DEBUG: WhatsApp template message sent to {formatted_to}. SID: {msg.sid}")
                return True
            except Exception as e:
                print(f"ERROR: Failed to send WhatsApp template message to {formatted_to}: {e}")
                return False
        else:
            self._mock_log(formatted_to, f"Template SID: {content_sid}, Variables: {variables_str}")
            return True

    def _mock_log(self, to_number: str, content: str):
        print("\n" + "="*50)
        print(f"MOCK WHATSAPP MESSAGE")
        print(f"To: {to_number}")
        print(f"Content: {content}")
        print("="*50 + "\n")
        logger.info(f"MOCK: WhatsApp message to {to_number} logged.")

    def send_report_link(self, to_number: str, patient_name: str, risk_score: float, report_url: str) -> bool:
        """
        Sends a clinical report link via WhatsApp.
        Uses a custom detailed message for better clinical context.
        """
        risk_label = "High Risk" if risk_score > 60 else ("Moderate Risk" if risk_score > 30 else "Low Risk")
        
        # We use the detailed custom message instead of the appointment template
        # to ensure the content is clinically relevant (mentions risk score, report link, etc.)
        message = (
            f"🏥 *ArogyaNetra Clinical Report*\n\n"
            f"Hello {patient_name},\n"
            f"Your health risk assessment is ready.\n\n"
            f"*Risk Score:* {risk_score:.2f}%\n"
            f"*Category:* {risk_label}\n\n"
            f"You can view and download your full report here:\n"
            f"{report_url}\n\n"
            f"Please consult with your doctor for further advice."
        )
        
        return self.send_message(to_number, message)

whatsapp_service = WhatsAppService()
