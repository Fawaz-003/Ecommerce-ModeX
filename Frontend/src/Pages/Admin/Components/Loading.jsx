
const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-30 flex justify-center items-center z-50">
      <div className="flex flex-row gap-5 bg-white p-7 px-10 shadow-2xl rounded-xl">
        {/* Spinner */}
        <div className="w-7 h-7 border-4 border-gray-100 border-t-red-500 rounded-full animate-spin"></div>
        {/* Message */}
        <p className="text-gray-900 text-lg font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
