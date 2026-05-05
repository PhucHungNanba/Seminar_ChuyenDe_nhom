import os
from dotenv import load_dotenv
from google import genai

# Hàm này sẽ tự động tìm file .env trong thư mục và nạp các biến vào hệ thống
load_dotenv()

if __name__ == "__main__":
    # Khởi tạo client. 
    # Nhờ có load_dotenv() ở trên, Client sẽ tự động thấy được GEMINI_API_KEY
    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="What is the FizzBuzz problem?"
    )

    print(response.text)