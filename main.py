#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
UX Analyzer V25.0 - OpenRouter Edition
Основной файл для запуска анализатора
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.analyzer import OpenRouterAnalyzer
from core.brief_manager import BriefManager
from core.report_generator import ReportGenerator
from ui.interface import UserInterface
from config.settings import Config

def main():
    """Основная функция запуска"""
    print("🚀 UX Analyzer V25.0 - OpenRouter Edition")
    print("=" * 50)
    
    # Инициализация конфигурации
    config = Config()
    
    # Создание интерфейса
    ui = UserInterface()
    
    # Запуск анализатора
    analyzer = OpenRouterAnalyzer(config.openrouter_api_key)
    
    # Основной цикл
    ui.run(analyzer, config)

if __name__ == "__main__":
    main()
