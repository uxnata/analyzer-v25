#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Конфигурация UX Analyzer
"""

import os
from dataclasses import dataclass
from typing import Dict, Any

@dataclass
class Config:
    """Основная конфигурация приложения"""
    
    # OpenRouter API настройки
    openrouter_api_key: str = "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"
    openrouter_model: str = "anthropic/claude-3.5-sonnet"
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    
    # Настройки анализа
    max_tokens: int = 8192
    temperature: float = 0.1
    max_retries: int = 3
    retry_delay: int = 2
    
    # Настройки обработки
    chunk_size: int = 8000
    chunk_overlap: int = 1000
    min_quote_length: int = 50
    
    # Настройки отчетов
    output_formats: list = None
    company_name: str = "UX Research Team"
    report_title: str = "UX Research Report"
    
    def __post_init__(self):
        """Инициализация после создания объекта"""
        if self.output_formats is None:
            self.output_formats = ['html', 'pdf']
        
        # Проверяем переменные окружения
        env_api_key = os.getenv('OPENROUTER_API_KEY')
        if env_api_key:
            self.openrouter_api_key = env_api_key
    
    def get_api_config(self) -> Dict[str, Any]:
        """Получение конфигурации API"""
        return {
            'api_key': self.openrouter_api_key,
            'model': self.openrouter_model,
            'base_url': self.openrouter_base_url,
            'max_tokens': self.max_tokens,
            'temperature': self.temperature
        }
    
    def get_analysis_config(self) -> Dict[str, Any]:
        """Получение конфигурации анализа"""
        return {
            'chunk_size': self.chunk_size,
            'chunk_overlap': self.chunk_overlap,
            'min_quote_length': self.min_quote_length,
            'max_retries': self.max_retries,
            'retry_delay': self.retry_delay
        }
