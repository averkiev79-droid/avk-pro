"""
Email service using Resend free API for order notifications
"""
import resend
import os
import logging
from typing import List, Dict, Any
from models import Order, OrderItem

logger = logging.getLogger(__name__)


class EmailService:
    """Email service for sending order notifications"""
    
    @staticmethod
    def format_items_html(items: List[OrderItem]) -> str:
        """Format order items as HTML list"""
        items_html = ""
        for item in items:
            items_html += f"""
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">{item.product_name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">{item.size_category}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">{item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">{item.price:.2f} ₽</td>
            </tr>
            """
        return items_html
    
    @staticmethod
    def send_order_confirmation(order: Order) -> Dict[str, Any]:
        """
        Send order confirmation email using Resend API
        
        Args:
            order: Order object with customer details and items
            
        Returns:
            Dictionary with success status and email ID or error message
        """
        try:
            # Set API key from environment
            resend.api_key = os.environ.get("RESEND_API_KEY", "")
            
            items_html = EmailService.format_items_html(order.items)
            
            html_content = f"""
            <!DOCTYPE html>
            <html lang="ru">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Подтверждение заказа</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
                    <h1 style="color: #fff; margin: 0;">A.V.K. SPORT</h1>
                </div>
                
                <div style="padding: 30px 20px;">
                    <h2 style="color: #1a1a1a;">Спасибо за заказ, {order.customer_name}!</h2>
                    <p>Ваш заказ был успешно получен и обрабатывается.</p>
                    
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #1a1a1a; margin-top: 0;">Заказ #{order.id[:8].upper()}</h3>
                        <p><strong>Дата:</strong> {order.created_at.strftime('%d.%m.%Y %H:%M')}</p>
                        <p><strong>Статус:</strong> В обработке</p>
                    </div>
                    
                    <h3 style="color: #1a1a1a;">Состав заказа:</h3>
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <thead>
                            <tr style="background-color: #1a1a1a; color: #fff;">
                                <th style="padding: 10px; text-align: left;">Товар</th>
                                <th style="padding: 10px; text-align: left;">Категория</th>
                                <th style="padding: 10px; text-align: left;">Кол-во</th>
                                <th style="padding: 10px; text-align: right;">Цена</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items_html}
                        </tbody>
                        <tfoot>
                            <tr style="background-color: #f5f5f5; font-weight: bold;">
                                <td colspan="3" style="padding: 15px; text-align: right;">Итого:</td>
                                <td style="padding: 15px; text-align: right; color: #2563eb;">{order.total_amount:.2f} ₽</td>
                            </tr>
                        </tfoot>
                    </table>
                    
                    <h3 style="color: #1a1a1a;">Адрес доставки:</h3>
                    <p style="background-color: #f5f5f5; padding: 15px; border-radius: 8px;">{order.shipping_address}</p>
                    
                    {f'<h3 style="color: #1a1a1a;">Комментарий к заказу:</h3><p style="background-color: #f5f5f5; padding: 15px; border-radius: 8px;">{order.order_notes}</p>' if order.order_notes else ''}
                    
                    <div style="margin-top: 30px; padding: 20px; background-color: #e3f2fd; border-left: 4px solid #2563eb; border-radius: 4px;">
                        <p style="margin: 0;"><strong>Что дальше?</strong></p>
                        <p style="margin: 10px 0 0 0;">Наш менеджер свяжется с вами в ближайшее время для уточнения деталей заказа.</p>
                    </div>
                    
                    <div style="margin-top: 30px;">
                        <h3 style="color: #1a1a1a;">Контакты:</h3>
                        <p><strong>Телефон:</strong> +7 (812) 648-17-49</p>
                        <p><strong>Email:</strong> info@avk-hockey.ru</p>
                        <p><strong>Адрес:</strong> пр. Ветеранов 140 литГ, Санкт-Петербург</p>
                    </div>
                </div>
                
                <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
                    <p>Это автоматическое письмо. Пожалуйста, не отвечайте на него.</p>
                    <p>&copy; 2025 A.V.K. SPORT. Все права защищены.</p>
                </div>
            </body>
            </html>
            """
            
            # For development/testing, use test email address
            # In production, replace with your verified domain
            from_email = os.environ.get("FROM_EMAIL", "onboarding@resend.dev")
            
            params = {
                "from": from_email,
                "to": [order.customer_email],
                "subject": f"Подтверждение заказа #{order.id[:8].upper()} - A.V.K. SPORT",
                "html": html_content,
                "reply_to": "info@avk-hockey.ru"
            }
            
            # Send email through Resend
            response = resend.Emails.send(params)
            
            logger.info(f"Order confirmation email sent to {order.customer_email}: {response}")
            
            return {
                "success": True,
                "message": "Письмо подтверждения заказа отправлено",
                "email_id": response.get("id")
            }
            
        except Exception as e:
            logger.error(f"Failed to send order confirmation email: {str(e)}")
            return {
                "success": False,
                "message": f"Не удалось отправить письмо: {str(e)}"
            }
    
    @staticmethod
    def send_order_status_update(order: Order, old_status: str, new_status: str) -> Dict[str, Any]:
        """
        Send email notification when order status changes
        
        Args:
            order: Order object
            old_status: Previous order status
            new_status: New order status
            
        Returns:
            Dictionary with success status
        """
        try:
            status_messages = {
                "confirmed": "Ваш заказ подтвержден и принят в производство.",
                "processing": "Ваш заказ находится в производстве.",
                "shipped": "Ваш заказ отправлен! Скоро он будет у вас.",
                "delivered": "Ваш заказ доставлен. Благодарим за покупку!",
                "cancelled": "К сожалению, ваш заказ был отменен."
            }
            
            status_message = status_messages.get(new_status, "Статус вашего заказа изменен.")
            
            html_content = f"""
            <!DOCTYPE html>
            <html lang="ru">
            <head>
                <meta charset="UTF-8">
                <title>Обновление статуса заказа</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
                    <h1 style="color: #fff; margin: 0;">A.V.K. SPORT</h1>
                </div>
                
                <div style="padding: 30px 20px;">
                    <h2 style="color: #1a1a1a;">Обновление статуса заказа</h2>
                    <p>Здравствуйте, {order.customer_name}!</p>
                    
                    <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; margin: 20px 0;">
                        <p style="margin: 0; font-size: 16px;"><strong>{status_message}</strong></p>
                    </div>
                    
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Заказ:</strong> #{order.id[:8].upper()}</p>
                        <p><strong>Новый статус:</strong> {new_status.title()}</p>
                        <p><strong>Сумма:</strong> {order.total_amount:.2f} ₽</p>
                    </div>
                    
                    <p>Если у вас есть вопросы, свяжитесь с нами:</p>
                    <p><strong>Телефон:</strong> +7 (812) 648-17-49</p>
                    <p><strong>Email:</strong> info@avk-hockey.ru</p>
                </div>
                
                <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
                    <p>&copy; 2025 A.V.K. SPORT</p>
                </div>
            </body>
            </html>
            """
            
            from_email = os.environ.get("FROM_EMAIL", "onboarding@resend.dev")
            
            params = {
                "from": from_email,
                "to": [order.customer_email],
                "subject": f"Обновление заказа #{order.id[:8].upper()} - A.V.K. SPORT",
                "html": html_content,
                "reply_to": "info@avk-hockey.ru"
            }
            
            response = resend.Emails.send(params)
            logger.info(f"Status update email sent to {order.customer_email}")
            
            return {
                "success": True,
                "email_id": response.get("id")
            }
            
        except Exception as e:
            logger.error(f"Failed to send status update email: {str(e)}")
            return {
                "success": False,
                "message": str(e)
            }
