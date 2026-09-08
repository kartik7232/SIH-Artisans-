import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not configured")

client = genai.Client(api_key=GEMINI_API_KEY)


def analyze_product_image(image_bytes: bytes, mime_type: str):
    prompt = """
You are an AI assistant for an Indian artisan marketplace.

Analyze the uploaded product image.

Return ONLY valid JSON in this exact format:

{
    "category": "short product category",
    "description": "clear, attractive product description"
}

Rules:
- Identify what the artisan product appears to be.
- Keep the category concise.
- Write a useful marketplace-ready description.
- Mention visible materials, colors, patterns, or craftsmanship when reasonably identifiable.
- Do not invent details that cannot be determined from the image.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=[
            types.Part.from_bytes(
                data=image_bytes,
                mime_type=mime_type
            ),
            prompt
        ]
    )

    return response.text



def recommend_product_price(
    category: str,
    description: str
):
    prompt = f"""
You are an AI pricing assistant for an Indian artisan marketplace.

Based on the product information below, estimate a reasonable selling
price in Indian Rupees (INR).

Product category:
{category}

Product description:
{description}

Return ONLY valid JSON in this exact format:

{{
    "min_price": 0,
    "recommended_price": 0,
    "max_price": 0,
    "currency": "INR"
}}

Pricing guidelines:
- Consider craftsmanship and apparent complexity.
- Consider the likely material and type of product when available.
- Consider that this is an artisan marketplace in India.
- Give realistic consumer-market prices.
- Do not use extremely high or extremely low prices without justification.
- All prices must be whole numbers.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    result = response.text.strip()

    if result.startswith("```"):
        result = result.replace("```json", "")
        result = result.replace("```", "")
        result = result.strip()

    return result