import mongoose, { Schema } from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcrypt';

// Import data thật từ Frontend
import { ALL_PRODUCTS } from '../Frontend/src/data/allProducts';
import { MOCK_ASSOCIATION_RULES } from '../Frontend/src/data/mockAssociationRules';
import { MOCK_PRESCRIPTIONS } from '../Frontend/src/data/mockPrescriptionVault';

// Load cấu hình môi trường
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const BASE_MONGODB_URI = process.env.MONGODB_URI || '';

if (!BASE_MONGODB_URI) {
    console.error('❌ Không tìm thấy MONGODB_URI trong file .env');
    process.exit(1);
}

// Hàm helper để tạo URI cho từng Database (Database per Service)
const getUri = (dbName: string) => {
    return BASE_MONGODB_URI.replace(/mongodb\.net\/([^?]+)/, `mongodb.net/${dbName}`);
};

// ==========================================
// 1. ĐỊNH NGHĨA SCHEMAS (Chuẩn theo database.md)
// ==========================================

const categorySchema = new Schema({
    name: String,
    slug: String,
    description: String,
    icon: String
});

const productSchema = new Schema({
    name: String,
    genericName: String,
    manufacturer: String,
    type: { type: String, enum: ['otc', 'rx'] },
    form: { type: String, enum: ['tablet', 'liquid', 'capsule', 'device'] },
    price: Number,
    unit: String,
    images: [String],
    description: String,
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 },
    tags: [String],
    badge: String,
    tabs: {
        ingredients: String,
        indications: String,
        dosage: String,
        sideEffects: String
    },
    inventory: {
        main_warehouse: Number,
        branch_q1: Number,
        branch_q5: Number,
        stock_quantity: Number
    },
    stock_quantity: Number,
    is_prescription: Boolean,
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' }
});

const userSchema = new Schema({
    phone: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: String,
    role: { type: String, enum: ['Admin', 'Pharmacist', 'Customer'] },
    reward_points: { type: Number, default: 0 }
});

const orderSchema = new Schema({
    customerId: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [{
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        price: Number,
        quantity: Number
    }],
    prescriptionImage: String,
    status: { type: String, enum: ['DRAFT_RX', 'QUOTED', 'PENDING_PAYMENT', 'PROCESSING', 'SHIPPING', 'COMPLETED', 'CANCELLED'] },
    pharmacistNotes: String
}, { timestamps: true });

const prescriptionVaultSchema = new Schema({
    prescriptionCode: String,
    issuedDate: Date,
    expiryDate: Date,
    doctorName: String,
    doctorSpecialty: String,
    hospital: String,
    diagnosis: String,
    thumbnailUrl: String,
    notes: String,
    medicines: [{
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        genericName: String,
        dosage: String,
        quantity: Number,
        price: Number,
        imageUrl: String
    }],
    customerId: { type: Schema.Types.ObjectId, ref: 'User' }
});

const associationRuleSchema = new Schema({
    antecedentId: { type: Schema.Types.ObjectId, ref: 'Product' },
    consequentId: { type: Schema.Types.ObjectId, ref: 'Product' },
    confidence: Number,
    lift: Number,
    support: Number,
    reason: String
});

// ==========================================
// 2. KỊCH BẢN SEED DỮ LIỆU ĐA DATABASE
// ==========================================

const runSeed = async () => {
    try {
        console.log('🔄 Đang thiết lập kết nối tới các Database Microservices...');

        // Tạo kết nối riêng biệt cho từng Database
        const userConn = mongoose.createConnection(getUri('db_users'));
        const productConn = mongoose.createConnection(getUri('db_products'));
        const orderConn = mongoose.createConnection(getUri('db_orders'));
        const aiConn = mongoose.createConnection(getUri('db_ai'));

        // Gắn model vào từng connection tương ứng
        const User = userConn.model('User', userSchema);
        const Category = productConn.model('Category', categorySchema);
        const Product = productConn.model('Product', productSchema);
        const Order = orderConn.model('Order', orderSchema);
        const PrescriptionVault = orderConn.model('PrescriptionVault', prescriptionVaultSchema);
        const AssociationRule = aiConn.model('AssociationRule', associationRuleSchema);

        console.log('✅ Kết nối đa Database thành công!');

        console.log('🗑️  Đang xóa toàn bộ dữ liệu cũ (Clean Databases)...');
        await Category.deleteMany({});
        await Product.deleteMany({});
        await User.deleteMany({});
        await Order.deleteMany({});
        await PrescriptionVault.deleteMany({});
        await AssociationRule.deleteMany({});

        console.log('📦 1/6: Đang khởi tạo Categories (vào db_products)...');
        const categories = await Category.insertMany([
            { name: 'Kháng sinh', slug: 'khang-sinh', description: 'Thuốc kháng sinh', icon: 'pill' },
            { name: 'Giảm đau, hạ sốt', slug: 'giam-dau', description: 'Giảm đau hạ sốt', icon: 'thermometer' },
            { name: 'Tim mạch', slug: 'tim-mach', description: 'Thuốc tim mạch', icon: 'heart' },
            { name: 'Tiêu hóa', slug: 'tieu-hoa', description: 'Hỗ trợ tiêu hóa', icon: 'stomach' },
            { name: 'Thiết bị y tế', slug: 'thiet-bi', description: 'Thiết bị sức khỏe', icon: 'activity' }
        ]);

        console.log('👥 2/6: Đang khởi tạo Users (vào db_users)...');
        const hashedPassword = await bcrypt.hash('Password123!', 10);
        const users = await User.insertMany([
            { email: 'admin@medicine.com', password: hashedPassword, role: 'Admin', fullName: 'Quản trị viên', phone: '0901234567', reward_points: 0 },
            { email: 'pharmacist@medicine.com', password: hashedPassword, role: 'Pharmacist', fullName: 'Dược sĩ chuyên môn', phone: '0907654321', reward_points: 0 },
            { email: 'customer@gmail.com', password: hashedPassword, role: 'Customer', fullName: 'Khách hàng', phone: '0988888888', reward_points: 45 },
        ]);

        console.log('💊 3/6: Đang chuyển đổi và nạp Products từ Frontend (vào db_products)...');
        const productMap = new Map<string, mongoose.Types.ObjectId>();
        
        const productsToInsert = ALL_PRODUCTS.map(p => {
            const objId = new mongoose.Types.ObjectId();
            productMap.set(p.id, objId);
            
            let catId = categories[1]._id; // Mặc định là Giảm đau
            if (p.tags.includes('Kháng sinh')) catId = categories[0]._id;
            else if (p.tags.includes('Tim mạch')) catId = categories[2]._id;
            else if (p.tags.includes('Tiêu hóa')) catId = categories[3]._id;
            else if (p.tags.includes('Vật tư y tế') || p.form === 'device') catId = categories[4]._id;

            return {
                _id: objId,
                name: p.name,
                genericName: p.genericName,
                manufacturer: p.manufacturer,
                type: p.type,
                form: p.form,
                price: p.price,
                unit: p.unit,
                images: [p.imageUrl],
                description: p.description,
                rating: p.rating,
                reviewCount: p.reviewCount,
                tags: p.tags,
                badge: p.badge,
                tabs: p.tabs,
                inventory: { main_warehouse: 100, branch_q1: 50, branch_q5: 50, stock_quantity: 200 },
                stock_quantity: 200,
                is_prescription: p.type === 'rx',
                categoryId: catId
            };
        });
        await Product.insertMany(productsToInsert);

        console.log('🧠 4/6: Đang nạp hệ thống gợi ý AI (vào db_ai)...');
        const rulesToInsert = MOCK_ASSOCIATION_RULES.map(r => ({
            antecedentId: productMap.get(r.antecedentId),
            consequentId: productMap.get(r.consequent.id),
            confidence: r.confidence,
            lift: r.lift,
            support: r.support,
            reason: r.reason
        }));
        await AssociationRule.insertMany(rulesToInsert);

        console.log('📑 5/6: Đang nạp Hồ sơ bệnh án (vào db_orders)...');
        const customerUser = users.find(u => u.role === 'Customer');
        const prescriptionsToInsert = MOCK_PRESCRIPTIONS.map(rx => ({
            prescriptionCode: rx.prescriptionCode,
            issuedDate: new Date(rx.issuedDate),
            expiryDate: new Date(rx.expiryDate),
            doctorName: rx.doctorName,
            doctorSpecialty: rx.doctorSpecialty,
            hospital: rx.hospital,
            diagnosis: rx.diagnosis,
            thumbnailUrl: rx.thumbnailUrl,
            notes: rx.notes,
            medicines: rx.medicines.map(m => ({
                productId: productMap.get(m.productId),
                name: m.name,
                genericName: m.genericName,
                dosage: m.dosage,
                quantity: m.quantity,
                price: m.price,
                imageUrl: m.imageUrl
            })),
            customerId: customerUser ? customerUser._id : null
        }));
        await PrescriptionVault.insertMany(prescriptionsToInsert);

        console.log('🛒 6/6: Đang nạp các Đơn hàng mẫu (vào db_orders)...');
        if (productsToInsert.length >= 2 && customerUser) {
            const [p1, p2] = productsToInsert;
            await Order.insertMany([
                {
                    customerId: customerUser._id,
                    items: [{ productId: p1._id, price: p1.price, quantity: 2 }],
                    prescriptionImage: "https://example.com/mock-prescription.jpg", // Cung cấp giá trị để hiển thị đầy đủ thuộc tính trên MongoDB
                    status: 'COMPLETED',
                    pharmacistNotes: 'Sử dụng theo đúng liều lượng'
                },
                {
                    customerId: customerUser._id,
                    items: [
                        { productId: p1._id, price: p1.price, quantity: 1 }, 
                        { productId: p2._id, price: p2.price, quantity: 1 }
                    ],
                    prescriptionImage: null, // Có thể null với đơn không kê đơn
                    status: 'COMPLETED',
                    pharmacistNotes: 'Uống nhiều nước'
                }
            ]);
        }

        console.log('🎉 TẤT CẢ HOÀN TẤT: Dữ liệu đã được nạp chuẩn xác theo mô hình Database-per-Service!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Đã xảy ra lỗi nghiêm trọng khi Seed:', error);
        process.exit(1);
    }
};

runSeed();
