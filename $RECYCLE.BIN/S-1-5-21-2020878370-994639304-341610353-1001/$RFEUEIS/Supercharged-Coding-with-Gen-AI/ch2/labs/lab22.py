import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Tự động tìm và nạp các biến từ file .env vào hệ thống
load_dotenv()

if __name__ == "__main__":
    # Bây giờ Client() sẽ tự động thấy GEMINI_API_KEY
    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="What is the Two Sum problem?",
        config=types.GenerateContentConfig(
            system_instruction="You are a hiring manager at a tech company.",
            temperature=0.2,
            max_output_tokens=100,
            candidate_count=1
        )
    )

    completion_tokens = response.usage_metadata.candidates_token_count
    
    print("Completion Tokens: ", completion_tokens)
    print("Output: ", response.text)