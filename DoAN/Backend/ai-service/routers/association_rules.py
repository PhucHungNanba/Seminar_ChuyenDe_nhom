"""
Association Rules API router.

Exposes two endpoints consumed by the frontend:

  GET /api/ai/dashboard
      → Top-5 rules sorted by confidence (Admin Analytics page)

  GET /api/ai/recommend?productId=<id>
      → Best matching rule for a given antecedent product (Customer page)

The gateway rewrites:
  /api/association-rules/dashboard  →  /api/ai/dashboard
  /api/association-rules/recommend  →  /api/ai/recommend

MongoDB collection: associationrules  (in db_ai)
Product  collection: products         (in db_products — fetched via HTTP)
"""

import os
import httpx
from bson import ObjectId
from fastapi import APIRouter, Query, HTTPException
from services.db import get_collection

router = APIRouter()

# Product service base URL (override in .env for Docker networking)
PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL", "http://localhost:3002")


# ─── helpers ──────────────────────────────────────────────────────────────────

def _str_id(doc: dict) -> dict:
    """Convert MongoDB ObjectId fields to strings for JSON serialisation."""
    if doc is None:
        return doc
    doc["_id"] = str(doc.get("_id", ""))
    if "antecedentId" in doc:
        doc["antecedentId"] = str(doc["antecedentId"])
    if "consequentId" in doc:
        doc["consequentId"] = str(doc["consequentId"])
    return doc


async def _fetch_product(product_id: str) -> dict | None:
    """Call product-service HTTP API to retrieve product details by ID."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"{PRODUCT_SERVICE_URL}/{product_id}")
            if resp.status_code == 200:
                body = resp.json()
                return body.get("data") or body
    except Exception as e:
        print(f"[association_rules] product fetch error for {product_id}: {e}")
    return None


async def _enrich_rule(rule: dict) -> dict | None:
    """
    Replace antecedentId / consequentId ObjectIds with actual product data.
    Returns None if either product cannot be resolved.
    """
    rule = _str_id(rule)
    antecedent_id = rule.get("antecedentId", "")
    consequent_id  = rule.get("consequentId", "")

    antecedent, consequent = None, None
    if antecedent_id:
        antecedent = await _fetch_product(antecedent_id)
    if consequent_id:
        consequent = await _fetch_product(consequent_id)

    if not antecedent or not consequent:
        return None

    rule["antecedent"] = {
        "_id":   str(antecedent.get("_id", antecedent_id)),
        "name":  antecedent.get("name", ""),
        "price": antecedent.get("price", 0),
        "images": antecedent.get("images", []),
        "type":  antecedent.get("type", "otc"),
    }
    rule["consequent"] = {
        "_id":   str(consequent.get("_id", consequent_id)),
        "name":  consequent.get("name", ""),
        "price": consequent.get("price", 0),
        "images": consequent.get("images", []),
        "type":  consequent.get("type", "otc"),
    }
    return rule


# ─── endpoints ────────────────────────────────────────────────────────────────

@router.get("/dashboard")
async def get_dashboard_rules():
    """
    Admin Analytics: return top-5 association rules sorted by confidence DESC.
    Each rule has antecedent/consequent populated with product details.
    """
    try:
        col = get_collection("associationrules")
        cursor = col.find({}).sort("confidence", -1).limit(5)
        raw_rules = await cursor.to_list(length=5)

        enriched = []
        for rule in raw_rules:
            result = await _enrich_rule(rule)
            if result:
                enriched.append(result)

        return {"success": True, "data": enriched}

    except Exception as e:
        print(f"[dashboard] error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/recommend")
async def recommend(productId: str = Query(..., description="antecedent product ID")):
    """
    Customer recommendation: find the best rule where antecedentId == productId
    and confidence > 0.5.  Returns [] when no match (never 404).
    """
    try:
        col = get_collection("associationrules")

        # Try both ObjectId and string match for robustness
        query_filter = {"confidence": {"$gt": 0.5}}
        try:
            oid = ObjectId(productId)
            query_filter["antecedentId"] = oid
        except Exception:
            query_filter["antecedentId"] = productId

        rule = await col.find_one(query_filter, sort=[("confidence", -1)])

        if not rule:
            return {"success": True, "data": []}

        enriched = await _enrich_rule(rule)
        if not enriched:
            return {"success": True, "data": []}

        return {"success": True, "data": [enriched]}

    except Exception as e:
        print(f"[recommend] error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/recommendations")
async def recommendations_legacy(productId: str = Query(default="", alias="productId")):
    """
    Legacy endpoint kept for backward compatibility.
    Delegates to /recommend.
    """
    if not productId:
        return {"success": True, "data": []}
    return await recommend(productId=productId)
