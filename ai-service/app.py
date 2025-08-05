from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoModelForCausalLM, AutoTokenizer, AutoModelForSeq2SeqLM
import torch

app = Flask(__name__)
CORS(app)

# Load MEDITRON model
model_name = "epfl-llm/meditron-7b"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    device_map="auto",
    torch_dtype="auto"
)

# Load translation models
src_to_en_model = "facebook/nllb-200-distilled-600M"
translator_tokenizer = AutoTokenizer.from_pretrained(src_to_en_model)
translator_model = AutoModelForSeq2SeqLM.from_pretrained(src_to_en_model)

def translate_to_en(text, src_lang="amh"):
    inputs = translator_tokenizer(text, return_tensors="pt", padding=True)
    translated = translator_model.generate(**inputs, forced_bos_token_id=translator_tokenizer.lang_code_to_id["eng_Latn"])
    return translator_tokenizer.decode(translated[0], skip_special_tokens=True)

def translate_from_en(text, tgt_lang="amh"):
    inputs = translator_tokenizer(text, return_tensors="pt", padding=True)
    translated = translator_model.generate(**inputs, forced_bos_token_id=translator_tokenizer.lang_code_to_id[f"{tgt_lang}_Latn"])
    return translator_tokenizer.decode(translated[0], skip_special_tokens=True)

@app.route('/translate-chat', methods=['POST'])
def translate_chat():
    data = request.json
    user_question = data.get('message')
    src_lang = data.get('src_lang', 'amh')

    english_question = translate_to_en(user_question, src_lang)
    print("Translated to English:", english_question)

    inputs = tokenizer(english_question, return_tensors="pt").to(model.device)
    outputs = model.generate(**inputs, max_new_tokens=200, do_sample=True, temperature=0.7)
    english_answer = tokenizer.decode(outputs[0], skip_special_tokens=True)

    local_answer = translate_from_en(english_answer, src_lang)
    return jsonify({'response': local_answer})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
