from fastapi import APIRouter, UploadFile, File, HTTPException
from services.gemini_service import extract_medicines_from_image
from services.product_client import check_medicine_availability

router = APIRouter()


@router.get("/recommendations")
async def recommendations(productIds: str = ""):
    # Simple placeholder implementation to avoid 500s when AI microservice
    # is not yet providing real association rules. Returns empty list.
    try:
        ids = [p for p in productIds.split(',') if p]
        return {
            "success": True,
            "data": []
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-prescription")
async def analyze_prescription(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Vui lòng tải lên một file ảnh.")
    
    # Đọc nội dung ảnh
    image_bytes = await file.read()
    
    try:
        # 1. Gọi Gemini API để phân tích ảnh đơn thuốc
        gemini_results = await extract_medicines_from_image(image_bytes, file.content_type)
        
        # 2. Kiểm tra tồn kho từ Product Service cho mỗi loại thuốc
        final_results = []
        for item in gemini_results:
            medicine_name = item.get("medicine_name", "")
            quantity = item.get("quantity", 0)
            
            # Gọi sang Product Service
            availability = await check_medicine_availability(medicine_name)
            
            final_results.append({
                "medicine_name": medicine_name,
                "quantity_required": quantity,
                "availability": availability
            })
            
        return {
            "success": True,
            "data": final_results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
