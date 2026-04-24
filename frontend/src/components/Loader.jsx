const Loader = () => {
  return (
    <div className="flex justify-center min-h-screen items-center py-10">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-amber-500 rounded-full animate-spin"></div>
      <p className="ml-2 text-gray-600">Loading...</p>
    </div>
  );
};

export default Loader;