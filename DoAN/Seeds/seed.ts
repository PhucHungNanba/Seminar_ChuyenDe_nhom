import mongoose, { Schema } from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcrypt';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const BASE_MONGODB_URI = process.env.MONGODB_URI || '';
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dr7blo9il';

if (!BASE_MONGODB_URI) {
    console.error('Cannot find MONGODB_URI in root .env');
    process.exit(1);
}

const getUri = (dbName: string) => {
    return BASE_MONGODB_URI.replace(/mongodb\.net\/([^?]+)/, `mongodb.net/${dbName}`);
};

const categorySchema = new Schema({
    name: String,
    slug: String,
    description: String,
    icon: String,
});

const productSchema = new Schema({
    name: String,
    genericName: String,
    manufacturer: String,
    type: { type: String, enum: ['otc', 'rx', 'vitamin', 'personal_care', 'medical_device'] },
    form: { type: String, enum: ['tablet', 'liquid', 'capsule', 'device', 'effervescent'] },
    price: Number,
    unit: String,
    images: [String],
    description: String,
    tags: [String],
    badge: String,
    tabs: {
        ingredients: String,
        indications: String,
        dosage: String,
        sideEffects: String,
    },
    inventory: {
        'Kho Tổng': Number,
        'CH Quận 1': Number,
        'CH Quận 5': Number,
        stock_quantity: Number,
    },
    stock_quantity: Number,
    is_prescription: Boolean,
    productCode: { type: String, required: true, unique: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
});

productSchema.pre('save', async function(next) {
    if (this.productCode) {
        return next();
    }
    try {
        const count = await this.constructor.countDocuments();
        const code = `MED-${(count + 1).toString().padStart(6, '0')}`;
        this.productCode = code;
        next();
    } catch (error) {
        next(error);
    }
});

const userSchema = new Schema({
    phone: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: String,
    role: { type: String, enum: ['Admin', 'Pharmacist', 'Customer'] },
    reward_points: { type: Number, default: 0 },
});

const orderSchema = new Schema(
    {
        userId: { type: String, required: true },
        items: [
            {
                productId: { type: String, required: true },
                name: String,
                quantity: Number,
                price: Number,
            },
        ],
        totalAmount: Number,
        shippingAddress: { type: String, default: 'TBD' },
        paymentMethod: { type: String, default: 'cod' },
        customerName: String,
        customerPhone: String,
        customerEmail: String,
        note: String,
        status: { type: String, default: 'UNPAID' },
        prescriptionImageUrl: String,
        orderCode: { type: String, unique: true, sparse: true },
        isQuoted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

orderSchema.pre('save', async function(next) {
    if (this.orderCode) {
        return next();
    }
    try {
        const today = new Date();
        const dateStr = today.getFullYear().toString() +
            (today.getMonth() + 1).toString().padStart(2, '0') +
            today.getDate().toString().padStart(2, '0');
    
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    
        const count = await this.constructor.countDocuments({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
    
        const code = `ORD-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;
        this.orderCode = code;
        next();
    } catch (error) {
        next(error);
    }
});

const prescriptionVaultSchema = new Schema(
    {
        requestCode: { type: String, required: true, unique: true },
        customerId: { type: Schema.Types.ObjectId, required: true },
        customerPhone: { type: String, required: true },
        thumbnailUrl: { type: String, required: true },
        status: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'REJECTED'],
            default: 'PENDING',
        },
        prescriptionCode: { type: String, required: false },
        doctorName: { type: String, required: false },
        hospital: { type: String, required: false },
        diagnosis: { type: String, required: false },
        medicines: [
            {
                productId: { type: Schema.Types.ObjectId, required: true },
                name: { type: String },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],
        totalAmount: { type: Number, default: 0 },
        pharmacistNote: { type: String, required: false },
    },
    { timestamps: true }
);

prescriptionVaultSchema.pre('save', async function(next) {
    if (this.requestCode) return next();
    try {
        const today = new Date();
        const year = today.getFullYear();
        const count = await this.constructor.countDocuments();
        this.requestCode = `RX-${year}-${(count + 1).toString().padStart(3, '0')}`;
        next();
    } catch (e) {
        next(e);
    }
});

const associationRuleSchema = new Schema({
    antecedentId: { type: Schema.Types.ObjectId, ref: 'Product' },
    consequentId: { type: Schema.Types.ObjectId, ref: 'Product' },
    confidence: Number,
    lift: Number,
    support: Number,
    reason: String,
});

const runSeed = async () => {
    let userConn: mongoose.Connection | null = null;
    let productConn: mongoose.Connection | null = null;
    let orderConn: mongoose.Connection | null = null;
    let aiConn: mongoose.Connection | null = null;

    try {
        console.log('Connecting to service databases...');

        userConn = mongoose.createConnection(getUri('db_users'));
        productConn = mongoose.createConnection(getUri('db_products'));
        orderConn = mongoose.createConnection(getUri('db_orders'));
        aiConn = mongoose.createConnection(getUri('db_ai'));

        await Promise.all([
            userConn.asPromise(),
            productConn.asPromise(),
            orderConn.asPromise(),
            aiConn.asPromise(),
        ]);

        const User = userConn.model('User', userSchema);
        const Category = productConn.model('Category', categorySchema);
        const Product = productConn.model('Product', productSchema);
        const Order = orderConn.model('Order', orderSchema);
        const PrescriptionVault = orderConn.model('PrescriptionVault', prescriptionVaultSchema, 'prescriptionvaults');
        const AssociationRule = aiConn.model('AssociationRule', associationRuleSchema);

        console.log('Connected to db_users, db_products, db_orders, db_ai');

        await Promise.all([
            Category.deleteMany({}),
            Product.deleteMany({}),
            User.deleteMany({}),
            Order.deleteMany({}),
            PrescriptionVault.deleteMany({}),
            AssociationRule.deleteMany({}),
        ]);

        // Insert fresh categories
        const categories = await Category.insertMany([
            { name: 'Kháng sinh', slug: 'khang-sinh', description: 'Thuốc kháng sinh', icon: 'pill' },
            { name: 'Giảm đau, hạ sốt', slug: 'giam-dau', description: 'Giảm đau hạ sốt', icon: 'thermometer' },
            { name: 'Vitamin', slug: 'vitamin', description: 'Vitamin và thực phẩm bổ sung', icon: 'sparkles' },
            { name: 'Thiết bị y tế', slug: 'thiet-bi', description: 'Thiết bị & Dụng cụ y tế', icon: 'heart-pulse' },
        ]);

        // Map Category slug to ID
        const catMap: Record<string, mongoose.Types.ObjectId> = {
            'khang-sinh': categories[0]._id,
            'giam-dau': categories[1]._id,
            'vitamin': categories[2]._id,
            'thiet-bi': categories[3]._id,
        };

        // Create Seed Users
        const hashedPassword = await bcrypt.hash('Password123!', 10);
        const users = await User.insertMany([
            { email: 'admin@medicine.com', password: hashedPassword, role: 'Admin', fullName: 'Quản trị viên', phone: '0901234567', reward_points: 0 },
            { email: 'pharmacist@medicine.com', password: hashedPassword, role: 'Pharmacist', fullName: 'Dược sĩ chuyên môn', phone: '0907654321', reward_points: 0 },
            { email: 'customer@gmail.com', password: hashedPassword, role: 'Customer', fullName: 'Khách hàng', phone: '0988888888', reward_points: 15000 },
        ]);

        // Read products from db_products.products.json
        const jsonPath = path.resolve(__dirname, '../db_products.products.json');
        const jsonRaw = fs.readFileSync(jsonPath, 'utf-8');
        const productsJson = JSON.parse(jsonRaw);

        console.log(`Read ${productsJson.length} products from db_products.products.json`);

        const productsToInsert = productsJson.map((p: any, index: number) => {
            // Determine category
            let catId = categories[1]._id; // default
            if (p.type === 'rx') catId = categories[0]._id;
            else if (p.tags?.includes('Vitamin') || p.tags?.includes('Khoáng chất') || p.type === 'vitamin') catId = categories[2]._id;
            else if (p.form === 'device' || p.type === 'medical_device') catId = categories[3]._id;

            // Map inventory keys to standard format
            const inv = p.inventory || {};
            const stockLocations = {
                'Kho Tổng': inv.main_warehouse ?? inv['Kho Tổng'] ?? 100,
                'CH Quận 1': inv.branch_q1 ?? inv['CH Quận 1'] ?? 50,
                'CH Quận 5': inv.branch_q5 ?? inv['CH Quận 5'] ?? 50,
                stock_quantity: inv.stock_quantity ?? 200,
            };

            return {
                _id: new mongoose.Types.ObjectId(p._id?.$oid || p._id),
                name: p.name,
                genericName: p.genericName || '',
                manufacturer: p.manufacturer || '',
                type: p.type || 'otc',
                form: p.form || 'tablet',
                price: p.price || 0,
                unit: p.unit || 'hộp',
                images: p.images || [],
                description: p.description || '',
                tags: p.tags || [],
                badge: p.badge || (p.type === 'rx' ? 'Rx' : 'Hot'),
                productCode: p.productCode || `MED-${(index + 1).toString().padStart(6, '0')}`,
                tabs: p.tabs || {
                    ingredients: p.genericName || 'Thông tin thành phần đang được cập nhật.',
                    indications: p.description || 'Thông tin chỉ định đang được cập nhật.',
                    dosage: 'Sử dụng theo hướng dẫn chuyên môn hoặc trên bao bì.',
                    sideEffects: 'Đọc kỹ hướng dẫn sử dụng trước khi dùng.',
                },
                inventory: stockLocations,
                stock_quantity: p.stock_quantity ?? 200,
                is_prescription: p.type === 'rx',
                categoryId: catId,
            };
        });

        const insertedProducts = await Product.insertMany(productsToInsert);
        console.log(`Successfully seeded ${insertedProducts.length} products.`);

        // Find some product IDs for rules & samples
        const amox = insertedProducts.find(p => p.name.includes('Amoxicillin'));
        const para = insertedProducts.find(p => p.name.includes('Paracetamol'));
        const omega = insertedProducts.find(p => p.name.includes('Omega-3'));

        if (amox && omega) {
            await AssociationRule.insertMany([
                {
                    antecedentId: amox._id,
                    consequentId: omega._id,
                    confidence: 0.65,
                    lift: 1.5,
                    support: 0.22,
                    reason: 'Khách thường mua thêm thực phẩm bổ sung khi điều trị với kháng sinh.',
                }
            ]);
        }

        const customerUser = users.find((u) => u.role === 'Customer');
        if (customerUser) {
            const year = new Date().getFullYear();
            const rx1Meds = amox ? [
                {
                    productId: amox._id,
                    name: amox.name,
                    quantity: 2,
                    price: amox.price,
                }
            ] : [];

            await PrescriptionVault.insertMany([
                {
                    requestCode: `RX-${year}-001`,
                    customerId: customerUser._id,
                    customerPhone: customerUser.phone,
                    thumbnailUrl: 'https://placehold.co/600x800/e2e8f0/475569?text=Mau+Don+Thuoc+Rx',
                    status: 'APPROVED',
                    prescriptionCode: 'BV115-2401-0001',
                    doctorName: 'BS. Nguyễn Văn A',
                    hospital: 'Bệnh viện 115',
                    diagnosis: 'Viêm họng cấp',
                    medicines: rx1Meds,
                    totalAmount: rx1Meds.reduce((sum, m) => sum + m.price * m.quantity, 0),
                    pharmacistNote: 'Uống sau ăn, duy trì đủ liều trình.',
                }
            ]);

            if (para) {
                const today = new Date();
                const dateStr = today.getFullYear().toString() +
                    (today.getMonth() + 1).toString().padStart(2, '0') +
                    today.getDate().toString().padStart(2, '0');

                await Order.insertMany([
                    {
                        userId: customerUser._id.toString(),
                        orderCode: `ORD-${dateStr}-0001`,
                        items: [{ productId: para._id.toString(), name: para.name, price: para.price, quantity: 2 }],
                        totalAmount: para.price * 2,
                        shippingAddress: '123 Đường Ba Tháng Hai, Quận 10, TP. Hồ Chí Minh',
                        paymentMethod: 'cod',
                        customerName: 'Khách hàng',
                        customerPhone: '0988888888',
                        status: 'COMPLETED'
                    }
                ]);
            }
        }

        console.log('Seed completed successfully for db_users, db_products, db_orders, db_ai using actual product JSON!');
    } catch (error) {
        console.error('Seed failed:', error);
        process.exitCode = 1;
    } finally {
        await Promise.all([
            userConn?.close(),
            productConn?.close(),
            orderConn?.close(),
            aiConn?.close(),
        ]);
    }
};

runSeed();
