import { ArrowRight, ShoppingBag } from "lucide-react"
import { clearCart } from "../features/products/Cart/cartSlice"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const CartSummary = ({total,cartItemsCount}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {isAuthenticated,user} = useSelector((state)=>state.user);
  
  const handleCheckout = () => {
      if (!isAuthenticated && !user) {
        navigate("/login?redirect=shipping");
      } else {
        navigate("/shipping");
      }
  };

  return (
    <div className=" flex flex-col">
      <div className="flex items-center justify-between gap-2 mb-6">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-800"><ShoppingBag className="text-indigo-600"/>
        Your Cart
        </h2>
        <span className="text-indigo-600 px-2 font-semibold bg-indigo-100 rounded-2xl">{cartItemsCount} items</span>        
      </div>

      <div className="space-y-4 flex-1">
        <div className="flex justify-between">
          <span className='text-sm text-slate-500'>SubTotal</span>
          <span className='text-sm text-slate-500'>₹ {total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className='text-sm text-slate-500'>Tax(18%)</span>
          <span className='text-sm text-slate-500'>₹ {(total * 0.18).toLocaleString()}</span>
        </div>
        <div className="border-b border-slate-200 my-4"></div>
      </div>

      <div>
        <h3 className="flex justify-between text-lg font-semibold">Total <span className="text-indigo-600">₹ {(total + (total * 0.18)).toLocaleString()}</span></h3>
      </div>

      <button onClick={()=>{handleCheckout()}} className="disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer group w-full bg-indigo-600 text-white font-medium py-2 rounded-lg mt-8 shadow-sm flex items-center justify-center hover:bg-indigo-700 transition-colors">
        <span className="group-hover:font-bold">Checkout</span>
        <ArrowRight className="group-hover:translate-x-1 transition-all duration-160 ml-2"/>
      </button>

      <button onClick={()=>{dispatch(clearCart())}} className="text-xs mt-3 text-red-500 hover:underline font-medium">Clear Cart</button>

    </div>
  )
}

export default CartSummary
