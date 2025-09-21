#!/usr/bin/env python3
import docx
import json
import sys

def read_docx(file_path):
    """Читает содержимое DOCX файла"""
    try:
        doc = docx.Document(file_path)
        text = '\n'.join([p.text for p in doc.paragraphs if p.text.strip()])
        return text
    except Exception as e:
        print(f"Ошибка чтения {file_path}: {e}")
        return ""

def main():
    # Читаем бриф
    brief_path = "brief_final.docx"
    brief_text = read_docx(brief_path)
    print(f"📝 Бриф ({len(brief_text)} символов):")
    print(brief_text[:200] + "..." if len(brief_text) > 200 else brief_text)
    print()
    
    # Читаем 3 транскрипта для теста
    transcript_files = [
        "/Users/natalakumpan/Desktop/test_transcripts/fam_int_5.docx",
        "/Users/natalakumpan/Desktop/test_transcripts/flower_elena_45_int_2.docx", 
        "/Users/natalakumpan/Desktop/test_transcripts/it_alex_32_int6.docx"
    ]
    
    transcripts = []
    for file_path in transcript_files:
        text = read_docx(file_path)
        if text:
            transcripts.append(text)
            print(f"🎤 {file_path.split('/')[-1]} ({len(text)} символов):")
            print(text[:200] + "..." if len(text) > 200 else text)
            print()
    
    # Сохраняем данные для тестирования API
    test_data = {
        "brief": brief_text,
        "transcripts": transcripts
    }
    
    with open("test_data.json", "w", encoding="utf-8") as f:
        json.dump(test_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Данные сохранены в test_data.json")
    print(f"📊 Всего: бриф ({len(brief_text)} символов), {len(transcripts)} транскриптов")

if __name__ == "__main__":
    main()
