import { Minus, Plus, Trash2 } from "lucide-react"
import { useDispatch } from "react-redux";

const CartItem = ({item}) => {
  const dispatch = useDispatch();
  return (
    <div className="flex items-center gap-4 bg-slate-100 py-4 pl-4 pr-1.5 rounded-xl mb-4 border border-slate-100">
      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg shadow-sm"/>

      <div className="flex-1">
        <h3 className="font-semibold text-slate-800">{item.name}</h3>
        <p className="text-sm font-medium text-indigo-600">₹{(item.price*item.quantity).toLocaleString()}</p>
        {/* Trash button should be here But I am designing my own terms*/}
      </div>

      <div className="flex flex-col gap-2 items-end ">
          <button onClick={()=>{}} className="text-slate-400 p-4 hover:text-red-500 transition-colors duration-200">
            <Trash2 size={16}/>
          </button>

        <div className="bg-amber-50 flex items-center gap-0.5 border border-slate-200 rounded-sm shadow-sm overflow-hidden">
          <button onClick={()=>{}} className="w-6 h-6 hover:bg-slate-100 text-slate-600 flex justify-center items-center"><Minus size={20}/></button>
          <span className="w-6 text-center">{item.quantity}</span>
          <button onClick={()=>{}} className=" w-6 h-6 hover:bg-slate-100 text-slate-600 flex justify-center items-center"><Plus size={20}/></button>
        </div>

      </div>
    </div>
  )
}

export default CartItem
