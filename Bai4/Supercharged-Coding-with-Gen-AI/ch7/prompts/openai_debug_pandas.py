import inspect
import os
import sys

try:
    from google import genai
    from google.genai import types
except ModuleNotFoundError as exc:
    raise SystemExit(
        "Missing dependency 'google-genai'. Install it in your active environment and re-run:\n"
        f"  {sys.executable} -m pip install google-genai"
    ) from exc
from pandas import DataFrame


SURROUND = """Given Pandas DataFrame 2.2.3 class, you are provided with:
1. Pandas DataFrame method to be called enclosed with {{{ FUNCTION }}}
2. Arguments requirements enclosed with {{ REQUIREMENTS }}}."""
SINGLE_TASK = "Your task is to generate a method call with sample parameters that meet the data requirements."

REQUIREMENTS = """
1. 5 rows
2. 3 columns
3. floats and integers in cells
"""


def get_user_prompt(func: callable) -> str:
    return f"""
    FUNCTION: {{{{{{ {inspect.getsource(func)} }}}}}}

    REQUIREMENTS: {{{{{{ {REQUIREMENTS} }}}}}}

    EXPLANATION:
    """


def _get_api_key() -> str:
    raw = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not raw:
        raise SystemExit(
            "Missing GEMINI_API_KEY (or GOOGLE_API_KEY). Set it and re-run, e.g.\n"
            "  $env:GEMINI_API_KEY='YOUR_KEY_HERE'\n"
            "  python openai_debug_pandas.py"
        )

    cleaned = raw.strip()
    if cleaned and cleaned[0] == cleaned[-1] and cleaned[0] in {"'", '"'}:
        cleaned = cleaned[1:-1].strip()

    if any(ch.isspace() for ch in cleaned):
        raise SystemExit(
            "Your API key contains whitespace/newlines. Re-set it in PowerShell like:\n"
            "  $env:GEMINI_API_KEY='YOUR_KEY_HERE'"
        )

    return cleaned


def _raise_friendly_genai_error(exc: Exception) -> None:
    msg = str(exc)
    if "API_KEY_INVALID" in msg or "API key not valid" in msg:
        raise SystemExit(
            "Gemini rejected the API key (API_KEY_INVALID).\n"
            "- Verify you're using a Gemini API Key from Google AI Studio.\n"
            "- If the key was exposed, rotate/revoke it and create a new one."
        ) from None

    if "PERMISSION_DENIED" in msg or "SERVICE_DISABLED" in msg:
        raise SystemExit(
            "Your key was accepted but access is denied.\n"
            "- Ensure the Gemini/Generative Language API is enabled\n"
            "- Check key restrictions"
        ) from None

    if "RESOURCE_EXHAUSTED" in msg or "Quota exceeded" in msg or "rate-limits" in msg:
        raise SystemExit(
            "Gemini API quota exceeded (RESOURCE_EXHAUSTED).\n"
            "This is not a code bug: your key/project currently has no available quota for generateContent.\n"
            "What to do:\n"
            "- Check quotas/limits: https://ai.dev/rate-limit\n"
            "- Check rate-limit docs: https://ai.google.dev/gemini-api/docs/rate-limits\n"
            "- If the free-tier limit shows 0, you must use a different project/key or enable billing/plan\n"
            "- Optionally try a smaller model via $env:GEMINI_MODEL='gemini-2.0-flash-lite'"
        ) from None

    if "NOT_FOUND" in msg and "ListModels" in msg and "generateContent" in msg:
        raise SystemExit(
            "The selected model is not available for your API version/key.\n"
            "- Try setting a different model, e.g.:\n"
            "  $env:GEMINI_MODEL='gemini-2.5-flash'\n"
            "  python openai_debug_pandas.py\n"
            "- Or list available models (optional):\n"
            "  python -c \"from google import genai; import os; c=genai.Client(api_key=os.getenv('GEMINI_API_KEY') or os.getenv('GOOGLE_API_KEY')); print([m.name for m in c.models.list()][:20])\""
        ) from None

    raise


def _is_model_not_found(exc: Exception) -> bool:
    msg = str(exc)
    return (
        "NOT_FOUND" in msg
        and "generateContent" in msg
        and ("ListModels" in msg or "is not found" in msg)
    )


def _generate_with_model_fallback(
    client: "genai.Client",
    user_prompt: str,
    system_prompt: str,
) -> "types.GenerateContentResponse":
    env_model = os.getenv("GEMINI_MODEL")
    candidates = [
        env_model,
        "gemini-2.5-flash",
        "gemini-2.5-flash-lite",
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite",
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
    ]
    tried: list[str] = []
    last_exc: Exception | None = None

    for candidate in candidates:
        if not candidate:
            continue
        if candidate in tried:
            continue
        tried.append(candidate)
        try:
            return client.models.generate_content(
                model=candidate,
                contents=user_prompt,
                config=types.GenerateContentConfig(system_instruction=system_prompt),
            )
        except Exception as exc:  # pragma: no cover
            last_exc = exc
            if _is_model_not_found(exc):
                continue
            raise

    raise SystemExit(
        "No working model found. Tried: "
        + ", ".join(tried)
        + "\nSet $env:GEMINI_MODEL to one from ListModels."
    ) from last_exc


if __name__ == "__main__":
    api_key = _get_api_key()

    client = genai.Client(api_key=api_key)

    system_prompt = f"{SURROUND} {SINGLE_TASK}"
    user_prompt = get_user_prompt(DataFrame._constructor_from_mgr)

    try:
        response = _generate_with_model_fallback(client, user_prompt, system_prompt)
    except Exception as exc:  # pragma: no cover
        _raise_friendly_genai_error(exc)
    print("Explanation:", response.text)


