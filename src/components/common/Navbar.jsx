import React, { useEffect, useRef, useState } from "react"
import {
  AiOutlineMenu,
  AiOutlineShoppingCart,
  AiOutlineClose,
} from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { useSelector } from "react-redux"
import { Link, matchPath, useLocation } from "react-router-dom"

import logo from "../../assets/Images/logo.jpg"
import { NavbarLinks } from "../../data/Navbar-link"
import { apiConnector } from "../../services/apiconnector"
import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constant"
import ProfileDropdown from "../core/Auth/ProfileDropDown"

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false)
  const [desktopCoursesOpen, setDesktopCoursesOpen] = useState(false)

  const desktopDropdownRef = useRef(null)

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        setSubLinks(res?.data?.data || [])
      } catch (error) {
        console.log("Could not fetch categories", error)
      }
      setLoading(false)
    }
    fetchCategories()
  }, [])

  /* ================= CLOSE DESKTOP DROPDOWN ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(e.target)
      ) {
        setDesktopCoursesOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () =>
      document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <header
      className={`relative z-50 flex h-14 items-center justify-center border-b border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-[#161D29]" : ""
      }`}
    >
      <div className="flex w-11/12 max-w-[1260px] items-center justify-between">
        {/* ================= LOGO ================= */}
        <Link to="/" onClick={() => setMobileMenuOpen(false)}>
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-[#DBDDEA]">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Courses" ? (
                  <div
                    ref={desktopDropdownRef}
                    className="relative"
                  >
                    <button
                      onClick={() =>
                        setDesktopCoursesOpen(!desktopCoursesOpen)
                      }
                      className="flex items-center gap-1"
                    >
                      Courses
                      <BsChevronDown
                        className={`transition-transform ${
                          desktopCoursesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {desktopCoursesOpen && (
                      <div className="absolute left-1/2 top-full z-50 w-[260px] -translate-x-1/2 rounded-lg bg-[#F1F2FF] p-4 text-[#000814] shadow-lg">
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : subLinks?.length ? (
                          subLinks
                            .filter((s) => s?.courses?.length > 0)
                            .map((s, i) => (
                              <Link
                                key={i}
                                to={`/catalog/${s.name
                                  .replaceAll(" ", "-")
                                  .toLowerCase()}`}
                                onClick={() =>
                                  setDesktopCoursesOpen(false)
                                }
                                className="block rounded-lg px-3 py-2 hover:bg-[#C5C7D4]"
                              >
                                {s.name}
                              </Link>
                            ))
                        ) : (
                          <p className="text-center">No Courses</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={
                      matchRoute(link.path)
                        ? "text-[#FFE83D]"
                        : ""
                    }
                  >
                    {link.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* ================= DESKTOP ACTIONS ================= */}
        <div className="hidden md:flex items-center gap-x-4">
          {user && user.role !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-[#787d92]" />
              {totalItems > 0 && (
                <span className="absolute -bottom-1 -right-2 grid h-5 w-5 place-items-center rounded-full bg-blue-600 text-xs text-white">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {token ? (
            <ProfileDropdown />
          ) : (
            <>
              <Link to="/login">
                <button className="btn text-white">Log in</button>
              </Link>
              <Link to="/signup">
                <button className="btn text-white">Sign up</button>
              </Link>
            </>
          )}
        </div>

        {/* ================= MOBILE MENU BUTTON ================= */}
        <button
          className="md:hidden text-[#AFB2BF]"
          onClick={() => setMobileMenuOpen(true)}
        >
          <AiOutlineMenu size={26} />
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[999] bg-[#000814] md:hidden">
          <div className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
            <img src={logo} alt="logo" width={120} />
            <button onClick={() => setMobileMenuOpen(false)}>
              <AiOutlineClose size={26} className="text-white" />
            </button>
          </div>

          <nav className="flex flex-col gap-4 px-6 py-6 text-white">
            {NavbarLinks.map((link, i) => (
              <div key={i} className="border-b border-gray-700 pb-2">
                {link.title === "Courses" ? (
                  <>
                    <button
                      onClick={() =>
                        setMobileCoursesOpen(!mobileCoursesOpen)
                      }
                      className="flex w-full items-center justify-between text-lg"
                    >
                      <span>Courses</span>
                      <BsChevronDown
                        className={`transition-transform ${
                          mobileCoursesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {mobileCoursesOpen && (
                      <div className="mt-3 ml-4 flex flex-col gap-2 text-sm text-gray-300">
                        {loading ? (
                          <p>Loading...</p>
                        ) : subLinks?.length ? (
                          subLinks
                            .filter((s) => s?.courses?.length > 0)
                            .map((s, idx) => (
                              <Link
                                key={idx}
                                to={`/catalog/${s.name
                                  .replaceAll(" ", "-")
                                  .toLowerCase()}`}
                                onClick={() => {
                                  setMobileMenuOpen(false)
                                  setMobileCoursesOpen(false)
                                }}
                                className="hover:text-yellow-400"
                              >
                                {s.name}
                              </Link>
                            ))
                        ) : (
                          <p>No Courses</p>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg"
                  >
                    {link.title}
                  </Link>
                )}
              </div>
            ))}

            <div className="mt-4 flex flex-col gap-3">
              {token ? (
                <ProfileDropdown />
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar
