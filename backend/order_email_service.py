"""Email service for order notifications"""
import os
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from models import Order
from typing import Dict, Any

logger = logging.getLogger(__name__)


class OrderEmailService:
    """Service for sending order-related emails"""
    
    @staticmethod
    async def send_new_order_notification(order: Order) -> Dict[str, Any]:
        """
        Send email notification to admin about new order
        
        Args:
            order: Order object with customer details and items
            
        Returns:
            Dictionary with success status
        """
        try:
            # Get email credentials from environment
            smtp_host = os.environ.get("SMTP_HOST", "smtp.yandex.ru")
            smtp_port = int(os.environ.get("SMTP_PORT", "465"))
            smtp_user = os.environ.get("FROM_EMAIL")
            smtp_password = os.environ.get("SMTP_PASSWORD")  # App password
            admin_email = os.environ.get("ADMIN_EMAIL", os.environ.get("OWNER_EMAIL"))
            
            if not smtp_user or not smtp_password:
                logger.warning("SMTP credentials not configured")
                return {"success": False, "message": "Email not configured"}
            
            if not admin_email:
                logger.warning("Admin email not configured")
                return {"success": False, "message": "Admin email not configured"}
            
            # Format items list
            items_html = ""
            for item in order.items:
                items_html += f"""<tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">{item.product_name}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">{item.size_category}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">{item.quantity} шт.</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">{item.price * item.quantity:,.0f} ₽</td>
                </tr>"""
            
            # Create email
            msg = MIMEMultipart('alternative')
            msg['Subject'] = f'🔔 Новый заказ №{order.id[:8].upper()} на сайте AVK-PRO'
            msg['From'] = smtp_user
            msg['To'] = admin_email
            
            # HTML body
            html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px;">🔔 Новый заказ!</h1>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #1e40af;">Заказ №{order.id[:8].upper()}</h2>
            <p style="margin: 5px 0;"><strong>Дата:</strong> {order.created_at.strftime('%d.%m.%Y %H:%M')}</p>
            <p style="margin: 5px 0;"><strong>Статус:</strong> Новый заказ</p>
        </div>
        
        <div style="margin: 20px 0;">
            <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">👤 Информация о клиенте</h3>
            <p style="margin: 5px 0;"><strong>Имя:</strong> {order.customer_name}</p>
            <p style="margin: 5px 0;"><strong>Телефон:</strong> {order.customer_phone}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> {order.customer_email}</p>
            <p style="margin: 5px 0;"><strong>Адрес доставки:</strong> {order.shipping_address if order.shipping_address else 'Не указан'}</p>
        </div>
        
        <div style="margin: 20px 0;">
            <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">📦 Товары в заказе</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                    <tr style="background-color: #f1f5f9;">
                        <th style="padding: 10px; text-align: left; border-bottom: 2px solid #cbd5e1;">Товар</th>
                        <th style="padding: 10px; text-align: left; border-bottom: 2px solid #cbd5e1;">Размер</th>
                        <th style="padding: 10px; text-align: center; border-bottom: 2px solid #cbd5e1;">Кол-во</th>
                        <th style="padding: 10px; text-align: right; border-bottom: 2px solid #cbd5e1;">Сумма</th>
                    </tr>
                </thead>
                <tbody>
                    {items_html}
                </tbody>
                <tfoot>
                    <tr style="background-color: #fef3c7;">
                        <td colspan="3" style="padding: 15px; text-align: right; font-weight: bold; font-size: 1.1em;">ИТОГО:</td>
                        <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 1.1em; color: #dc2626;">{order.total_amount:,.0f} ₽</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        
        {f'''<div style="margin: 20px 0;">
            <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">📝 Комментарий клиента</h3>
            <p style="background-color: #f8fafc; padding: 10px; border-left: 4px solid #2563eb; margin-top: 10px;">{order.order_notes}</p>
        </div>''' if order.order_notes else ''}
        
        <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; font-weight: bold; color: #1e40af;">⚡ Следующие шаги:</p>
            <ol style="margin: 10px 0 0 0;">
                <li>Свяжитесь с клиентом по телефону для уточнения деталей</li>
                <li>Подтвердите наличие товара</li>
                <li>Согласуйте сроки и стоимость доставки</li>
            </ol>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #64748b; font-size: 0.9em;">
            <p>Это автоматическое уведомление от сайта <strong>AVK-PRO.RU</strong></p>
            <p>Хоккейная форма с индивидуальным дизайном</p>
        </div>
    </div>
</body>
</html>
            """
            
            # Attach HTML part
            html_part = MIMEText(html_content, 'html', 'utf-8')
            msg.attach(html_part)
            
            # Send email via SSL
            with smtplib.SMTP_SSL(smtp_host, smtp_port) as server:
                server.login(smtp_user, smtp_password)
                server.send_message(msg)
            
            logger.info(f"Order notification email sent for order {order.id}")
            
            return {
                "success": True,
                "message": "Email sent successfully"
            }
            
        except Exception as e:
            logger.error(f"Failed to send order notification email: {str(e)}")
            return {
                "success": False,
                "message": f"Email error: {str(e)}"
            }
