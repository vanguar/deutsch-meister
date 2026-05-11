import asyncio
import logging
from aiogram import Bot, Dispatcher
from aiogram.filters import Command
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode

BOT_TOKEN = "7816498802:AAFycr1KVv9XEIZGcRMjqnEthjoeYxFV5V8"
APP_URL   = "https://vanguar.github.io/deutsch-meister/"

logging.basicConfig(level=logging.INFO)

def welcome_keyboard():
    return InlineKeyboardMarkup(inline_keyboard=[[
        InlineKeyboardButton(
            text="🇩🇪 Открыть курс",
            web_app=WebAppInfo(url=APP_URL)
        )
    ]])

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
    await message.answer(
        build_welcome(first_name),
        reply_markup=welcome_keyboard()
    )

async def main():
    bot = Bot(
        token=BOT_TOKEN,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML)
    )
    dp = Dispatcher()
    dp.message.register(cmd_start, Command("start"))
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
