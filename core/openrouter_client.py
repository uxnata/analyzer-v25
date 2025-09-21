#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Клиент для работы с OpenRouter API
"""

import requests
import json
import time
import logging
from typing import Dict, Any, Optional
from functools import wraps

def retry_on_error(max_retries: int = 3, delay: float = 2.0):
    """Декоратор для повторных попыток при ошибках"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_error = None
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_error = e
                    if attempt < max_retries - 1:
                        print(f"   ⏳ API ошибка. Повтор через {delay} сек... (попытка {attempt + 1}/{max_retries})")
                        time.sleep(delay)
                        delay *= 1.5  # Экспоненциальная задержка
                    else:
                        print(f"   ❌ Не удалось выполнить запрос после {max_retries} попыток")
                        raise last_error
            raise last_error
        return wrapper
    return decorator

class OpenRouterClient:
    """Клиент для работы с OpenRouter API"""
    
    def __init__(self, api_key: str, model: str = "anthropic/claude-3.5-sonnet"):
        self.api_key = api_key
        self.model = model
        self.base_url = "https://openrouter.ai/api/v1"
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://ux-analyzer.local",
            "X-Title": "UX Analyzer"
        }
    
    @retry_on_error(max_retries=3, delay=2.0)
    def generate_content(self, prompt: str, max_tokens: int = 8192, temperature: float = 0.1) -> str:
        """Генерация контента через OpenRouter API"""
        
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "max_tokens": max_tokens,
            "temperature": temperature,
            "stream": False
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=self.headers,
                json=payload,
                timeout=120
            )
            
            response.raise_for_status()
            
            result = response.json()
            
            if "choices" in result and len(result["choices"]) > 0:
                content = result["choices"][0]["message"]["content"]
                return content
            else:
                raise Exception("Неожиданный формат ответа от API")
                
        except requests.exceptions.RequestException as e:
            if response.status_code == 429:
                raise Exception("Rate limit превышен. Попробуйте позже.")
            elif response.status_code == 401:
                raise Exception("Неверный API ключ")
            elif response.status_code == 403:
                raise Exception("Доступ запрещен. Проверьте права API ключа")
            else:
                raise Exception(f"Ошибка API: {e}")
    
    def test_connection(self) -> bool:
        """Тестирование подключения к API"""
        try:
            test_prompt = "Привет! Это тест подключения. Ответь одним словом: 'Работает'"
            response = self.generate_content(test_prompt, max_tokens=10, temperature=0)
            return "Работает" in response
        except Exception as e:
            print(f"❌ Ошибка подключения к API: {e}")
            return False
    
    def get_model_info(self) -> Dict[str, Any]:
        """Получение информации о модели"""
        try:
            response = requests.get(
                f"{self.base_url}/models",
                headers=self.headers,
                timeout=30
            )
            response.raise_for_status()
            
            models = response.json().get("data", [])
            for model in models:
                if model.get("id") == self.model:
                    return {
                        "id": model.get("id"),
                        "name": model.get("name", ""),
                        "description": model.get("description", ""),
                        "context_length": model.get("context_length", 0),
                        "pricing": model.get("pricing", {})
                    }
            
            return {"error": "Модель не найдена"}
            
        except Exception as e:
            return {"error": f"Ошибка получения информации: {e}"}
    
    def estimate_cost(self, prompt_tokens: int, response_tokens: int) -> Dict[str, float]:
        """Оценка стоимости запроса"""
        # Примерные цены для Claude 3.5 Sonnet через OpenRouter
        input_price_per_1k = 0.003  # $0.003 за 1K токенов ввода
        output_price_per_1k = 0.015  # $0.015 за 1K токенов вывода
        
        input_cost = (prompt_tokens / 1000) * input_price_per_1k
        output_cost = (response_tokens / 1000) * output_price_per_1k
        total_cost = input_cost + output_cost
        
        return {
            "input_cost": round(input_cost, 6),
            "output_cost": round(output_cost, 6),
            "total_cost": round(total_cost, 6),
            "input_tokens": prompt_tokens,
            "output_tokens": response_tokens
        }
