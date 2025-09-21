#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Модели данных для UX анализатора
"""

from dataclasses import dataclass, field
from typing import Dict, List, Any, Optional, Union

@dataclass
class RespondentProfile:
    """Профиль респондента"""
    demographics: str = ""
    occupation: str = ""
    experience_level: str = ""
    context: str = ""
    tech_literacy: str = ""
    motivations: List[str] = field(default_factory=list)
    unique_traits: List[str] = field(default_factory=list)
    archetype: str = ""

@dataclass
class KeyTheme:
    """Ключевая тема интервью"""
    theme: str = ""
    description: str = ""
    frequency: str = ""
    importance: str = ""
    quotes: List[str] = field(default_factory=list)
    emotional_tone: str = ""
    relevance_to_brief: str = ""

@dataclass
class PainPoint:
    """Точка боли пользователя"""
    pain: str = ""
    pain_type: str = ""
    root_cause: str = ""
    symptoms: List[str] = field(default_factory=list)
    context: str = ""
    severity: str = "medium"
    frequency: str = ""
    impact: str = ""
    current_solution: str = ""
    ideal_solution: str = ""
    quotes: List[str] = field(default_factory=list)
    emotional_impact: str = ""
    relevance_to_brief: str = ""

@dataclass
class UserNeed:
    """Потребность пользователя"""
    need: str = ""
    need_type: str = ""
    job_to_be_done: str = ""
    current_satisfaction: str = ""
    importance: str = "medium"
    triggers: List[str] = field(default_factory=list)
    barriers: List[str] = field(default_factory=list)
    success_criteria: str = ""
    quotes: List[str] = field(default_factory=list)
    related_pains: List[str] = field(default_factory=list)
    relevance_to_brief: str = ""

@dataclass
class EmotionalMoment:
    """Эмоциональный момент"""
    moment: str = ""
    trigger: str = ""
    emotion: str = ""
    emotion_family: str = ""
    intensity: int = 5
    valence: str = ""
    duration: str = ""
    body_language: str = ""
    quote: str = ""
    coping: str = ""
    impact: str = ""
    underlying_need: str = ""
    relevance_to_brief: str = ""

@dataclass
class Insight:
    """Инсайт из анализа"""
    insight: str = ""
    insight_type: str = ""
    confidence: str = "medium"
    evidence: List[str] = field(default_factory=list)
    contradiction: str = ""
    hidden_motivation: str = ""
    design_opportunity: str = ""
    business_impact: str = ""
    quotes: List[str] = field(default_factory=list)
    relevance_to_brief: str = ""

@dataclass
class Quote:
    """Цитата из интервью"""
    text: str = ""
    context: str = ""
    significance: str = ""
    reveals: Dict[str, str] = field(default_factory=dict)
    emotions: List[str] = field(default_factory=list)
    keywords: List[str] = field(default_factory=list)
    quote_type: str = ""
    usability: str = ""
    relevance_to_questions: str = ""

@dataclass
class Contradiction:
    """Противоречие в интервью"""
    contradiction_type: str = ""
    severity: str = "medium"
    statement_1: Dict[str, str] = field(default_factory=dict)
    statement_2: Dict[str, str] = field(default_factory=dict)
    analysis: Dict[str, Any] = field(default_factory=dict)
    implications: Dict[str, str] = field(default_factory=dict)
    full_quotes: List[str] = field(default_factory=list)

@dataclass
class InterviewSummary:
    """Саммари интервью"""
    interview_id: int
    respondent_profile: Dict[str, Any] = field(default_factory=dict)
    key_themes: List[Dict[str, Any]] = field(default_factory=list)
    pain_points: List[Dict[str, Any]] = field(default_factory=list)
    needs: List[Dict[str, Any]] = field(default_factory=list)
    insights: List[str] = field(default_factory=list)
    emotional_journey: List[Dict[str, Any]] = field(default_factory=list)
    contradictions: List[str] = field(default_factory=list)
    quotes: List[Dict[str, Any]] = field(default_factory=list)
    business_pains: List[Dict[str, Any]] = field(default_factory=list)
    user_problems: List[Dict[str, Any]] = field(default_factory=list)
    opportunities: List[str] = field(default_factory=list)
    sentiment_score: float = 0.0
    brief_related_findings: Dict[str, Any] = field(default_factory=dict)

@dataclass
class BehavioralPattern:
    """Поведенческий паттерн"""
    pattern_id: str = ""
    pattern: str = ""
    description: str = ""
    pattern_type: str = ""
    frequency: str = ""
    strength: str = "medium"
    evidence: List[Dict[str, Any]] = field(default_factory=list)
    behavioral_sequence: List[str] = field(default_factory=list)
    triggers: List[Dict[str, Any]] = field(default_factory=list)
    emotional_journey: List[Dict[str, Any]] = field(default_factory=list)
    cost_to_user: Dict[str, str] = field(default_factory=dict)
    business_implications: Dict[str, str] = field(default_factory=dict)
    design_implications: Dict[str, str] = field(default_factory=dict)
    relevance_to_brief: Dict[str, List[str]] = field(default_factory=dict)
    representative_quotes: List[str] = field(default_factory=list)

@dataclass
class UserSegment:
    """Сегмент пользователей"""
    segment_id: str = ""
    name: str = ""
    description: str = ""
    size: str = ""
    demographics: Dict[str, str] = field(default_factory=dict)
    psychographics: Dict[str, Any] = field(default_factory=dict)
    behavioral_traits: Dict[str, Any] = field(default_factory=dict)
    pain_points: List[str] = field(default_factory=list)
    needs: List[str] = field(default_factory=list)
    opportunities: List[str] = field(default_factory=list)
    interview_ids: List[int] = field(default_factory=list)
    representative_quotes: List[str] = field(default_factory=list)
    alignment_with_brief: Dict[str, str] = field(default_factory=dict)

@dataclass
class Persona:
    """Персона пользователя"""
    persona_id: str = ""
    name: str = ""
    based_on_interviews: List[int] = field(default_factory=list)
    tagline: str = ""
    description: str = ""
    demographics: Dict[str, str] = field(default_factory=dict)
    real_life_context: Dict[str, str] = field(default_factory=dict)
    personality_traits: List[str] = field(default_factory=list)
    goals: List[str] = field(default_factory=list)
    frustrations: List[str] = field(default_factory=list)
    needs: List[str] = field(default_factory=list)
    tech_behavior: Dict[str, str] = field(default_factory=dict)
    real_quotes: List[str] = field(default_factory=list)
    typical_scenario: str = ""
    day_in_life: str = ""
    decision_factors: List[str] = field(default_factory=list)
    unique_details: List[str] = field(default_factory=list)
    pain_point_quotes: List[str] = field(default_factory=list)
    solution_preferences: str = ""
    alignment_with_target: Dict[str, str] = field(default_factory=dict)

@dataclass
class KeyInsight:
    """Ключевой инсайт"""
    insight_id: str = ""
    problem_title: str = ""
    problem_statement: str = ""
    problem_description: str = ""
    severity: str = "medium"
    affected_percentage: str = ""
    business_impact: Dict[str, str] = field(default_factory=dict)
    root_cause: str = ""
    evidence: List[str] = field(default_factory=list)
    quotes: List[Dict[str, Any]] = field(default_factory=list)
    opportunity: Dict[str, str] = field(default_factory=dict)
    relevance_to_brief: Dict[str, Any] = field(default_factory=dict)
    priority: str = "P2"
    effort: str = "M"

@dataclass
class Recommendation:
    """Рекомендация"""
    title: str = ""
    description: str = ""
    based_on_insights: List[str] = field(default_factory=list)
    user_quotes_supporting: List[str] = field(default_factory=list)
    implementation_steps: List[str] = field(default_factory=list)
    expected_impact: str = ""
    affected_problems: List[str] = field(default_factory=list)
    timeline: str = ""
    resources_needed: str = ""
    success_metrics: List[str] = field(default_factory=list)
    risks: List[str] = field(default_factory=list)
    dependencies: List[str] = field(default_factory=list)
    user_validation: str = ""

@dataclass
class ResearchFindings:
    """Результаты исследования"""
    executive_summary: str = ""
    key_insights: List[Dict[str, Any]] = field(default_factory=list)
    behavioral_patterns: List[Dict[str, Any]] = field(default_factory=list)
    user_segments: List[Dict[str, Any]] = field(default_factory=list)
    pain_points_map: Dict[str, List[Dict[str, Any]]] = field(default_factory=dict)
    opportunities: List[Dict[str, Any]] = field(default_factory=list)
    recommendations: List[Dict[str, Any]] = field(default_factory=list)
    risks: List[Dict[str, Any]] = field(default_factory=list)
    personas: List[Dict[str, Any]] = field(default_factory=list)
    current_metrics: Dict[str, Any] = field(default_factory=dict)
    brief_answers: Dict[str, Any] = field(default_factory=dict)
    goal_achievement: Dict[str, Any] = field(default_factory=dict)

@dataclass
class AnalysisMetrics:
    """Метрики анализа"""
    total_interviews: int = 0
    total_pain_points: int = 0
    total_needs: int = 0
    total_quotes: int = 0
    avg_sentiment: float = 0.0
    most_common_pain: str = ""
    most_common_need: str = ""
    analysis_duration: float = 0.0
    api_calls: int = 0
    estimated_cost: float = 0.0
