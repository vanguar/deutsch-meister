import os
import asyncio
import logging
from aiogram import Bot, Dispatcher, F
from aiogram.filters import Command, CommandStart
from aiogram.types import (
    Message, CallbackQuery, PreCheckoutQuery,
    InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo, LabeledPrice,
)
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode

# Токен НЕ хардкодим — берём из окружения. Запуск:
#   Windows (PowerShell):  $env:BOT_TOKEN="123:abc"; python bot\bot.py
#   Linux/macOS:           BOT_TOKEN=123:abc python bot/bot.py
BOT_TOKEN = os.getenv("BOT_TOKEN", "")
APP_URL   = os.getenv("APP_URL", "https://vanguar.github.io/deutsch-meister/")

# Варианты поддержки звёздами (Telegram Stars, валюта XTR)
DONATE_TIERS = [50, 100, 250, 500]

logging.basicConfig(level=logging.INFO)

def welcome_keyboard():
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="🇩🇪 Открыть курс", web_app=WebAppInfo(url=APP_URL))],
        [InlineKeyboardButton(text="❤️ Поддержать проект", callback_data="donate")],
    ])

def donate_keyboard():
    rows = [[InlineKeyboardButton(text=f"⭐ {n}", callback_data=f"donate:{n}")]
            for n in DONATE_TIERS]
    return InlineKeyboardMarkup(inline_keyboard=rows)

def build_welcome(first_name: str) -> str:
    return (
        f"👋 <b>Привет, {first_name}!</b>\n\n"
        f"Рад видеть тебя здесь — ты только что сделал отличный выбор! 🎉\n\n"
        f"<b>🇩🇪 Deutsch Meister</b> — это интерактивный курс немецкого языка "
        f"от нуля до уровня B2, прямо здесь в Telegram.\n\n"
        f"<b>Что умеет этот бот:</b>\n"
        f"📚 32 урока — от A1 до B2\n"
        f"🔊 Озвучка всех фраз и слов\n"
        f"✏️ Интерактивные упражнения\n"
        f"🃏 Флэшкарты для запоминания\n"
        f"🔥 Система стриков и XP\n"
        f"📱 Работает офлайн\n\n"
        f"Нажми кнопку ниже и поехали! 👇"
    )

async def cmd_start(message: Message):
    first_name = message.from_user.first_name or "друг"
    # deep-link /start donate → сразу показываем поддержку
    arg = (message.text or "").partition(" ")[2].strip()
    if arg == "donate":
        await cmd_donate(message)
        return
    await message.answer(build_welcome(first_name), reply_markup=welcome_keyboard())

async def cmd_donate(message: Message):
    await message.answer(
        "❤️ <b>Поддержать Deutsch Meister</b>\n\n"
        "Проект бесплатный и развивается на энтузиазме. "
        "Ваша поддержка звёздами помогает добавлять новые уроки, "
        "озвучку и книги на немецком. Спасибо! 🙏\n\n"
        "Выберите количество звёзд:",
        reply_markup=donate_keyboard(),
    )

async def on_donate_menu(callback: CallbackQuery):
    await callback.answer()
    await cmd_donate(callback.message)

async def send_stars_invoice(bot: Bot, chat_id: int, stars: int):
    # Для Telegram Stars: currency="XTR", provider_token="" (пустой)
    await bot.send_invoice(
        chat_id=chat_id,
        title="Поддержка Deutsch Meister",
        description=f"Спасибо за поддержку проекта на {stars} ⭐!",
        payload=f"donate_{stars}",
        provider_token="",
        currency="XTR",
        prices=[LabeledPrice(label=f"{stars} Stars", amount=stars)],
    )

async def on_donate_amount(callback: CallbackQuery, bot: Bot):
    stars = int(callback.data.split(":", 1)[1])
    await callback.answer()
    await send_stars_invoice(bot, callback.message.chat.id, stars)

async def on_pre_checkout(pre_checkout: PreCheckoutQuery, bot: Bot):
    # Подтверждаем оплату (обязательно в течение 10 секунд)
    await bot.answer_pre_checkout_query(pre_checkout.id, ok=True)

async def on_successful_payment(message: Message):
    amount = message.successful_payment.total_amount
    await message.answer(
        f"🎉 <b>Спасибо за поддержку!</b>\n\n"
        f"Вы поддержали проект на {amount} ⭐. "
        f"Это очень помогает развитию Deutsch Meister! ❤️"
    )

async def main():
    if not BOT_TOKEN:
        raise SystemExit("BOT_TOKEN не задан. Задайте переменную окружения BOT_TOKEN.")
    bot = Bot(
        token=BOT_TOKEN,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML)
    )
    dp = Dispatcher()
    dp.message.register(cmd_start, CommandStart())
    dp.message.register(cmd_donate, Command("donate"))
    dp.callback_query.register(on_donate_menu, F.data == "donate")
    dp.callback_query.register(on_donate_amount, F.data.startswith("donate:"))
    dp.pre_checkout_query.register(on_pre_checkout)
    dp.message.register(on_successful_payment, F.successful_payment)
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
