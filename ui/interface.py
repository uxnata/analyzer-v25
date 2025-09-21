#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Пользовательский интерфейс для UX анализатора в стиле Reporter Dashboard
"""

import os
import sys
from typing import List, Optional
from pathlib import Path

class UserInterface:
    """Пользовательский интерфейс для анализатора в стиле Reporter Dashboard"""
    
    def __init__(self):
        self.current_brief = ""
        self.transcripts = []
        self.analysis_result = None
        
        # Цвета и стили в стиле Reporter Dashboard
        self.colors = {
            'primary': '#030213',
            'secondary': '#ececf0',
            'accent': '#e9ebef',
            'muted': '#717182',
            'success': '#10b981',
            'warning': '#f59e0b',
            'danger': '#ef4444',
            'border': 'rgba(0, 0, 0, 0.1)',
            'background': '#ffffff',
            'card': '#ffffff'
        }
    
    def _print_header(self):
        """Красивый заголовок в стиле Reporter Dashboard"""
        print(f"\n{'='*60}")
        print(f"🔬 UX Analyzer V25.0 - OpenRouter Edition")
        print(f"{'='*60}")
        print(f"🎯 AI-powered analysis of your research data")
        print(f"{'='*60}\n")
    
    def _print_card(self, title: str, content: str, icon: str = "📋"):
        """Вывод карточки в стиле Card компонента"""
        print(f"\n{icon} {title}")
        print(f"{'─' * (len(title) + 2)}")
        print(f"{content}")
        print(f"{'─' * (len(title) + 2)}")
    
    def _print_metric(self, label: str, value: str, icon: str = "📊"):
        """Вывод метрики в стиле метрик из AnalysisScreen"""
        print(f"{icon} {label}: {value}")
    
    def _print_badge(self, text: str, variant: str = "default"):
        """Вывод бейджа в стиле Badge компонента"""
        colors = {
            'default': ('\033[38;5;240m', '\033[0m'),
            'success': ('\033[38;5;34m', '\033[0m'),
            'warning': ('\033[38;5;214m', '\033[0m'),
            'danger': ('\033[38;5;196m', '\033[0m'),
            'outline': ('\033[38;5;240m', '\033[0m')
        }
        
        color_start, color_end = colors.get(variant, colors['default'])
        print(f"{color_start}[{text}]{color_end}", end=" ")
    
    def _print_progress_bar(self, current: int, total: int, width: int = 40):
        """Вывод прогресс-бара в стиле Progress компонента"""
        filled = int(width * current / total)
        bar = '█' * filled + '░' * (width - filled)
        percentage = int(100 * current / total)
        print(f"[{bar}] {percentage}%")
    
    def run(self, analyzer, config):
        """Основной цикл интерфейса"""
        self._print_header()
        
        while True:
            self._show_main_menu()
            choice = input(f"\n{self.colors['primary']}Выберите действие (1-7):{self.colors['background']} ").strip()
            
            if choice == "1":
                self._load_brief(analyzer)
            elif choice == "2":
                self._load_transcripts()
            elif choice == "3":
                if self.transcripts and self.current_brief:
                    self._run_analysis(analyzer)
                else:
                    self._print_error("❌ Сначала загрузите бриф и транскрипты!")
            elif choice == "4":
                if self.analysis_result:
                    self._show_analysis_results()
                else:
                    self._print_error("❌ Сначала проведите анализ!")
            elif choice == "5":
                if self.analysis_result:
                    self._generate_reports(config)
                else:
                    self._print_error("❌ Сначала проведите анализ!")
            elif choice == "6":
                if self.analysis_result:
                    self._show_detailed_analysis()
                else:
                    self._print_error("❌ Сначала проведите анализ!")
            elif choice == "7":
                self._print_success("👋 До свидания!")
                break
            else:
                self._print_error("❌ Неверный выбор. Попробуйте снова.")
    
    def _show_main_menu(self):
        """Показать главное меню в стиле Reporter Dashboard"""
        print(f"\n{self.colors['primary']}📋 ГЛАВНОЕ МЕНЮ{self.colors['background']}")
        print(f"{'─' * 30}")
        
        menu_items = [
            "1. 📝 Загрузить бриф исследования",
            "2. 📁 Загрузить транскрипты", 
            "3. 🧠 Запустить анализ",
            "4. 📊 Показать результаты",
            "5. 📄 Сгенерировать отчеты",
            "6. 🔍 Детальный анализ",
            "7. 🚪 Выход"
        ]
        
        for item in menu_items:
            print(f"   {item}")
        
        # Показать текущий статус в стиле метрик
        print(f"\n{self.colors['muted']}📊 СТАТУС АНАЛИЗА:{self.colors['background']}")
        print(f"{'─' * 20}")
        
        status_items = [
            ("Бриф", "✅ Загружен" if self.current_brief else "❌ Не загружен"),
            ("Транскрипты", f"{len(self.transcripts)} шт."),
            ("Анализ", "✅ Завершен" if self.analysis_result else "❌ Не проведен")
        ]
        
        for label, value in status_items:
            self._print_metric(label, value, "📈")
    
    def _print_success(self, message: str):
        """Вывод успешного сообщения"""
        print(f"\n{self.colors['success']}✅ {message}{self.colors['background']}")
    
    def _print_error(self, message: str):
        """Вывод сообщения об ошибке"""
        print(f"\n{self.colors['danger']}❌ {message}{self.colors['background']}")
    
    def _print_warning(self, message: str):
        """Вывод предупреждения"""
        print(f"\n{self.colors['warning']}⚠️  {message}{self.colors['background']}")
    
    def _print_info(self, message: str):
        """Вывод информационного сообщения"""
        print(f"\n{self.colors['primary']}ℹ️  {message}{self.colors['background']}")
    
    def _load_brief(self, analyzer):
        """Загрузка брифа исследования"""
        self._print_card("ЗАГРУЗКА БРИФА ИССЛЕДОВАНИЯ", "Введите бриф или загрузите из файла")
        
        print(f"\n{self.colors['muted']}Пример структуры брифа:{self.colors['background']}")
        print("Цели:")
        print("  - Понять основные проблемы пользователей")
        print("  - Выявить возможности для улучшения")
        print("Вопросы:")
        print("  - Какие боли испытывают пользователи?")
        print("  - Что их мотивирует?")
        print("Аудитория: Пользователи мобильного приложения")
        print("Метрики: NPS, время выполнения задач")
        
        print(f"\n{self.colors['primary']}Введите бриф (или 'file' для загрузки из файла):{self.colors['background']}")
        brief_input = input().strip()
        
        if brief_input.lower() == 'file':
            file_path = input("Введите путь к файлу: ").strip()
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    brief_input = f.read()
                self._print_success("Файл загружен успешно!")
            except Exception as e:
                self._print_error(f"Ошибка при загрузке файла: {e}")
                return
        
        if brief_input.strip():
            success = analyzer.set_brief(brief_input)
            if success:
                self.current_brief = brief_input
                self._print_success("Бриф загружен успешно!")
                
                # Показать краткое описание
                summary = analyzer.brief_manager.get_brief_summary()
                self._print_card("КРАТКОЕ ОПИСАНИЕ БРИФА", summary, "📋")
            else:
                self._print_error("Ошибка при загрузке брифа!")
        else:
            self._print_error("Бриф не может быть пустым!")
    
    def _load_transcripts(self):
        """Загрузка транскриптов"""
        self._print_card("ЗАГРУЗКА ТРАНСКРИПТОВ", "Выберите способ загрузки")
        
        print(f"\n{self.colors['primary']}Выберите способ загрузки:{self.colors['background']}")
        print("1. 📝 Ввод вручную")
        print("2. 📁 Загрузка из файлов")
        print("3. 🎭 Демо данные")
        
        choice = input(f"\n{self.colors['primary']}Выберите (1-3):{self.colors['background']} ").strip()
        
        if choice == "1":
            self._load_transcripts_manual()
        elif choice == "2":
            self._load_transcripts_from_files()
        elif choice == "3":
            self._load_demo_transcripts()
        else:
            self._print_error("Неверный выбор!")
    
    def _load_transcripts_manual(self):
        """Загрузка транскриптов вручную"""
        self._print_card("ВВОД ТРАНСКРИПТОВ ВРУЧНУЮ", "Введите текст каждого интервью")
        
        self.transcripts = []
        transcript_num = 1
        
        while True:
            print(f"\n{self.colors['primary']}📝 Транскрипт #{transcript_num}{self.colors['background']}")
            print("Введите текст транскрипта (пустая строка + Enter для завершения ввода):")
            
            transcript_text = ""
            print("Введите текст:")
            
            while True:
                line = input()
                if line.strip() == "":
                    break
                transcript_text += line + "\n"
            
            if transcript_text.strip():
                self.transcripts.append(transcript_text.strip())
                self._print_success(f"Транскрипт #{transcript_num} добавлен ({len(transcript_text)} символов)")
                transcript_num += 1
            else:
                break
        
        self._print_success(f"Загружено {len(self.transcripts)} транскриптов")
    
    def _load_transcripts_from_files(self):
        """Загрузка транскриптов из файлов"""
        self._print_card("ЗАГРУЗКА ИЗ ФАЙЛОВ", "Укажите папку с текстовыми файлами")
        
        directory = input("Введите путь к папке с файлами: ").strip()
        
        if not os.path.exists(directory):
            self._print_error("Папка не найдена!")
            return
        
        # Поиск текстовых файлов
        text_extensions = ['.txt', '.md', '.doc', '.docx']
        found_files = []
        
        for ext in text_extensions:
            found_files.extend(Path(directory).glob(f"*{ext}"))
        
        if not found_files:
            self._print_error("Текстовые файлы не найдены!")
            return
        
        print(f"\n{self.colors['success']}📁 Найдено {len(found_files)} файлов:{self.colors['background']}")
        for i, file_path in enumerate(found_files, 1):
            print(f"   {i}. {file_path.name}")
        
        # Загрузка выбранных файлов
        self.transcripts = []
        for file_path in found_files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if content.strip():
                        self.transcripts.append(content.strip())
                        self._print_success(f"Загружен: {file_path.name}")
            except Exception as e:
                self._print_error(f"Ошибка при загрузке {file_path.name}: {e}")
        
        self._print_success(f"Загружено {len(self.transcripts)} транскриптов")
    
    def _load_demo_transcripts(self):
        """Загрузка демо транскриптов"""
        self._print_card("ЗАГРУЗКА ДЕМО ДАННЫХ", "Загружаем примеры интервью")
        
        demo_transcripts = [
            """Интервьюер: Расскажите о вашем опыте использования мобильного приложения.
Респондент: Ну, в целом удобно, но есть моменты, которые раздражают. Например, когда я пытаюсь заказать еду, процесс занимает слишком много времени. Мне нужно пройти через несколько экранов, выбрать ресторан, потом меню, потом корзину. Это утомляет. Я бы хотел, чтобы можно было сделать заказ в 2-3 клика.

Интервьюер: А что именно вас раздражает в этом процессе?
Респондент: Во-первых, медленная загрузка. Иногда приходится ждать по 10-15 секунд, пока загрузится меню. Во-вторых, неудобная навигация. Я часто теряюсь, где нахожусь в приложении. Хотелось бы видеть, на каком этапе заказа я нахожусь.

Интервьюер: Как вы обычно решаете эти проблемы?
Респондент: Я просто терплю. Альтернативы нет, все приложения для заказа еды работают примерно одинаково. Но если бы появилось что-то более удобное, я бы переключился.""",
            
            """Интервьюер: Опишите ваш типичный день использования приложения.
Респондент: Я пользуюсь приложением каждый день, в основном утром и вечером. Утром заказываю завтрак, вечером - ужин. Иногда заказываю обед, если не успеваю поесть в офисе.

Интервьюер: Какие функции вы используете чаще всего?
Респондент: В основном заказ еды и отслеживание доставки. Еще смотрю рейтинги ресторанов и читаю отзывы. Но отзывы часто бывают неактуальными или подозрительными.

Интервьюер: Что бы вы хотели улучшить в приложении?
Респондент: Хотелось бы, чтобы приложение запоминало мои предпочтения. Сейчас каждый раз приходится заново выбирать любимые блюда. Еще было бы здорово, если бы можно было заказывать еду на несколько дней вперед.""",
            
            """Интервьюер: Расскажите о проблемах, с которыми вы сталкиваетесь.
Респондент: Основная проблема - это нестабильная работа. Приложение часто зависает, особенно когда я пытаюсь оплатить заказ. Один раз я уже ввел данные карты, а приложение зависло. Пришлось перезапускать и вводить все заново.

Интервьюер: А что насчет дизайна интерфейса?
Респондент: Дизайн в целом понятный, но кнопки слишком маленькие. Мне сложно попадать по ним пальцем, особенно когда я в транспорте. Хотелось бы, чтобы кнопки были больше и располагались удобнее.

Интервьюер: Что вас больше всего устраивает в приложении?
Респондент: Мне нравится, что можно быстро найти ресторан рядом с домом или работой. Еще удобно, что можно отслеживать доставку в реальном времени. Но это все, что я могу отметить как положительное."""
        ]
        
        self.transcripts = demo_transcripts
        self._print_success("Загружено 3 демо транскрипта")
        
        print(f"\n{self.colors['info']}📝 Содержание:{self.colors['background']}")
        for i, transcript in enumerate(demo_transcripts, 1):
            print(f"   {i}. Интервью о мобильном приложении для заказа еды")
    
    def _run_analysis(self, analyzer):
        """Запуск анализа"""
        self._print_card("ЗАПУСК АНАЛИЗА", "Настройка и запуск AI-анализа")
        
        print(f"\n{self.colors['primary']}📊 Параметры анализа:{self.colors['background']}")
        print(f"   Бриф: {analyzer.brief_manager.get_brief_summary()}")
        print(f"   Транскрипты: {len(self.transcripts)} шт.")
        print(f"   Модель: {analyzer.client.model}")
        
        print(f"\n{self.colors['primary']}Выберите тип анализа:{self.colors['background']}")
        print("1. 🧠 Обычный анализ")
        print("2. ⚡ Параллельный анализ")
        
        choice = input(f"\n{self.colors['primary']}Выберите (1-2):{self.colors['background']} ").strip()
        
        confirm = input(f"\n{self.colors['warning']}Начать анализ? (y/n):{self.colors['background']} ").strip().lower()
        if confirm != 'y':
            self._print_info("Анализ отменен")
            return
        
        try:
            self._print_info("🚀 Запуск анализа...")
            
            # Показать прогресс
            print(f"\n{self.colors['primary']}📈 Прогресс анализа:{self.colors['background']}")
            self._print_progress_bar(0, 100)
            
            if choice == "2":
                self.analysis_result = analyzer.analyze_transcripts_parallel(self.transcripts)
            else:
                self.analysis_result = analyzer.analyze_transcripts(self.transcripts)
                
            self._print_success("Анализ завершен успешно!")
            
        except Exception as e:
            self._print_error(f"Ошибка при анализе: {e}")
            self.analysis_result = None
    
    def _show_analysis_results(self):
        """Показать результаты анализа в стиле AnalysisScreen"""
        if not self.analysis_result:
            self._print_error("Нет результатов для отображения!")
            return
        
        self._print_card("РЕЗУЛЬТАТЫ АНАЛИЗА", "Ключевые метрики и находки")
        
        result = self.analysis_result
        
        # Основные метрики
        print(f"\n{self.colors['primary']}📈 ОБЩАЯ СТАТИСТИКА:{self.colors['background']}")
        print(f"{'─' * 25}")
        
        metrics = [
            ("Интервью проанализировано", str(result.total_interviews)),
            ("Время анализа", f"{result.analysis_duration:.1f} сек"),
            ("API вызовов", str(result.api_calls)),
            ("Примерная стоимость", f"${result.total_cost:.4f}")
        ]
        
        for label, value in metrics:
            self._print_metric(label, value, "📊")
        
        if result.research_findings:
            findings = result.research_findings
            print(f"\n{self.colors['primary']}🔍 КЛЮЧЕВЫЕ НАХОДКИ:{self.colors['background']}")
            print(f"{'─' * 25}")
            
            findings_metrics = [
                ("Инсайтов", str(len(findings.key_insights))),
                ("Паттернов", str(len(findings.behavioral_patterns))),
                ("Рекомендаций", str(len(findings.recommendations)))
            ]
            
            for label, value in findings_metrics:
                self._print_metric(label, value, "💡")
            
            if findings.executive_summary:
                print(f"\n{self.colors['primary']}📋 КРАТКОЕ РЕЗЮМЕ:{self.colors['background']}")
                print(f"{'─' * 20}")
                print(f"{findings.executive_summary[:200]}...")
        
        print(f"\n{self.colors['primary']}📝 ДЕТАЛИ ПО ИНТЕРВЬЮ:{self.colors['background']}")
        print(f"{'─' * 25}")
        
        for i, summary in enumerate(result.interview_summaries, 1):
            print(f"\n   {i}. Интервью #{summary.interview_id}")
            interview_metrics = [
                ("Боли", str(len(summary.pain_points))),
                ("Потребности", str(len(summary.needs))),
                ("Цитаты", str(len(summary.quotes))),
                ("Sentiment", f"{summary.sentiment_score:.2f}")
            ]
            
            for label, value in interview_metrics:
                self._print_metric(f"     {label}", value, "📊")
    
    def _show_detailed_analysis(self):
        """Показать детальный анализ"""
        if not self.analysis_result:
            self._print_error("Нет результатов для отображения!")
            return
        
        self._print_card("ДЕТАЛЬНЫЙ АНАЛИЗ", "Глубокий анализ по разделам")
        
        while True:
            print(f"\n{self.colors['primary']}Выберите раздел для детального просмотра:{self.colors['background']}")
            print("1. 📊 Ключевые инсайты")
            print("2. 😤 Точки боли")
            print("3. 🎯 Потребности")
            print("4. 💬 Цитаты")
            print("5. 🔄 Поведенческие паттерны")
            print("6. 📈 Бизнес-аспекты")
            print("7. 🔙 Назад")
            
            choice = input(f"\n{self.colors['primary']}Выберите (1-7):{self.colors['background']} ").strip()
            
            if choice == "1":
                self._show_key_insights()
            elif choice == "2":
                self._show_pain_points()
            elif choice == "3":
                self._show_needs()
            elif choice == "4":
                self._show_quotes()
            elif choice == "5":
                self._show_behavioral_patterns()
            elif choice == "6":
                self._show_business_aspects()
            elif choice == "7":
                break
            else:
                self._print_error("Неверный выбор!")
    
    def _show_key_insights(self):
        """Показать ключевые инсайты"""
        if not self.analysis_result.research_findings:
            self._print_error("Нет данных об инсайтах!")
            return
        
        insights = self.analysis_result.research_findings.key_insights
        if not insights:
            self._print_error("Инсайты не найдены!")
            return
        
        self._print_card(f"КЛЮЧЕВЫЕ ИНСАЙТЫ ({len(insights)} шт.)", "Детальный анализ инсайтов")
        
        for i, insight in enumerate(insights, 1):
            print(f"\n{self.colors['primary']}{i}. {insight.get('problem_title', 'Инсайт')}{self.colors['background']}")
            print(f"{'─' * 40}")
            
            insight_data = [
                ("Серьезность", insight.get('severity', 'N/A')),
                ("Затронуто", insight.get('affected_percentage', 'N/A')),
                ("Приоритет", insight.get('priority', 'N/A'))
            ]
            
            for label, value in insight_data:
                self._print_metric(f"   {label}", value, "📊")
            
            description = insight.get('problem_description', 'N/A')
            print(f"\n   Описание: {description[:200]}...")
    
    def _show_pain_points(self):
        """Показать точки боли"""
        all_pains = []
        for summary in self.analysis_result.interview_summaries:
            all_pains.extend(summary.pain_points or [])
        
        if not all_pains:
            self._print_error("Точки боли не найдены!")
            return
        
        self._print_card(f"ТОЧКИ БОЛИ ({len(all_pains)} шт.)", "Анализ проблем пользователей")
        
        # Группировка по серьезности
        severity_groups = {'critical': [], 'high': [], 'medium': [], 'low': []}
        for pain in all_pains:
            severity = pain.get('severity', 'medium')
            if severity in severity_groups:
                severity_groups[severity].append(pain)
        
        for severity, pains in severity_groups.items():
            if not pains:
                continue
            
            severity_name = {
                'critical': 'Критические',
                'high': 'Высокие',
                'medium': 'Средние',
                'low': 'Низкие'
            }.get(severity, severity)
            
            print(f"\n{self.colors['primary']}{severity_name.upper()} проблемы ({len(pains)} шт.):{self.colors['background']}")
            print(f"{'─' * 40}")
            
            for i, pain in enumerate(pains[:3], 1):  # Показываем максимум 3
                print(f"\n   {i}. {pain.get('pain', 'Описание недоступно')[:100]}...")
                
                pain_data = [
                    ("Тип", pain.get('pain_type', 'N/A')),
                    ("Контекст", pain.get('context', 'N/A')[:80] + "..." if len(pain.get('context', '')) > 80 else pain.get('context', 'N/A'))
                ]
                
                for label, value in pain_data:
                    if value != 'N/A':
                        self._print_metric(f"      {label}", value, "📊")
    
    def _show_needs(self):
        """Показать потребности"""
        all_needs = []
        for summary in self.analysis_result.interview_summaries:
            all_needs.extend(summary.needs or [])
        
        if not all_needs:
            self._print_error("Потребности не найдены!")
            return
        
        self._print_card(f"ПОТРЕБНОСТИ ({len(all_needs)} шт.)", "Анализ потребностей пользователей")
        
        for i, need in enumerate(all_needs[:5], 1):  # Максимум 5
            print(f"\n{self.colors['primary']}{i}. {need.get('need', 'Описание недоступно')}{self.colors['background']}")
            print(f"{'─' * 40}")
            
            need_data = [
                ("Тип", need.get('need_type', 'N/A')),
                ("Важность", need.get('importance', 'N/A')),
                ("Job to be done", need.get('job_to_be_done', 'N/A')[:80] + "..." if len(need.get('job_to_be_done', '')) > 80 else need.get('job_to_be_done', 'N/A'))
            ]
            
            for label, value in need_data:
                if value != 'N/A':
                    self._print_metric(f"   {label}", value, "📊")
    
    def _show_quotes(self):
        """Показать цитаты"""
        all_quotes = []
        for summary in self.analysis_result.interview_summaries:
            all_quotes.extend(summary.quotes or [])
        
        if not all_quotes:
            self._print_error("Цитаты не найдены!")
            return
        
        self._print_card(f"ЦИТАТЫ ({len(all_quotes)} шт.)", "Ключевые высказывания пользователей")
        
        for i, quote in enumerate(all_quotes[:3], 1):  # Максимум 3
            print(f"\n{self.colors['primary']}{i}. Цитата{self.colors['background']}")
            print(f"{'─' * 20}")
            
            quote_text = quote.get('text', 'Текст недоступен')
            print(f"   {quote_text[:150]}...")
            
            quote_data = [
                ("Контекст", quote.get('context', 'N/A')[:80] + "..." if len(quote.get('context', '')) > 80 else quote.get('context', 'N/A')),
                ("Значимость", quote.get('significance', 'N/A')[:80] + "..." if len(quote.get('significance', '')) > 80 else quote.get('significance', 'N/A'))
            ]
            
            for label, value in quote_data:
                if value != 'N/A':
                    self._print_metric(f"   {label}", value, "📊")
    
    def _show_behavioral_patterns(self):
        """Показать поведенческие паттерны"""
        if not self.analysis_result.research_findings:
            self._print_error("Нет данных о паттернах!")
            return
        
        patterns = self.analysis_result.research_findings.behavioral_patterns
        if not patterns:
            self._print_error("Поведенческие паттерны не найдены!")
            return
        
        self._print_card(f"ПОВЕДЕНЧЕСКИЕ ПАТТЕРНЫ ({len(patterns)} шт.)", "Анализ поведенческих моделей")
        
        for i, pattern in enumerate(patterns, 1):
            print(f"\n{self.colors['primary']}{i}. Паттерн{self.colors['background']}")
            print(f"{'─' * 20}")
            
            pattern_data = [
                ("Тип", pattern.get('pattern_type', 'N/A')),
                ("Частота", pattern.get('frequency', 'N/A')),
                ("Сила", pattern.get('strength', 'N/A'))
            ]
            
            for label, value in pattern_data:
                if value != 'N/A':
                    self._print_metric(f"   {label}", value, "📊")
            
            description = pattern.get('pattern', 'Описание недоступно')
            print(f"\n   Описание: {description[:100]}...")
    
    def _show_business_aspects(self):
        """Показать бизнес-аспекты"""
        all_business_pains = []
        all_opportunities = []
        
        for summary in self.analysis_result.interview_summaries:
            all_business_pains.extend(summary.business_pains or [])
            all_opportunities.extend(summary.opportunities or [])
        
        self._print_card("БИЗНЕС-АСПЕКТЫ", "Анализ бизнес-влияния и возможностей")
        
        if all_business_pains:
            print(f"\n{self.colors['primary']}😤 Бизнес-проблемы ({len(all_business_pains)} шт.):{self.colors['background']}")
            print(f"{'─' * 40}")
            
            for i, pain in enumerate(all_business_pains[:3], 1):
                print(f"\n   {i}. {pain.get('pain', 'Описание недоступно')[:100]}...")
                urgency = pain.get('urgency', 'N/A')
                if urgency != 'N/A':
                    self._print_metric(f"      Срочность", urgency, "📊")
        
        if all_opportunities:
            print(f"\n{self.colors['primary']}🚀 Возможности ({len(all_opportunities)} шт.):{self.colors['background']}")
            print(f"{'─' * 30}")
            
            for i, opp in enumerate(all_opportunities[:3], 1):
                print(f"\n   {i}. {opp.get('opportunity', 'Описание недоступно')[:100]}...")
                opp_type = opp.get('opportunity_type', 'N/A')
                if opp_type != 'N/A':
                    self._print_metric(f"      Тип", opp_type, "📊")
    
    def _generate_reports(self, config):
        """Генерация отчетов"""
        self._print_card("ГЕНЕРАЦИЯ ОТЧЕТОВ", "Создание отчетов в различных форматах")
        
        if not self.analysis_result:
            self._print_error("Нет результатов для генерации отчетов!")
            return
        
        print(f"\n{self.colors['primary']}Выберите формат отчета:{self.colors['background']}")
        print("1. 🌐 HTML отчет")
        print("2. 📄 DOCX отчет")
        print("3. 📋 PDF отчет")
        print("4. 🔧 JSON данные")
        print("5. 📝 Текстовый отчет")
        
        choice = input(f"\n{self.colors['primary']}Выберите (1-5):{self.colors['background']} ").strip()
        
        if choice == "1":
            self._generate_html_report(config)
        elif choice == "2":
            self._generate_docx_report(config)
        elif choice == "3":
            self._generate_pdf_report(config)
        elif choice == "4":
            self._generate_json_report()
        elif choice == "5":
            self._generate_text_report()
        else:
            self._print_error("Неверный выбор!")
    
    def _generate_html_report(self, config):
        """Генерация HTML отчета"""
        self._print_info("📄 Генерация HTML отчета...")
        
        try:
            from core.report_generator import ReportGenerator
            
            generator = ReportGenerator(config)
            html_content = generator.generate_html(self.analysis_result)
            
            # Сохранение файла
            output_file = "ux_analysis_report.html"
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            self._print_success(f"HTML отчет сохранен: {output_file}")
            
        except ImportError:
            self._print_error("Модуль генерации отчетов не найден!")
        except Exception as e:
            self._print_error(f"Ошибка при генерации отчета: {e}")
    
    def _generate_docx_report(self, config):
        """Генерация DOCX отчета"""
        self._print_info("📄 Генерация DOCX отчета...")
        
        try:
            from core.report_generator import ReportGenerator
            
            generator = ReportGenerator(config)
            output_file = generator.generate_docx(self.analysis_result)
            
            if output_file:
                self._print_success(f"DOCX отчет сохранен: {output_file}")
            else:
                self._print_error("Не удалось сгенерировать DOCX отчет")
            
        except ImportError:
            self._print_error("Модуль генерации отчетов не найден!")
        except Exception as e:
            self._print_error(f"Ошибка при генерации отчета: {e}")
    
    def _generate_pdf_report(self, config):
        """Генерация PDF отчета"""
        self._print_info("📄 Генерация PDF отчета...")
        
        try:
            from core.report_generator import ReportGenerator
            
            generator = ReportGenerator(config)
            html_content = generator.generate_html(self.analysis_result)
            output_file = generator.generate_pdf(html_content)
            
            if output_file:
                self._print_success(f"PDF отчет сохранен: {output_file}")
            else:
                self._print_error("Не удалось сгенерировать PDF отчет")
            
        except ImportError:
            self._print_error("Модуль генерации отчетов не найден!")
        except Exception as e:
            self._print_error(f"Ошибка при генерации отчета: {e}")
    
    def _generate_json_report(self):
        """Генерация JSON отчета"""
        self._print_info("📄 Генерация JSON отчета...")
        
        try:
            import json
            
            # Подготовка данных для JSON
            report_data = {
                'analysis_metadata': {
                    'total_interviews': self.analysis_result.total_interviews,
                    'analysis_duration': self.analysis_result.analysis_duration,
                    'api_calls': self.analysis_result.api_calls,
                    'total_cost': self.analysis_result.total_cost
                },
                'interview_summaries': [
                    {
                        'interview_id': s.interview_id,
                        'pain_points': s.pain_points,
                        'needs': s.needs,
                        'quotes': s.quotes,
                        'sentiment_score': s.sentiment_score
                    }
                    for s in self.analysis_result.interview_summaries
                ]
            }
            
            if self.analysis_result.research_findings:
                report_data['research_findings'] = {
                    'executive_summary': self.analysis_result.research_findings.executive_summary,
                    'key_insights': self.analysis_result.research_findings.key_insights,
                    'recommendations': self.analysis_result.research_findings.recommendations
                }
            
            # Сохранение файла
            output_file = "ux_analysis_report.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(report_data, f, ensure_ascii=False, indent=2)
            
            self._print_success(f"JSON отчет сохранен: {output_file}")
            
        except Exception as e:
            self._print_error(f"Ошибка при генерации JSON: {e}")
    
    def _generate_text_report(self):
        """Генерация текстового отчета"""
        self._print_info("📄 Генерация текстового отчета...")
        
        try:
            output_file = "ux_analysis_report.txt"
            
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write("UX АНАЛИЗ ОТЧЕТ\n")
                f.write("=" * 50 + "\n\n")
                
                f.write(f"ОБЩАЯ СТАТИСТИКА:\n")
                f.write(f"- Интервью проанализировано: {self.analysis_result.total_interviews}\n")
                f.write(f"- Время анализа: {self.analysis_result.analysis_duration:.1f} сек\n")
                f.write(f"- API вызовов: {self.analysis_result.api_calls}\n")
                f.write(f"- Примерная стоимость: ${self.analysis_result.total_cost:.4f}\n\n")
                
                if self.analysis_result.research_findings:
                    findings = self.analysis_result.research_findings
                    f.write("КЛЮЧЕВЫЕ НАХОДКИ:\n")
                    f.write(f"- {len(findings.key_insights)} инсайтов\n")
                    f.write(f"- {len(findings.behavioral_patterns)} паттернов\n")
                    f.write(f"- {len(findings.recommendations)} рекомендаций\n\n")
                    
                    if findings.executive_summary:
                        f.write("КРАТКОЕ РЕЗЮМЕ:\n")
                        f.write(f"{findings.executive_summary}\n\n")
                
                f.write("ДЕТАЛИ ПО ИНТЕРВЬЮ:\n")
                for i, summary in enumerate(self.analysis_result.interview_summaries, 1):
                    f.write(f"\n{i}. Интервью #{summary.interview_id}\n")
                    f.write(f"   Боли: {len(summary.pain_points)}\n")
                    f.write(f"   Потребности: {len(summary.needs)}\n")
                    f.write(f"   Цитаты: {len(summary.quotes)}\n")
                    f.write(f"   Sentiment: {summary.sentiment_score:.2f}\n")
            
            self._print_success(f"Текстовый отчет сохранен: {output_file}")
            
        except Exception as e:
            self._print_error(f"Ошибка при генерации текстового отчета: {e}")
