"""
Telegram Bot service for sending order notifications
"""
import os
import logging
from telegram import Bot
from telegram.constants import ParseMode
from models import Order
from typing import Dict, Any

logger = logging.getLogger(__name__)


class TelegramService:
    """Service for sending Telegram notifications"""
    
    @staticmethod
    async def send_order_notification(order: Order) -> Dict[str, Any]:
        """
        Send order notification to Telegram
        
        Args:
            order: Order object with customer details and items
            
        Returns:
            Dictionary with success status
        """
        try:
            bot_token = os.environ.get("TELEGRAM_BOT_TOKEN")
            chat_id = os.environ.get("TELEGRAM_CHAT_ID")
            
            if not bot_token or not chat_id:
                logger.warning("Telegram bot credentials not configured")
                return {"success": False, "message": "Telegram not configured"}
            
            bot = Bot(token=bot_token)
            
            # Format items
            items_text = ""
            for item in order.items:
                items_text += f"• {item.product_name}\n"
                items_text += f"  {item.size_category} • {item.quantity} шт. • {(item.price * item.quantity):,.0f} ₽\n\n"
            
            # Create message
            message = f"""🔔 *НОВЫЙ ЗАКАЗ*

📋 Заказ №: `{order.id[:8].upper()}`
📅 Дата: {order.created_at.strftime('%d.%m.%Y %H:%M')}

👤 *Клиент:*
• Имя: {order.customer_name}
• Телефон: {order.customer_phone}
• Email: {order.customer_email}

📦 *Товары:*
{items_text}
💰 *Итого: {order.total_amount:,.0f} ₽*

📍 *Адрес доставки:*
{order.shipping_address}

📝 *Комментарий:*
{order.order_notes if order.order_notes else 'Нет комментариев'}

⚡ *Действия:* Свяжитесь с клиентом для уточнения деталей
"""
            
            # Send message
            await bot.send_message(
                chat_id=int(chat_id),
                text=message,
                parse_mode=ParseMode.MARKDOWN
            )
            
            logger.info(f"Telegram notification sent for order {order.id}")
            
            return {
                "success": True,
                "message": "Telegram notification sent"
            }
            
        except Exception as e:
            logger.error(f"Failed to send Telegram notification: {str(e)}")
            return {
                "success": False,
                "message": f"Telegram error: {str(e)}"
            }
    
    @staticmethod
    async def send_status_update(order: Order, old_status: str, new_status: str) -> Dict[str, Any]:
        """
        Send status update notification to Telegram
        
        Args:
            order: Order object
            old_status: Previous status
            new_status: New status
            
        Returns:
            Dictionary with success status
        """
        try:
            bot_token = os.environ.get("TELEGRAM_BOT_TOKEN")
            chat_id = os.environ.get("TELEGRAM_CHAT_ID")
            
            if not bot_token or not chat_id:
                return {"success": False, "message": "Telegram not configured"}
            
            bot = Bot(token=bot_token)
            
            status_emoji = {
                "confirmed": "✅",
                "processing": "⚙️",
                "shipped": "🚚",
                "delivered": "🎉",
                "cancelled": "❌"
            }
            
            status_labels = {
                "confirmed": "Подтвержден",
                "processing": "В производстве",
                "shipped": "Отправлен",
                "delivered": "Доставлен",
                "cancelled": "Отменен"
            }
            
            emoji = status_emoji.get(new_status, "📦")
            label = status_labels.get(new_status, new_status)
            
            message = f"""{emoji} *Статус заказа изменен*

📋 Заказ №: `{order.id[:8].upper()}`
👤 Клиент: {order.customer_name}

🔄 Статус: *{label}*
💰 Сумма: {order.total_amount:,.0f} ₽
"""
            
            await bot.send_message(
                chat_id=int(chat_id),
                text=message,
                parse_mode=ParseMode.MARKDOWN
            )
            
            logger.info(f"Telegram status update sent for order {order.id}")
            
            return {"success": True}
            
        except Exception as e:
            logger.error(f"Failed to send Telegram status update: {str(e)}")
            return {"success": False, "message": str(e)}
