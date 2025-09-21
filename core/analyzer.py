#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Основной класс анализатора UX данных
"""

import json
import re
import time
import numpy as np
from typing import List, Dict, Any, Optional, Union
from dataclasses import dataclass, field
from tqdm import tqdm

from .openrouter_client import OpenRouterClient
from .brief_manager import BriefManager
from .data_models import InterviewSummary, ResearchFindings

@dataclass
class AnalysisResult:
    """Результат анализа"""
    interview_summaries: List[InterviewSummary] = field(default_factory=list)
    research_findings: Optional[ResearchFindings] = None
    total_interviews: int = 0
    analysis_duration: float = 0.0
    api_calls: int = 0
    total_cost: float = 0.0

class OpenRouterAnalyzer:
    """Основной класс анализатора с использованием OpenRouter API"""
    
    def __init__(self, api_key: str, model: str = "anthropic/claude-3.5-sonnet"):
        self.client = OpenRouterClient(api_key, model)
        self.brief_manager = BriefManager()
        self.analysis_config = {
            'chunk_size': 8000,
            'chunk_overlap': 1000,
            'min_quote_length': 50,
            'max_retries': 3
        }
        
        # Статистика
        self.api_calls = 0
        self.total_cost = 0.0
    
    def set_brief(self, brief_content: str) -> bool:
        """Установка брифа исследования"""
        return self.brief_manager.load_brief(brief_content)
    
    def test_api_connection(self) -> bool:
        """Тестирование подключения к API"""
        print("🔌 Тестирование подключения к OpenRouter API...")
        success = self.client.test_connection()
        if success:
            print("✅ Подключение успешно!")
            model_info = self.client.get_model_info()
            if "error" not in model_info:
                print(f"📊 Модель: {model_info.get('name', 'Claude 3.5 Sonnet')}")
                print(f"📏 Контекст: {model_info.get('context_length', 'N/A')} токенов")
        else:
            print("❌ Подключение не удалось!")
        return success
    
    def analyze_transcripts(self, transcripts: List[str]) -> AnalysisResult:
        """Основной метод анализа транскриптов"""
        start_time = time.time()
        
        print(f"🧠 Начинаю анализ {len(transcripts)} транскриптов...")
        
        if not self.test_api_connection():
            raise Exception("Не удалось подключиться к API")
        
        # Проверка количества интервью
        if len(transcripts) < 3:
            print(f"⚠️  ВНИМАНИЕ: Рекомендуется минимум 3 интервью для качественного анализа!")
        
        # Анализ каждого интервью
        interview_summaries = []
        for i, transcript in enumerate(tqdm(transcripts, desc="Анализ интервью")):
            print(f"\n📝 Анализ интервью {i+1}/{len(transcripts)}...")
            summary = self._deep_analyze_interview(transcript, i+1)
            interview_summaries.append(summary)
        
        # Кросс-анализ
        print("\n🔍 Проведение кросс-анализа...")
        cross_analysis = self._cross_analyze_interviews(interview_summaries)
        
        # Генерация финальных выводов
        print("\n📊 Генерация финальных выводов...")
        findings = self._generate_final_findings(interview_summaries, cross_analysis)
        
        # Создание результата
        result = AnalysisResult(
            interview_summaries=interview_summaries,
            research_findings=findings,
            total_interviews=len(transcripts),
            analysis_duration=time.time() - start_time,
            api_calls=self.api_calls,
            total_cost=self.total_cost
        )
        
        print(f"\n✅ Анализ завершен за {result.analysis_duration:.1f} сек")
        print(f"📡 API вызовов: {self.api_calls}")
        print(f"💰 Примерная стоимость: ${self.total_cost:.4f}")
        
        return result
    
    def analyze_transcripts_parallel(self, transcripts: List[str]) -> AnalysisResult:
        """Параллельный анализ транскриптов"""
        start_time = time.time()
        
        print(f"🧠 Начинаю параллельный анализ {len(transcripts)} транскриптов...")
        
        if not self.test_api_connection():
            raise Exception("Не удалось подключиться к API")
        
        # Проверка количества интервью
        if len(transcripts) < 3:
            print(f"⚠️  ВНИМАНИЕ: Рекомендуется минимум 3 интервью для качественного анализа!")
        
        # Простой параллельный анализ (без ThreadPoolExecutor для упрощения)
        interview_summaries = []
        for i, transcript in enumerate(tqdm(transcripts, desc="Параллельный анализ")):
            print(f"\n📝 Анализ интервью {i+1}/{len(transcripts)}...")
            summary = self._deep_analyze_interview(transcript, i+1)
            interview_summaries.append(summary)
        
        # Кросс-анализ
        print("\n🔍 Проведение кросс-анализа...")
        cross_analysis = self._cross_analyze_interviews(interview_summaries)
        
        # Генерация финальных выводов
        print("\n📊 Генерация финальных выводов...")
        findings = self._generate_final_findings(interview_summaries, cross_analysis)
        
        # Создание результата
        result = AnalysisResult(
            interview_summaries=interview_summaries,
            research_findings=findings,
            total_interviews=len(transcripts),
            analysis_duration=time.time() - start_time,
            api_calls=self.api_calls,
            total_cost=self.total_cost
        )
        
        print(f"\n✅ Параллельный анализ завершен за {result.analysis_duration:.1f} сек")
        print(f"📡 API вызовов: {self.api_calls}")
        print(f"💰 Примерная стоимость: ${self.total_cost:.4f}")
        
        return result
    
    def _deep_analyze_interview(self, transcript: str, interview_num: int) -> InterviewSummary:
        """Глубокий анализ одного интервью"""
        
        # Разбиение на чанки
        chunks = self._create_chunks(transcript)
        
        # Анализ каждого чанка
        chunk_summaries = []
        for i, chunk in enumerate(chunks):
            if len(chunks) > 1:
                print(f"   Анализ части {i+1}/{len(chunks)}...")
            
            summary = self._analyze_chunk(chunk, interview_num, i+1)
            if summary:
                chunk_summaries.append(summary)
        
        # Объединение результатов
        combined_summary = "\n\n".join(chunk_summaries)
        
        # Детальный анализ
        profile_analysis = self._analyze_profile_and_themes(combined_summary, interview_num)
        pains_analysis = self._analyze_pains_and_needs(combined_summary, interview_num)
        emotions_analysis = self._analyze_emotions_and_insights(combined_summary, interview_num)
        quotes_analysis = self._analyze_quotes_and_contradictions(combined_summary, interview_num)
        business_analysis = self._analyze_business_aspects(combined_summary, interview_num)
        
        # Анализ связанный с брифом
        brief_findings = {}
        if self.brief_manager.has_brief:
            brief_findings = self._analyze_brief_related_content(combined_summary, interview_num)
        
        # Создание итогового саммари
        summary_data = {
            'interview_id': interview_num,
            'respondent_profile': profile_analysis.get('respondent_profile', {}),
            'key_themes': profile_analysis.get('key_themes', []),
            'pain_points': pains_analysis.get('pain_points', []),
            'needs': pains_analysis.get('needs', []),
            'insights': emotions_analysis.get('insights', []),
            'emotional_journey': emotions_analysis.get('emotional_journey', []),
            'contradictions': quotes_analysis.get('contradictions', []),
            'quotes': quotes_analysis.get('quotes', []),
            'business_pains': business_analysis.get('business_pains', []),
            'user_problems': business_analysis.get('user_problems', []),
            'opportunities': business_analysis.get('opportunities', []),
            'sentiment_score': emotions_analysis.get('sentiment_score', 0.0),
            'brief_related_findings': brief_findings
        }
        
        return InterviewSummary(**summary_data)
    
    def _create_chunks(self, text: str) -> List[str]:
        """Создание чанков для анализа"""
        if len(text) <= self.analysis_config['chunk_size']:
            return [text]
        
        chunks = []
        start = 0
        
        while start < len(text):
            end = start + self.analysis_config['chunk_size']
            chunk = text[start:end]
            chunks.append(chunk)
            start += self.analysis_config['chunk_size'] - self.analysis_config['chunk_overlap']
        
        return chunks
    
    def _analyze_chunk(self, chunk: str, interview_num: int, chunk_num: int) -> str:
        """Анализ отдельного чанка"""
        context = self.brief_manager.get_brief_context()
        
        prompt = f"""{context}

Ты — ведущий UX-исследователь. Проанализируй фрагмент интервью и извлеки ВСЮ ценную информацию.

КРИТИЧЕСКИ ВАЖНО:
1. Сохрани ВСЕ важные цитаты ПОЛНОСТЬЮ и ДОСЛОВНО (минимум 50 слов)
2. НЕ обобщай и НЕ перефразируй - копируй точные формулировки
3. Фиксируй ВСЕ детали: имена, бренды, суммы, даты, проценты
4. Отмечай ВСЕ эмоциональные реакции
5. Связывай находки с целями и вопросами брифа

СТРУКТУРА АНАЛИЗА:

### РЕСПОНДЕНТ
[ВСЯ информация о респонденте из фрагмента БЕЗ додумывания]

### КЛЮЧЕВЫЕ ПРОБЛЕМЫ
Для каждой проблемы:
- Проблема: [ТОЧНОЕ название из интервью]
- Цитата: "[ПОЛНАЯ ДОСЛОВНАЯ цитата респондента минимум 50 слов]"
- Контекст: [ТОЧНЫЕ детали ситуации]
- Эмоции: [ТОЛЬКО упомянутые эмоции]
- Последствия: [ТОЛЬКО сказанное респондентом]

### ПОТРЕБНОСТИ И ЖЕЛАНИЯ
- Явные потребности: [ТОЛЬКО прямо сказанное]
- Идеальное решение: [ТОЛЬКО слова респондента]
- Цитаты: "[Каждая цитата ПОЛНОСТЬЮ]"

### ЭМОЦИОНАЛЬНЫЙ КОНТЕКСТ
- Эмоциональные пики: [ТОЧНЫЕ моменты с цитатами]
- Изменения настроения: [С доказательствами]

ФРАГМЕНТ ИНТЕРВЬЮ:
{chunk}"""

        response = self._make_api_call(prompt)
        return response
    
    def _analyze_profile_and_themes(self, summary: str, interview_num: int) -> Dict[str, Any]:
        """Анализ профиля респондента и ключевых тем"""
        context = self.brief_manager.get_brief_context()
        
        prompt = f"""{context}

Проанализируй профиль респондента и ключевые темы из интервью №{interview_num}.

Верни JSON:
{{
    "respondent_profile": {{
        "demographics": "ТОЛЬКО то, что явно сказано в интервью",
        "occupation": "ТОЛЬКО если упоминается профессия",
        "experience_level": "ТОЛЬКО реальный опыт из интервью",
        "context": "ТОЛЬКО реальный контекст из интервью",
        "tech_literacy": "ТОЛЬКО если есть данные",
        "motivations": "ТОЛЬКО явные мотивации из интервью",
        "lifestyle": "ТОЛЬКО если упоминается",
        "archetype": "На основе РЕАЛЬНЫХ данных",
        "unique_traits": "ТОЛЬКО уникальные черты из интервью"
    }},
    "key_themes": [
        {{
            "theme": "Название темы",
            "description": "Детальное описание темы",
            "frequency": "Сколько раз упоминалась",
            "importance": "Важность для респондента",
            "quotes": ["ПОЛНАЯ цитата минимум 50 слов"],
            "emotional_tone": "Эмоциональный окрас темы",
            "relevance_to_brief": "Как связано с целями брифа"
        }}
    ]
}}

СУММАРИ ИНТЕРВЬЮ:
{summary[:3000]}"""

        response = self._make_api_call(prompt)
        return self._extract_json(response)
    
    def _analyze_pains_and_needs(self, summary: str, interview_num: int) -> Dict[str, Any]:
        """Анализ болей и потребностей"""
        context = self.brief_manager.get_brief_context()
        
        prompt = f"""{context}

Найди ВСЕ боли, проблемы и потребности респондента из интервью №{interview_num}.

Верни JSON:
{{
    "pain_points": [
        {{
            "pain": "ТОЧНОЕ описание боли из интервью",
            "pain_type": "functional/process/emotional/social/financial",
            "root_cause": "Корневая причина из интервью",
            "symptoms": ["Симптом из интервью"],
            "context": "ТОЧНЫЙ контекст из интервью",
            "severity": "critical/high/medium/low",
            "frequency": "ТОЧНАЯ частота из интервью",
            "impact": "ТОЧНОЕ влияние из слов респондента",
            "current_solution": "Что ТОЧНО делает сейчас",
            "ideal_solution": "Что ТОЧНО хочет",
            "quotes": ["ПОЛНАЯ цитата о проблеме минимум 50 слов"],
            "emotional_impact": "ТОЧНЫЕ эмоции из интервью",
            "relevance_to_brief": "Как связано с вопросами брифа"
        }}
    ],
    "needs": [
        {{
            "need": "ТОЧНАЯ формулировка потребности",
            "need_type": "functional/emotional/social/self-actualization",
            "job_to_be_done": "Что ТОЧНО пытается сделать",
            "current_satisfaction": "Насколько удовлетворена по словам респондента",
            "importance": "critical/high/medium/low",
            "triggers": ["ТОЧНЫЙ триггер из интервью"],
            "barriers": ["ТОЧНЫЙ барьер из интервью"],
            "success_criteria": "Что будет успехом по словам респондента",
            "quotes": ["ПОЛНАЯ цитата о потребности минимум 50 слов"],
            "related_pains": ["Связанные боли"],
            "relevance_to_brief": "Как отвечает на вопросы брифа"
        }}
    ]
}}

СУММАРИ:
{summary[:3000]}"""

        response = self._make_api_call(prompt)
        return self._extract_json(response)
    
    def _analyze_emotions_and_insights(self, summary: str, interview_num: int) -> Dict[str, Any]:
        """Анализ эмоций и инсайтов"""
        context = self.brief_manager.get_brief_context()
        
        prompt = f"""{context}

Проанализируй эмоциональный опыт респондента из интервью №{interview_num}.

Верни JSON:
{{
    "emotional_journey": [
        {{
            "moment": "ТОЧНОЕ описание момента из интервью",
            "trigger": "Что ТОЧНО вызвало эмоцию",
            "emotion": "ТОЧНОЕ название эмоции из контекста",
            "emotion_family": "primary/secondary/social/cognitive",
            "intensity": 8,
            "valence": "positive/negative/mixed",
            "duration": "Длительность если упоминается",
            "body_language": "ТОЛЬКО если описано в интервью",
            "quote": "ПОЛНАЯ цитата минимум 50 слов",
            "coping": "Как справлялся ПО СЛОВАМ респондента",
            "impact": "Влияние ПО СЛОВАМ респондента",
            "underlying_need": "Потребность из контекста",
            "relevance_to_brief": "Связь с целями исследования"
        }}
    ],
    "insights": [
        {{
            "insight": "Инсайт основанный на данных (минимум 50 слов)",
            "insight_type": "behavioral/emotional/cognitive/motivational",
            "confidence": "high/medium/low",
            "evidence": ["ТОЧНОЕ доказательство из интервью"],
            "contradiction": "Противоречие если есть",
            "hidden_motivation": "Скрытая мотивация из контекста",
            "design_opportunity": "Возможность для дизайна",
            "business_impact": "Влияние на бизнес",
            "quotes": ["ПОЛНАЯ подтверждающая цитата минимум 50 слов"],
            "relevance_to_brief": "Как помогает достичь целей исследования"
        }}
    ],
    "sentiment_score": 0.5
}}

СУММАРИ:
{summary[:3000]}"""

        response = self._make_api_call(prompt)
        return self._extract_json(response)
    
    def _analyze_quotes_and_contradictions(self, summary: str, interview_num: int) -> Dict[str, Any]:
        """Анализ важных цитат и противоречий"""
        context = self.brief_manager.get_brief_context()
        
        prompt = f"""{context}

Найди самые важные цитаты и ВСЕ противоречия в интервью №{interview_num}.

Верни JSON:
{{
    "quotes": [
        {{
            "text": "ПОЛНАЯ ДОСЛОВНАЯ цитата респондента (минимум 50 слов)",
            "context": "Детальный контекст высказывания",
            "significance": "Почему эта цитата критически важна для исследования",
            "reveals": {{
                "about_user": "Что ТОЧНО раскрывает о пользователе",
                "about_product": "Что ТОЧНО говорит о продукте",
                "about_market": "Что показывает о рынке"
            }},
            "emotions": ["Эмоция из контекста"],
            "keywords": ["Ключевое слово из цитаты"],
            "quote_type": "pain/need/insight/emotion/solution",
            "relevance_to_questions": "К каким вопросам брифа относится"
        }}
    ],
    "contradictions": [
        {{
            "contradiction_type": "logical/emotional/behavioral/temporal/value",
            "severity": "high/medium/low",
            "statement_1": {{
                "text": "ТОЧНОЕ первое утверждение",
                "context": "Контекст утверждения"
            }},
            "statement_2": {{
                "text": "ТОЧНОЕ противоречащее утверждение",
                "context": "Контекст"
            }},
            "analysis": {{
                "nature": "В чем ТОЧНО суть противоречия",
                "possible_reasons": ["Возможная причина из контекста"]
            }},
            "full_quotes": ["Полная цитата с противоречием 1", "Полная цитата 2"]
        }}
    ]
}}

СУММАРИ:
{summary[:3000]}"""

        response = self._make_api_call(prompt)
        return self._extract_json(response)
    
    def _analyze_business_aspects(self, summary: str, interview_num: int) -> Dict[str, Any]:
        """Анализ бизнес-аспектов и возможностей"""
        context = self.brief_manager.get_brief_context()
        
        prompt = f"""{context}

Проанализируй бизнес-влияние проблем из интервью №{interview_num} и найди возможности для роста.

Верни JSON:
{{
    "business_pains": [
        {{
            "pain": "Бизнес-проблема из данных интервью",
            "source": "ТОЧНАЯ пользовательская проблема-источник",
            "impact": {{
                "revenue": "Влияние если упоминается",
                "costs": "Влияние если упоминается",
                "efficiency": "Влияние если упоминается"
            }},
            "urgency": "critical/high/medium/low",
            "quotes": ["ПОЛНАЯ подтверждающая цитата минимум 50 слов"]
        }}
    ],
    "user_problems": [
        {{
            "problem": "ТОЧНАЯ проблема пользователя",
            "frequency": "ТОЧНАЯ частота из интервью",
            "severity": "blocker/major/minor",
            "workaround": "ТОЧНОЕ текущее решение",
            "quotes": ["ПОЛНАЯ цитата о проблеме минимум 50 слов"]
        }}
    ],
    "opportunities": [
        {{
            "opportunity": "Возможность ОСНОВАННАЯ на данных интервью",
            "opportunity_type": "quick_win/strategic/innovation/optimization",
            "based_on_problems": ["Проблема из интервью"],
            "value_proposition": "Ценность из контекста интервью",
            "quotes": ["ПОЛНАЯ поддерживающая цитата минимум 50 слов"]
        }}
    ]
}}

СУММАРИ:
{summary[:3000]}"""

        response = self._make_api_call(prompt)
        return self._extract_json(response)
    
    def _analyze_brief_related_content(self, summary: str, interview_num: int) -> Dict[str, Any]:
        """Анализ контента связанного с брифом"""
        context = self.brief_manager.get_brief_context()
        questions = self.brief_manager.get_questions_for_analysis()
        goals = self.brief_manager.get_goals_for_analysis()
        
        prompt = f"""{context}

Найди в интервью №{interview_num} ВСЕ упоминания и данные, относящиеся к целям и вопросам брифа.

ЦЕЛИ ИССЛЕДОВАНИЯ:
{json.dumps(goals, ensure_ascii=False)}

ВОПРОСЫ ИССЛЕДОВАНИЯ:
{json.dumps(questions, ensure_ascii=False)}

Верни JSON:
{{
    "goal_related_findings": [
        {{
            "goal": "Цель из брифа",
            "findings": [
                {{
                    "finding": "Что найдено в интервью",
                    "quote": "ПОЛНАЯ цитата минимум 50 слов",
                    "relevance": "Как относится к цели"
                }}
            ]
        }}
    ],
    "question_related_findings": [
        {{
            "question": "Вопрос из брифа",
            "answers": [
                {{
                    "answer": "Ответ из интервью",
                    "quote": "ПОЛНАЯ цитата минимум 50 слов",
                    "confidence": "high/medium/low"
                }}
            ]
        }}
    ]
}}

СУММАРИ:
{summary[:3000]}"""

        response = self._make_api_call(prompt)
        return self._extract_json(response)
    
    def _cross_analyze_interviews(self, summaries: List[InterviewSummary]) -> Dict[str, Any]:
        """Кросс-анализ всех интервью"""
        context = self.brief_manager.get_brief_context()
        
        # Подготовка данных для анализа
        analysis_data = {
            'total_interviews': len(summaries),
            'profiles': [s.respondent_profile for s in summaries],
            'all_pains': [pain for s in summaries for pain in s.pain_points or []],
            'all_needs': [need for s in summaries for need in s.needs or []]
        }
        
        prompt = f"""{context}

Проведи ГЛУБОЧАЙШИЙ кросс-анализ {len(summaries)} интервью с фокусом на достижение целей брифа.

Верни JSON:
{{
    "common_patterns": [
        {{
            "pattern": "Детальное описание паттерна из данных (мин. 80 слов)",
            "pattern_type": "behavioral/emotional/cognitive/social",
            "frequency": "6 из 8 респондентов (75%)",
            "confidence": "high/medium/low",
            "evidence": ["Конкретное доказательство 1", "Доказательство 2"],
            "quotes": ["ПОЛНАЯ цитата 1 минимум 60 слов", "ПОЛНАЯ цитата 2"],
            "underlying_need": "Глубинная потребность из данных",
            "design_implication": "Конкретная импликация",
            "relevance_to_brief": {{
                "goals": ["Релевантная цель"],
                "questions": ["Релевантный вопрос"]
            }}
        }}
    ],
    "consensus_points": [
        {{
            "point": "Точка консенсуса из данных (50+ слов)",
            "agreement_level": "100% (8 из 8)",
            "quotes_sample": ["Цитата респондента 1", "Цитата респондента 3"],
            "implication": "Конкретное значение для продукта"
        }}
    ],
    "divergence_points": [
        {{
            "topic": "Тема расхождения из данных",
            "positions": [
                {{
                    "position": "Позиция 1 из интервью",
                    "holders": [1, 3, 5],
                    "quote": "Характерная цитата минимум 60 слов"
                }}
            ]
        }}
    ]
}}

ДАННЫЕ ДЛЯ АНАЛИЗА:
{json.dumps(analysis_data, ensure_ascii=False, indent=2)}"""

        response = self._make_api_call(prompt)
        return self._extract_json(response)
    
    def _generate_final_findings(self, summaries: List[InterviewSummary], cross_analysis: Dict) -> ResearchFindings:
        """Генерация финальных выводов"""
        context = self.brief_manager.get_brief_context()
        
        prompt = f"""{context}

Синтезируй ВСЕ данные в actionable выводы для C-level.

Верни JSON:
{{
    "executive_summary": "Исчерпывающее резюме (300-400 слов). Начни с достижения главной цели брифа, затем ключевые находки по каждому вопросу с точными числами, закончи критическими действиями.",

    "key_insights": [
        {{
            "insight_id": "KI001",
            "problem_title": "Краткое название проблемы",
            "problem_statement": "Когда [точная ситуация], пользователи [точная проблема], что приводит к [точное последствие]",
            "problem_description": "Исчерпывающее описание на основе данных (мин. 200 слов)",
            "severity": "critical/high/medium",
            "affected_percentage": "75% (6 из 8)",
            "business_impact": {{
                "metric": "Конкретная метрика",
                "current_impact": "Точные текущие потери",
                "potential_impact": "Точный потенциал роста"
            }},
            "root_cause": "Глубинная причина из анализа",
            "evidence": ["Конкретное доказательство 1", "Доказательство 2"],
            "quotes": [
                {{
                    "text": "ПОЛНАЯ цитата (80+ слов)",
                    "interview_id": 1,
                    "context": "Контекст цитаты"
                }}
            ],
            "opportunity": {{
                "description": "Детальная возможность из данных (120+ слов)",
                "value_prop": "Конкретное ценностное предложение"
            }},
            "relevance_to_brief": {{
                "addresses_goal": "Какую цель помогает достичь",
                "answers_question": "На какой вопрос отвечает"
            }},
            "priority": "P0/P1/P2",
            "effort": "S/M/L/XL"
        }}
    ],

    "strategic_recommendations": [
        {{
            "recommendation": "Конкретная рекомендация",
            "rationale": "Детальное обоснование на данных",
            "expected_outcome": "Конкретный результат",
            "timeline": "Точные сроки",
            "success_metrics": ["Метрика 1", "Метрика 2"]
        }}
    ]
}}

КРОСС-АНАЛИЗ:
{json.dumps(cross_analysis, ensure_ascii=False, indent=2)}"""

        response = self._make_api_call(prompt)
        findings_data = self._extract_json(response)
        
        return ResearchFindings(
            executive_summary=findings_data.get('executive_summary', ''),
            key_insights=findings_data.get('key_insights', []),
            behavioral_patterns=cross_analysis.get('common_patterns', []),
            user_segments=[],
            pain_points_map={},
            opportunities=findings_data.get('strategic_recommendations', []),
            recommendations=findings_data.get('strategic_recommendations', []),
            risks=[],
            personas=[]
        )
    
    def _make_api_call(self, prompt: str) -> str:
        """Выполнение API вызова с подсчетом статистики"""
        try:
            response = self.client.generate_content(prompt)
            self.api_calls += 1
            
            # Примерная оценка стоимости
            estimated_tokens = len(prompt.split()) * 1.3 + len(response.split()) * 1.3
            cost_estimate = self.client.estimate_cost(
                int(estimated_tokens * 0.7),  # Примерно 70% - ввод
                int(estimated_tokens * 0.3)   # Примерно 30% - вывод
            )
            self.total_cost += cost_estimate['total_cost']
            
            return response
            
        except Exception as e:
            print(f"❌ Ошибка API вызова: {e}")
            return "{}"
    
    def _extract_json(self, text: str) -> Union[Dict, List]:
        """Извлечение JSON из ответа API"""
        try:
            # Попытка 1: весь ответ - JSON
            try:
                return json.loads(text)
            except:
                pass
            
            # Попытка 2: JSON между ```json и ```
            json_match = re.search(r'```json\s*(.*?)\s*```', text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(1))
            
            # Попытка 3: JSON между { и }
            json_match = re.search(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(0))
            
            # Попытка 4: JSON массив между [ и ]
            json_match = re.search(r'\[[^\[\]]*(?:\[[^\[\]]*\][^\[\]]*)*\]', text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(0))
            
            print(f"⚠️ Не удалось извлечь JSON из ответа. Первые 200 символов: {text[:200]}")
            return {}
            
        except Exception as e:
            print(f"❌ Ошибка при извлечении JSON: {e}")
            return {}
