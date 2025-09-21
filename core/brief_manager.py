#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Менеджер брифа исследования
"""

from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional
import re

@dataclass
class BriefData:
    """Структура данных брифа"""
    research_goals: List[str] = field(default_factory=list)
    research_questions: List[str] = field(default_factory=list)
    target_audience: str = ""
    business_context: str = ""
    success_metrics: List[str] = field(default_factory=list)
    constraints: List[str] = field(default_factory=list)
    additional_info: Dict[str, Any] = field(default_factory=dict)

class BriefManager:
    """Класс для управления брифом исследования"""
    
    def __init__(self):
        self.brief_data = BriefData()
        self.has_brief = False
    
    def load_brief(self, content: str) -> bool:
        """Загрузка и парсинг брифа"""
        try:
            self._parse_brief_content(content)
            self.has_brief = True
            return True
        except Exception as e:
            print(f"❌ Ошибка при загрузке брифа: {e}")
            return False
    
    def _parse_brief_content(self, content: str):
        """Парсинг содержимого брифа"""
        lines = content.strip().split('\n')
        current_section = None
        
        # Маркеры секций
        section_markers = {
            'цели': 'research_goals',
            'goals': 'research_goals',
            'вопросы': 'research_questions', 
            'questions': 'research_questions',
            'аудитория': 'target_audience',
            'audience': 'target_audience',
            'контекст': 'business_context',
            'context': 'business_context',
            'метрики': 'success_metrics',
            'metrics': 'success_metrics',
            'ограничения': 'constraints',
            'constraints': 'constraints'
        }
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Проверяем, не начало ли это новой секции
            line_lower = line.lower()
            for marker, section in section_markers.items():
                if marker in line_lower:
                    current_section = section
                    break
            else:
                # Это контент секции
                if current_section:
                    self._add_to_section(current_section, line)
    
    def _add_to_section(self, section: str, content: str):
        """Добавление контента в секцию"""
        if section in ['target_audience', 'business_context']:
            # Для этих секций сохраняем как строку
            if getattr(self.brief_data, section):
                setattr(self.brief_data, section, 
                       getattr(self.brief_data, section) + ' ' + content)
            else:
                setattr(self.brief_data, section, content)
        else:
            # Для остальных - как список
            if content.startswith(('-', '•', '*')):
                content = content[1:].strip()
            if content:
                getattr(self.brief_data, section).append(content)
    
    def get_brief_context(self) -> str:
        """Получение контекста брифа для промптов"""
        if not self.has_brief:
            return ""
        
        context = "<research_context>\n"
        context += "КРИТИЧЕСКИ ВАЖНО: Все выводы должны отвечать на вопросы и достигать целей из этого брифа!\n\n"
        
        if self.brief_data.research_goals:
            context += f"ЦЕЛИ ИССЛЕДОВАНИЯ (ОБЯЗАТЕЛЬНО достичь каждую):\n"
            for i, goal in enumerate(self.brief_data.research_goals, 1):
                context += f"{i}. {goal}\n"
        
        if self.brief_data.research_questions:
            context += f"\nИССЛЕДОВАТЕЛЬСКИЕ ВОПРОСЫ (ОБЯЗАТЕЛЬНО ответить на каждый):\n"
            for i, question in enumerate(self.brief_data.research_questions, 1):
                context += f"{i}. {question}\n"
        
        if self.brief_data.target_audience:
            context += f"\nЦЕЛЕВАЯ АУДИТОРИЯ:\n{self.brief_data.target_audience}\n"
        
        if self.brief_data.business_context:
            context += f"\nБИЗНЕС-КОНТЕКСТ:\n{self.brief_data.business_context}\n"
        
        if self.brief_data.success_metrics:
            context += f"\nМЕТРИКИ УСПЕХА (оценить влияние на каждую):\n"
            for metric in self.brief_data.success_metrics:
                context += f"- {metric}\n"
        
        context += "\nВАЖНО: Каждый вывод должен быть подкреплен ТОЧНЫМИ ЦИТАТАМИ из интервью!\n"
        context += "</research_context>\n\n"
        
        return context
    
    def get_questions_for_analysis(self) -> List[str]:
        """Получение вопросов для анализа"""
        return self.brief_data.research_questions
    
    def get_goals_for_analysis(self) -> List[str]:
        """Получение целей для анализа"""
        return self.brief_data.research_goals
    
    def get_target_audience(self) -> str:
        """Получение целевой аудитории"""
        return self.brief_data.target_audience
    
    def get_success_metrics(self) -> List[str]:
        """Получение метрик успеха"""
        return self.brief_data.success_metrics
    
    def has_research_goals(self) -> bool:
        """Проверка наличия целей исследования"""
        return bool(self.brief_data.research_goals)
    
    def has_research_questions(self) -> bool:
        """Проверка наличия вопросов исследования"""
        return bool(self.brief_data.research_questions)
    
    def get_brief_summary(self) -> str:
        """Получение краткого описания брифа"""
        if not self.has_brief:
            return "Бриф не загружен"
        
        summary = []
        if self.brief_data.research_goals:
            summary.append(f"Цели: {len(self.brief_data.research_goals)}")
        if self.brief_data.research_questions:
            summary.append(f"Вопросы: {len(self.brief_data.research_questions)}")
        if self.brief_data.target_audience:
            summary.append("Аудитория: определена")
        if self.brief_data.success_metrics:
            summary.append(f"Метрики: {len(self.brief_data.success_metrics)}")
        
        return " | ".join(summary)
