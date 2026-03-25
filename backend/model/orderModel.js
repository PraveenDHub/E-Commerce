import mongoose from "mongoose";

// Define the Order schema
// {
//   "_id": "65bcf72a82...",
//   "user": "65aa89bc...",
//   "shippingAddress": {
//     "address": "12 Gandhi Street",
//     "city": "Chennai",
//     "state": "Tamil Nadu",
//     "country": "India",
//     "pinCode": 600042
//   },
//   "orderItems": [
//     {
//       "name": "iPhone 15",
//       "price": 80000,
//       "quantity": 1,
//       "product": "65bcf72a82..."
//     }
//   ],
//   "paymentInfo": {
//     "id": "pi_8392839283",
//     "status": "succeeded"
//   },
//   "itemsPrice": 80000,
//   "taxPrice": 8000,
//   "shippingPrice": 200,
//   "totalPrice": 88200,
//   "orderStatus": "Processing",
//   "paidAt": "2026-03-06T12:30:00Z",
//   "createdAt": "2026-03-06T12:30:00Z"
// }


const orderSchema = new mongoose.Schema({
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        pinCode: { type: Number, required: true },
        phoneNo: { type: Number, required: true }
    },

    orderItems: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            image: { type: String, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            }
        },
    ],

    orderStatus: {
        type: String,
        default: "Processing",
        required: true
    },
    
    //who placed this order like which user 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // These stores payment gateway response details like id and status of payment 
    // paymentInfo: {
    //       id: "pay_987654",
    //       status: "succeeded"
    //    },
    paymentInfo: {
        id: {type: String,required: true},
        status: {type: String,required: true},
    },

    paidAt: {
        type: Date,
        required: true
        },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    deliveredAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },

});

export default mongoose.model("Order", orderSchema);

