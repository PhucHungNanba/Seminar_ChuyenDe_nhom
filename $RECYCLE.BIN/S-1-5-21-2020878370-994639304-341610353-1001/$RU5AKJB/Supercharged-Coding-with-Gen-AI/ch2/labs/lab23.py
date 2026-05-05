import re
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

USER_PROMPT = """
def print_fibonacci_sequence(n: int) -> None:
"""
SYSTEM_PROMPT = ("You will be provided with a Python function signature. Your task is to implement the function. Return "
                 "code only.")


def get_code_with_instructions(code: str) -> str:
    """
    Add a comment to the code for specific code completion instruction
    :param code: Python code as string
    :return: The code with additional instruction - "Complete this code"
    """

    return code + "\n# Complete this code"


if __name__ == "__main__":
    # Tự động nạp biến môi trường từ file .env
    load_dotenv()

    # Khởi tạo client, tự động đọc GEMINI_API_KEY
    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=get_code_with_instructions(USER_PROMPT),
        config=types.GenerateContentConfig(
            # Đưa các vai trò system vào một mảng (list)
            system_instruction=[SYSTEM_PROMPT, "Include docstring and typehints."],
            temperature=1.0,
            candidate_count=2  # Tương đương với thông số n=2 của OpenAI
        )
    )

    # Lặp qua danh sách các kết quả trả về (candidates) thay vì choices
    for i, candidate in enumerate(response.candidates):
        # Truy cập vào nội dung text của từng candidate
        output = candidate.content.parts[0].text
        
        # Sử dụng biểu thức chính quy (regex) y hệt như logic cũ của bạn để bóc tách code
        code_suggestion = re.sub(r"(.*?)```python(.*?)```(.*)", r"\2", output, flags=re.DOTALL).strip()
        
        print(f"Output {i + 1}:")
        print(code_suggestion)
        print("-" * 50) # Thêm dòng gạch ngang cho dễ nhìn giữa 2 output