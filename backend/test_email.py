"""
Test script to verify Resend email configuration
"""
import os
import sys
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import resend

# Initialize Resend with API key
resend.api_key = os.environ.get("RESEND_API_KEY")
from_email = os.environ.get("FROM_EMAIL", "orders@orders.avk-pro.ru")

def test_send_email():
    """Send a test email"""
    try:
        print(f"🔧 Тестирование отправки email...")
        print(f"📧 От: {from_email}")
        print(f"🔑 API ключ: {resend.api_key[:10]}...")
        
        # Send test email
        params = {
            "from": from_email,
            "to": ["delivered@resend.dev"],  # Test address
            "subject": "🎉 Тест A.V.K. SPORT - Email настроен!",
            "html": """
            <html>
                <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <h1 style="color: #1a1a1a;">✅ Email настроен успешно!</h1>
                    <p>Поздравляем! Ваш домен <strong>orders.avk-pro.ru</strong> корректно настроен для отправки email через Resend.</p>
                    
                    <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #2563eb;">Что теперь работает:</h3>
                        <ul>
                            <li>✅ Подтверждения заказов</li>
                            <li>✅ Обновления статусов</li>
                            <li>✅ Уведомления клиентам</li>
                        </ul>
                    </div>
                    
                    <p>С уважением,<br><strong>Команда A.V.K. SPORT</strong></p>
                </body>
            </html>
            """
        }
        
        response = resend.Emails.send(params)
        
        print("\n✅ УСПЕХ! Email отправлен!")
        print(f"📬 Email ID: {response.get('id')}")
        print(f"📧 Получатель: delivered@resend.dev")
        print(f"\n💡 Домен orders.avk-pro.ru работает корректно!")
        
        return True
        
    except Exception as e:
        print(f"\n❌ ОШИБКА при отправке email:")
        print(f"   {str(e)}")
        print(f"\n💡 Возможные причины:")
        print(f"   1. DNS записи еще не распространились (подождите 10-15 минут)")
        print(f"   2. Домен не верифицирован в Resend (проверьте статус в дашборде)")
        print(f"   3. API ключ неверный")
        
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("🧪 ТЕСТ EMAIL ИНТЕГРАЦИИ A.V.K. SPORT")
    print("=" * 60)
    print()
    
    success = test_send_email()
    
    print()
    print("=" * 60)
    
    sys.exit(0 if success else 1)
