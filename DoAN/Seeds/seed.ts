import mongoose, { Schema, Document } from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Tải biến môi trường từ file .env ở thư mục gốc
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
    console.error('Không tìm thấy MONGODB_URI trong file .env');
    process.exit(1);
}

// 1. Định nghĩa Schemas
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
    email: String,
    password: { type: String, default: 'hashed_password_123' },
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
    hospital: String,
    diagnosis: String,
    medicines: String,
    thumbnailUrl: String,
    customerId: { type: Schema.Types.ObjectId, ref: 'User' }
});

const associationRuleSchema = new Schema({
    antecedentId: { type: Schema.Types.ObjectId, ref: 'Product' },
    consequentId: { type: Schema.Types.ObjectId, ref: 'Product' },
    confidence: Number,
    lift: Number
});

const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);
const PrescriptionVault = mongoose.model('PrescriptionVault', prescriptionVaultSchema);
const AssociationRule = mongoose.model('AssociationRule', associationRuleSchema);

const generateProducts = (categories: any[]) => {
    // 17 sản phẩm mẫu
    return [
        {
            name: 'Amoxicillin 500mg', genericName: 'Amoxicillin trihydrate', manufacturer: 'Domesco',
            type: 'rx', form: 'capsule', price: 50000, unit: 'Hộp 10 vỉ x 10 viên',
            images: ['https://res.cloudinary.com/demo/image/upload/v1/amoxicillin.jpg'],
            tabs: { ingredients: 'Amoxicillin 500mg', indications: 'Điều trị nhiễm khuẩn đường hô hấp, tiết niệu...', dosage: 'Người lớn: 1 viên/lần x 2-3 lần/ngày', sideEffects: 'Buồn nôn, tiêu chảy, dị ứng...' },
            inventory: { main_warehouse: 500, branch_q1: 200, branch_q5: 300, stock_quantity: 1000 },
            stock_quantity: 1000, is_prescription: true, categoryId: categories[0]._id // Kháng sinh
        },
        {
            name: 'Augmentin 1g', genericName: 'Amoxicillin + Clavulanic Acid', manufacturer: 'GSK',
            type: 'rx', form: 'tablet', price: 250000, unit: 'Hộp 2 vỉ x 7 viên',
            images: ['https://res.cloudinary.com/demo/image/upload/v1/augmentin.jpg'],
            tabs: { ingredients: 'Amoxicillin 875mg, Acid Clavulanic 125mg', indications: 'Nhiễm khuẩn nặng đường hô hấp, tiêu hoá...', dosage: '1 viên/lần x 2 lần/ngày', sideEffects: 'Tiêu chảy, khó tiêu...' },
            inventory: { main_warehouse: 100, branch_q1: 5, branch_q5: 50, stock_quantity: 155 }, // < 10 stock tại nhánh
            stock_quantity: 155, is_prescription: true, categoryId: categories[0]._id
        },
        {
            name: 'Zinnat 500mg', genericName: 'Cefuroxime', manufacturer: 'GSK',
            type: 'rx', form: 'tablet', price: 180000, unit: 'Hộp 1 vỉ x 10 viên',
            images: ['https://res.cloudinary.com/demo/image/upload/v1/zinnat.jpg'],
            tabs: { ingredients: 'Cefuroxime axetil 500mg', indications: 'Nhiễm khuẩn hô hấp dưới, tiết niệu', dosage: '250-500mg x 2 lần/ngày', sideEffects: 'Nhức đầu, chóng mặt, rối loạn tiêu hóa' },
            inventory: { main_warehouse: 200, branch_q1: 150, branch_q5: 150, stock_quantity: 500 },
            stock_quantity: 500, is_prescription: true, categoryId: categories[0]._id
        },
        {
            name: 'Panadol Extra', genericName: 'Paracetamol + Caffeine', manufacturer: 'GSK',
            type: 'otc', form: 'tablet', price: 65000, unit: 'Hộp 15 vỉ x 10 viên',
            images: ['https://res.cloudinary.com/demo/image/upload/v1/panadol.jpg'],
            tabs: { ingredients: 'Paracetamol 500mg, Caffeine 65mg', indications: 'Giảm đau, hạ sốt', dosage: '1-2 viên mỗi 4-6 giờ', sideEffects: 'Mất ngủ do caffeine' },
            inventory: { main_warehouse: 1000, branch_q1: 500, branch_q5: 500, stock_quantity: 2000 },
            stock_quantity: 2000, is_prescription: false, categoryId: categories[1]._id // Giảm đau
        },
        {
            name: 'Hapacol 650', genericName: 'Paracetamol', manufacturer: 'Dược Hậu Giang',
            type: 'otc', form: 'tablet', price: 45000, unit: 'Hộp 10 vỉ x 10 viên',
            images: ['https://res.cloudinary.com/demo/image/upload/v1/hapacol.jpg'],
            tabs: { ingredients: 'Paracetamol 650mg', indications: 'Giảm đau, hạ sốt nhanh', dosage: '1 viên mỗi 4-6 giờ', sideEffects: 'Hiếm gặp: dị ứng' },
            inventory: { main_warehouse: 50, branch_q1: 4, branch_q5: 6, stock_quantity: 60 }, // < 10 stock tại nhánh
            stock_quantity: 60, is_prescription: false, categoryId: categories[1]._id
        },
        {
            name: 'Efferalgan 500mg', genericName: 'Paracetamol', manufacturer: 'UPSA',
            type: 'otc', form: 'tablet', price: 55000, unit: 'Hộp 4 vỉ x 4 viên sủi',
            images: ['https://res.cloudinary.com/demo/image/upload/v1/efferalgan.jpg'],
            tabs: { ingredients: 'Paracetamol 500mg', indications: 'Giảm đau, hạ sốt dạng sủi', dosage: '1 viên sủi hòa tan trong nước', sideEffects: 'Chú ý lượng muối ở bệnh nhân cao huyết áp' },
            inventory: { main_warehouse: 300, branch_q1: 100, branch_q5: 200, stock_quantity: 600 },
            stock_quantity: 600, is_prescription: false, categoryId: categories[1]._id
        },
        {
            name: 'Concor 5mg', genericName: 'Bisoprolol fumarate', manufacturer: 'Merck',
            type: 'rx', form: 'tablet', price: 120000, unit: 'Hộp 3 vỉ x 10 viên',
            images: ['https://res.cloudinary.com/demo/image/upload/v1/concor.jpg'],
            tabs: { ingredients: 'Bisoprolol 5mg', indications: 'Điều trị tăng huyết áp, suy tim', dosage: '1 viên/ngày', sideEffects: 'Chậm nhịp tim, mệt mỏi' },
            inventory: { main_warehouse: 400, branch_q1: 100, branch_q5: 100, stock_quantity: 600 },
            stock_quantity: 600, is_prescription: true, categoryId: categories[2]._id // Tim mạch
        },
        {
            name: 'Amlodipine 5mg', genericName: 'Amlodipine', manufacturer: 'Stada',
            type: 'rx', form: 'tablet', price: 30000, unit: 'Hộp 3 vỉ x 10 viên',
            images: ['https://res.cloudinary.com/demo/image/upload/v1/amlodipine.jpg'],
            tabs: { ingredients: 'Amlodipine 5mg', indications: 'Điều trị tăng huyết áp', dosage: '1 viên/ngày', sideEffects: 'Phù cổ chân, đỏ bừng mặt' },
            inventory: { main_warehouse: 800, branch_q1: 200, branch_q5: 200, stock_quantity: 1200 },
            stock_quantity: 1200, is_prescription: true, categoryId: categories[2]._id
        },
        {
            name: 'Lipitor 10mg', genericName: 'Atorvastatin', manufacturer: 'Pfizer',
            type: 'rx', form: 'tablet', price: 450000, unit: 'Hộp 3 vỉ x 10 viên',
            images: ['https://res.cloudinary.com/demo/image/upload/v1/lipitor.jpg'],
            tabs: { ingredients: 'Atorvastatin 10mg', indications: 'Rối loạn lipid máu, giảm mỡ máu', dosage: '1 viên/ngày vào buổi tối', sideEffects: 'Đau cơ, tăng men gan' },
            inventory: { main_warehouse: 150, branch_q1: 50, branch_q5: 50, stock_quantity: 250 },
            stock_quantity: 250, is_prescription: true, categoryId: categories[2]._id
        },
        {
            name: 'Smecta', genericName: 'Diosmectite', manufacturer: 'Ipsen',
            type: 'otc', form: 'liquid', price: 115000, unit: 'Hộp 30 gói',
            images: ['https://res.cloudinary.com/demo/image/upload/v1/smecta.jpg'],
            tabs: { ingredients: 'Diosmectite 3g', indications: 'Tiêu chảy cấp và mãn tính', dosage: 'Người lớn: 3 gói/ngày', sideEffects: 'Táo bón' },
            inventory: { main_warehouse: 300, branch_q1: 150, branch_q5: 150, stock_quantity: 600 },
            stock_quantity: 600, is_prescription: false, categoryId: categories[3]._id // Tiêu hóa
        },
        {
            name: 'Probio', genericName: 'Lactobacillus acidophilus', manufacturer: 'Imexpharm',
            type: 'otc', form: 'capsule', price: 20000, unit: 'Hộp 14 viên',
            images: ['https://res.cloudinary.com/demo/image/upload/v1/probio.jpg'],
            tabs: { ingredients: 'Lactobacillus acidophilus', indications: 'Cân bằng hệ vi sinh đường ruột', dosage: '1-2 viên/ngày', sideEffects: 'Đầy hơi nhẹ' },
            inventory: { main_warehouse: 500, branch_q1: 250, branch_q5: 250, stock_quantity: 1000 },
            stock_quantity: 1000, is_prescription: false, categoryId: categories[3]._id
        },
        {
            name: 'Oresol 245', genericName: 'ORS', manufacturer: 'Dược Hậu Giang',
            type: 'otc', form: 'liquid', price: 40000, unit: 'Hộp 20 gói',
            images: ['https://res.cloudinary.com/demo/image/upload/v1/oresol.jpg'],
            tabs: { ingredients: 'Glucose, Natri, Kali', indications: 'Bù nước và điện giải', dosage: 'Pha 1 gói với 200ml nước', sideEffects: 'Buồn nôn nếu uống quá nhanh' },
            inventory: { main_warehouse: 1000, branch_q1: 500, branch_q5: 500, stock_quantity: 2000 },
            stock_quantity: 2000, is_prescription: false, categoryId: categories[3]._id
        },
        {
            name: 'Máy đo huyết áp Omron HEM-7120', genericName: 'Máy đo huyết áp', manufacturer: 'Omron',
            type: 'otc', form: 'device', price: 850000, unit: 'Cái',
            images: ['https://res.cloudinary.com/demo/image/upload/v1/omron.jpg'],
            tabs: { ingredients: 'Nhựa y tế', indications: 'Theo dõi huyết áp tại nhà', dosage: 'Theo hướng dẫn sử dụng', sideEffects: 'Không' },
            inventory: { main_warehouse: 100, branch_q1: 20, branch_q5: 30, stock_quantity: 150 },
            stock_quantity: 150, is_prescription: false, categoryId: categories[4]._id // Thiết bị y tế
        },
        {
            name: 'Nhiệt kế điện tử Microlife', genericName: 'Nhiệt kế', manufacturer: 'Microlife',
            type: 'otc', form: 'device', price: 150000, unit: 'Cái',
            images: ['https://res.cloudinary.com/demo/image/upload/v1/nhietke.jpg'],
            tabs: { ingredients: 'Đầu dò cảm biến', indications: 'Đo thân nhiệt', dosage: 'Đo ở nách, miệng, hậu môn', sideEffects: 'Không' },
            inventory: { main_warehouse: 200, branch_q1: 100, branch_q5: 100, stock_quantity: 400 },
            stock_quantity: 400, is_prescription: false, categoryId: categories[4]._id
        },
        {
            name: 'Máy thử tiểu đường Accu-Chek Active', genericName: 'Máy thử tiểu đường', manufacturer: 'Roche',
            type: 'otc', form: 'device', price: 1200000, unit: 'Cái',
            images: ['https://res.cloudinary.com/demo/image/upload/v1/accuchek.jpg'],
            tabs: { ingredients: 'Máy và que thử', indications: 'Đo đường huyết', dosage: 'Sử dụng que thử đi kèm', sideEffects: 'Không' },
            inventory: { main_warehouse: 50, branch_q1: 20, branch_q5: 30, stock_quantity: 100 },
            stock_quantity: 100, is_prescription: false, categoryId: categories[4]._id
        },
        {
            name: 'Khẩu trang y tế 4 lớp Niva', genericName: 'Khẩu trang', manufacturer: 'Niva',
            type: 'otc', form: 'device', price: 40000, unit: 'Hộp 50 cái',
            images: ['https://res.cloudinary.com/demo/image/upload/v1/khautrang.jpg'],
            tabs: { ingredients: 'Vải không dệt', indications: 'Phòng ngừa lây nhiễm, chống bụi', dosage: 'Dùng 1 lần', sideEffects: 'Không' },
            inventory: { main_warehouse: 2000, branch_q1: 1000, branch_q5: 1000, stock_quantity: 4000 },
            stock_quantity: 4000, is_prescription: false, categoryId: categories[4]._id
        },
        {
            name: 'Bông y tế Bạch Tuyết', genericName: 'Bông y tế', manufacturer: 'Bạch Tuyết',
            type: 'otc', form: 'device', price: 15000, unit: 'Gói 100g',
            images: ['https://res.cloudinary.com/demo/image/upload/v1/bongyte.jpg'],
            tabs: { ingredients: '100% cotton', indications: 'Vệ sinh vết thương', dosage: 'Dùng ngoài', sideEffects: 'Không' },
            inventory: { main_warehouse: 500, branch_q1: 250, branch_q5: 250, stock_quantity: 1000 },
            stock_quantity: 1000, is_prescription: false, categoryId: categories[4]._id
        }
    ];
};

const runSeed = async () => {
    try {
        console.log('Đang kết nối MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Kết nối thành công!');

        console.log('Đang xóa dữ liệu cũ...');
        await Category.deleteMany({});
        await Product.deleteMany({});
        await User.deleteMany({});
        await Order.deleteMany({});
        await PrescriptionVault.deleteMany({});
        await AssociationRule.deleteMany({});

        console.log('Tạo Categories...');
        const categories = await Category.insertMany([
            { name: 'Kháng sinh', slug: 'khang-sinh', description: 'Thuốc kháng sinh', icon: 'pill' },
            { name: 'Giảm đau, hạ sốt', slug: 'giam-dau', description: 'Giảm đau hạ sốt', icon: 'thermometer' },
            { name: 'Tim mạch', slug: 'tim-mach', description: 'Thuốc tim mạch', icon: 'heart' },
            { name: 'Tiêu hóa', slug: 'tieu-hoa', description: 'Hỗ trợ tiêu hóa', icon: 'stomach' },
            { name: 'Thiết bị y tế', slug: 'thiet-bi', description: 'Thiết bị sức khỏe', icon: 'activity' }
        ]);

        console.log('Tạo Products...');
        const productsData = generateProducts(categories);
        const products = await Product.insertMany(productsData);

        console.log('Tạo Users...');
        const users = await User.insertMany([
            { phone: '0901234567', email: 'admin@medicine.com', role: 'Admin', reward_points: 0 },
            { phone: '0907654321', email: 'pharmacist@medicine.com', role: 'Pharmacist', reward_points: 0 },
            { phone: '0988888888', email: 'customer1@gmail.com', role: 'Customer', reward_points: 45 },
            { phone: '0977777777', email: 'customer2@gmail.com', role: 'Customer', reward_points: 90 },
        ]);

        console.log('Tạo Orders...');
        const rxProducts = products.filter(p => p.is_prescription);
        const otcProducts = products.filter(p => !p.is_prescription);

        const ordersData = [
            // 5 Đơn COMPLETED
            {
                customerId: users[2]._id,
                items: [{ productId: otcProducts[0]._id, price: otcProducts[0].price, quantity: 2 }],
                status: 'COMPLETED',
                pharmacistNotes: 'Sử dụng theo đúng liều lượng'
            },
            {
                customerId: users[3]._id,
                items: [{ productId: otcProducts[1]._id, price: otcProducts[1].price, quantity: 1 }, { productId: otcProducts[2]._id, price: otcProducts[2].price, quantity: 1 }],
                status: 'COMPLETED',
                pharmacistNotes: 'Uống nhiều nước'
            },
            {
                customerId: users[2]._id,
                items: [{ productId: otcProducts[3]._id, price: otcProducts[3].price, quantity: 5 }],
                status: 'COMPLETED'
            },
            {
                customerId: users[3]._id,
                items: [{ productId: rxProducts[0]._id, price: rxProducts[0].price, quantity: 1 }],
                prescriptionImage: 'https://res.cloudinary.com/demo/image/upload/v1/prescription_old1.jpg',
                status: 'COMPLETED',
                pharmacistNotes: 'Đã kiểm tra đơn thuốc hợp lệ'
            },
            {
                customerId: users[2]._id,
                items: [{ productId: otcProducts[4]._id, price: otcProducts[4].price, quantity: 1 }],
                status: 'COMPLETED'
            },
            // 2 Đơn DRAFT_RX
            {
                customerId: users[3]._id,
                items: [{ productId: rxProducts[1]._id, price: rxProducts[1].price, quantity: 2 }],
                prescriptionImage: '/uploads/virtual_prescription_1.jpg',
                status: 'DRAFT_RX',
                pharmacistNotes: ''
            },
            {
                customerId: users[2]._id,
                items: [{ productId: rxProducts[2]._id, price: rxProducts[2].price, quantity: 1 }],
                prescriptionImage: '/uploads/virtual_prescription_2.jpg',
                status: 'DRAFT_RX',
                pharmacistNotes: ''
            }
        ];
        await Order.insertMany(ordersData);

        console.log('Tạo AssociationRules...');
        await AssociationRule.insertMany([
            {
                antecedentId: otcProducts[0]._id,
                consequentId: otcProducts[3]._id,
                confidence: 0.85,
                lift: 1.5
            },
            {
                antecedentId: rxProducts[0]._id,
                consequentId: otcProducts[1]._id,
                confidence: 0.75,
                lift: 1.2
            }
        ]);

        console.log('Tạo PrescriptionVault...');
        await PrescriptionVault.insertMany([
            {
                prescriptionCode: 'RX-2023-001',
                issuedDate: new Date('2023-10-01'),
                expiryDate: new Date('2024-10-01'),
                doctorName: 'Dr. Nguyễn Văn A',
                hospital: 'Bệnh viện Chợ Rẫy',
                diagnosis: 'Viêm amidan cấp',
                medicines: 'Amoxicillin 500mg, Paracetamol 500mg',
                thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/v1/prescription_old1.jpg',
                customerId: users[3]._id
            }
        ]);

        console.log('🚀 Seed dữ liệu thành công!');
        process.exit(0);

    } catch (error) {
        console.error('Lỗi khi seed dữ liệu:', error);
        process.exit(1);
    }
};

runSeed();
