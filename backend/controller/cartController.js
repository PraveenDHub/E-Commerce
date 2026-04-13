import User from "../model/userModel.js";
import Product from "../model/productModel.js";

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "cartItems.product",
      "name price images stock",
    );
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found Sorry! Could not get your cart" });
    }

    res.status(200).json({
      success: true,
      cartItems: user.cartItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const saveCart = async (req, res) => {
//   try {
//     const { cartItems } = req.body;
//     const user = await User.findById(req.user.id);
//     if(!user){
//       return res.status(404).json({ message: "User not found Sorry! Could not save your cart" });
//     }
//     user.cartItems = cartItems;
//     await user.save();
//     res.status(200).json({
//       success: true,
//       cartItems: user.cartItems,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const addToCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Please login to add items to cart",
      });
    }
    const { productId, quantity } = req.body;

    const user = await User.findById(req.user.id);
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const itemIndex = user.cartItems.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex > -1) {
      // 🔁 Update quantity
      user.cartItems[itemIndex].quantity += quantity;
    } else {
      // ➕ Add new item
      user.cartItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url,
        quantity,
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      cartItems: user.cartItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);

    user.cartItems = user.cartItems.filter(
      (item) => item.product.toString() !== productId,
    );

    await user.save();

    res.status(200).json({
      success: true,
      cartItems: user.cartItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const user = await User.findById(req.user.id);

    const item = user.cartItems.find(
      (item) => item.product.toString() === productId,
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      // ❌ Remove item if qty 0
      user.cartItems = user.cartItems.filter(
        (i) => i.product.toString() !== productId,
      );
    } else {
      item.quantity = quantity;
    }

    await user.save();

    res.status(200).json({
      success: true,
      cartItems: user.cartItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.cartItems = [];
    await user.save();

    res.status(200).json({
      success: true,
      cartItems: [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
