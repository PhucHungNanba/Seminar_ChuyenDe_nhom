import httpx

PRODUCT_SERVICE_URL = "http://localhost:3002/api/products"

async def check_medicine_availability(medicine_name: str) -> dict:
    """
    Gọi HTTP GET sang Product Service để kiểm tra hàng.
    """
    try:
        async with httpx.AsyncClient() as client:
            # Gọi API /api/products/search?name=...
            response = await client.get(f"{PRODUCT_SERVICE_URL}/search", params={"name": medicine_name})
            
            if response.status_code == 200:
                data = response.json()
                products = data.get("data", [])
                
                if len(products) > 0:
                    # Lấy kết quả đầu tiên map được
                    best_match = products[0]
                    return {
                        "is_available": True,
                        "product_id": best_match.get("_id"),
                        "price": best_match.get("price", 0),
                        "stock_quantity": best_match.get("quantity", 0)
                    }
                else:
                    return {"is_available": False, "message": "Không tìm thấy trong kho"}
            else:
                return {"is_available": False, "message": "Lỗi từ Product Service"}
                
    except Exception as e:
        print(f"Lỗi gọi Product Service: {e}")
        return {"is_available": False, "message": "Không thể kết nối đến Product Service"}
