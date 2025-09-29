const OpenModel = ({
  isOpen,
  title,
  message,
  btnMessage,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-800/10 flex justify-center items-center z-50">
      <div className="flex flex-col gap-5 bg-gray-50 p-7 px-10 shadow-lg shadow-gray-400 rounded-xl">
        <div className="font-bold text-xl text-gray-800">{title}</div>
        <div className="font-medium text-lg text-gray-700">{message}</div>
        <div className="flex gap-5 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
          >
            {btnMessage}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpenModel;
