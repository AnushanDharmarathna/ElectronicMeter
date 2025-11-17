import React from 'react'

const AdminHome = ({ setDisplayContent }) => {
    const goToTesting = () => {
    setDisplayContent('AdminTest'); // This changes content without touching sidebar
  };
  return (
    <div className='pt-[70px] w-full h-full'>
        AdminHome
        <button
        onClick={goToTesting}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Open Testing Page (Hidden Navigation)
      </button>
    </div>
  )
}

export default AdminHome