from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer, util
import re

app = Flask(__name__)
CORS(app)

print("🧠 Loading BERT Transformer Model into memory...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("✅ NLP Model successfully initialized!")

def extract_skills(text):
    skills_database = [
        "python", "javascript", "react", "node", "express", "html", "css", 
        "sql", "mongodb", "git", "aws", "docker", "machine learning", 
        "nlp", "bert", "flask", "fastapi", "java", "vscode", "typescript",
        "tailwind", "rest api", "full-stack", "frontend", "backend"
    ]
    found_skills = set()
    text_lower = text.lower()
    for skill in skills_database:
        if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
            found_skills.add(skill)
    return found_skills

@app.route('/process-job', methods=['POST'])
def process_job():
    try:
        data = request.get_json()
        resume_text = data.get('resume_text', '')
        job_desc = data.get('job_description', '')

        if not resume_text or not job_desc:
            return jsonify({"status": "error", "message": "Missing input text fields"}), 400

        # 1. BERT Context Alignment
        embedding_resume = model.encode(resume_text, convert_to_tensor=True)
        embedding_jd = model.encode(job_desc, convert_to_tensor=True)
        cosine_sim = util.cos_sim(embedding_resume, embedding_jd).item()
        full_match_score = max(0, min(100, int(cosine_sim * 100)))

        # 2. Hard Skills Extract & Comparison 🌟
        resume_skills = extract_skills(resume_text)
        job_skills = extract_skills(job_desc)
        
        matching_skills = resume_skills.intersection(job_skills)
        missing_skills = job_skills.difference(resume_skills)
        
        if job_skills:
            skills_match_score = int((len(matching_skills) / len(job_skills)) * 100)
        else:
            skills_match_score = 100

        return jsonify({
            "status": "success",
            "full_match_score": full_match_score,
            "skills_match_score": skills_match_score,
            "matched_skills": list(matching_skills),  # Send lists back up the pipeline
            "missing_skills": list(missing_skills)
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8000, debug=False)