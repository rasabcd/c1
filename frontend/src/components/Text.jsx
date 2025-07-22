import React from 'react'

const Text = ({profile}) => {
  return (
        <div className="w-full text-center py-4 bg-purple-50 border-b border-purple-200">
        <h1 className="text-2xl font-semibold text-purple-700">
           Welcome {profile?.fullName || "User"} to Codeforces Upsolver!
        </h1>
        <p className="text-sm text-purple-500 mt-1">
          Stay consistent. Keep solving. Grow your rating!
        </p>
      </div>
  )
}

export default Text