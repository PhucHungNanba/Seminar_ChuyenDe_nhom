import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY", "")
genai.configure(api_key=api_key)

async def extract_medicines_from_image(image_bytes: bytes, mime_type: str) -> list:
    """
    Sử dụng Gemini API để đọc ảnh và trích xuất danh sách thuốc.
    """
    prompt = """
    Hãy đọc đơn thuốc này và trả về định dạng JSON nghiêm ngặt gồm mảng các object có 'medicine_name' và 'quantity'.
    Chỉ trả về JSON hợp lệ, không có markdown formatting hay văn bản giải thích.
    """
    
    # Sử dụng model hỗ trợ vision
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    image_parts = [
        {
            "mime_type": mime_type,
            "data": image_bytes
        }
    ]
    
    response = model.generate_content([prompt, image_parts[0]])
    text_response = response.text
    
    # Parse JSON
    text_response = text_response.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    
    try:
        data = json.loads(text_response)
        if isinstance(data, list):
            return data
        elif isinstance(data, dict) and "medicines" in data:
            return data["medicines"]
        return []
    except json.JSONDecodeError:
        print("Lỗi parse JSON từ Gemini:", text_response)
        return []
