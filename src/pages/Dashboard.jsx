import React from 'react'
import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/core/Dashboard/Sidebar"

function Dashboard() {
    const { loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen w-full bg-[#000814]">
  {/* Sidebar */}
  <Sidebar />

  {/* Main Content */}
  <div className="flex flex-1 flex-col overflow-hidden">
    {/* Scrollable Area */}
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-[1260px] px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  </div>
</div>
  )
}

export default Dashboard