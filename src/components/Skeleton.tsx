const BibleQuoteSkeleton = () => {
  return (
    <div className="text-center flex flex-col items-center justify-center gap-y-2 w-[23rem] p-3 bg-gray-200 animate-pulse rounded-lg">
      <p className="font-semibold underline text-[1.1rem] bg-gray-300 w-24 h-6 rounded"></p>
      <div className="flex flex-col gap-y-2 w-full">
        <p className="bg-gray-300 w-full h-4 rounded"></p>
        <p className="bg-gray-300 w-full h-4 rounded"></p>
        <p className="bg-gray-300 w-full h-4 rounded"></p>
      </div>
    </div>
  )
}

export default BibleQuoteSkeleton
