import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaPhoneAlt,
  FaPlus,
  FaUnlock,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useAuth } from "../../contextAPI/UserContext";
import { useNavigate } from "react-router-dom";


const Spinner = () => (
  <div class="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
  <div class="animate-pulse flex space-x-4">
    <div class="rounded-full bg-slate-700 h-10 w-10"></div>
    <div class="flex-1 space-y-6 py-1">
      <div class="h-2 bg-slate-700 rounded"></div>
      <div class="space-y-3">
        <div class="grid grid-cols-3 gap-4">
          <div class="h-2 bg-slate-700 rounded col-span-2"></div>
          <div class="h-2 bg-slate-700 rounded col-span-1"></div>
        </div>
        <div class="h-2 bg-slate-700 rounded"></div>
      </div>
    </div>
  </div>
</div>
);

const SignUp = () => {
  const router = useNavigate();
  const [userauth] = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [type, setType] = useState(true);
  const [addUserModal, setAddUserModal] = useState(false);
  const [editUserModal, setEditUserModal] = useState(false);
  const [editId, setEditId] = useState("");
  const [user, setUser] = useState({
    email: "",
    password: "",
    phone: "",
    role: "",
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!userauth || !userauth.token) {
      router("/"); // Redirect to login page if not authenticated
    } else {
      getAllUsersData();
    }
  }, [userauth, router]);

  const getAllUsersData = async () => {
    setLoading(true); // Start loading spinner
    try {
      const response = await axios.get("https://conscientious-technologies-backend.vercel.app/all-users");
      setUsers(response.data);
      setLoading(false); // Stop loading spinner
    } catch (error) {
      setLoading(false); // Stop loading spinner
      setError("Error fetching user data");
      console.error("Error fetching user data:", error);
    }
  };
  const getRoleName = (role) => {
    switch (role) {
      case 1:
        return "Super Admin";
      case 2:
        return "Admin";
      case 3:
        return "Hr Executive";
      case 4:
        return "Sales Executive";
      case 5:
        return "Content Writer";
      default:
        return "Unknown Role";
    }
  };

  const getRoleNames = () => {
    switch (user.role) {
      case "1":
        return "Super Admin";
      case "2":
        return "Admin";
      case "3":
        return "Hr Executive";
      case "4":
        return "Sales Executive";
      case "5":
        return "Content Writer";
      default:
        return "Unknown Role";
    }
  };

  const updateUserDetails = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://conscientious-technologies-backend.vercel.app/update-user/${editId}`,
        user
      );
      setEditUserModal(false);
      Swal.fire({
        icon: "success",
        text: response.data.message,
      });
      getAllUsersData();
    } catch (error) {
      console.log(error);
    }
  };

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://conscientious-technologies-backend.vercel.app/register", user);
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          text: `${getRoleNames()} registered successfully`,
        });
        setAddUserModal(false);
        getAllUsersData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (delete_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `https://conscientious-technologies-backend.vercel.app/delete-user/${delete_id}`
          );
          if (response.status === 200) {
            Swal.fire({
              title: "Deleted!",
              text: response.data.message,
              icon: "success",
            });
            getAllUsersData();
          }
        } catch (error) {
          console.log(error);
          Swal.fire({
            title: "Error!",
            text: "An error occurred while deleting.",
            icon: "error",
          });
        }
      }
    });
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Calculate the items to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  // Determine the total number of pages
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-white p-4 text-black text-sm">
          <div id="dsp-add-container" className="flex justify-between">
            <h1 className="font-bold text-2xl">users</h1>
            <button
              id="dsp-add"
              onClick={() => setAddUserModal(true)}
              className="mr-2 bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700"
            >
              <FaPlus />
            </button>
          </div>

          {/* Edit User Modal */}
          {editUserModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-gray-300 rounded p-4 border border-gray-400 max-w-md w-full">
                <form className="text-black">
                  <h3 className="text-center text-blue-500 text-xl mb-4">
                    CONSCIENTIOUS TECHNOLOGY
                  </h3>
                  <div className="mb-4 relative">
                    <input
                      type="email"
                      placeholder="Email"
                      value={user.email}
                      className="w-full p-2 border border-gray-400 rounded"
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                    />
                    <FaEnvelope className="icon text-teal-500 absolute top-2 right-2" />
                  </div>

                  <div className="mb-4 relative">
                    <input
                      type={type ? "password" : "text"}
                      placeholder="Password"
                      className="w-full p-2 border border-gray-400 rounded"
                      onChange={(e) =>
                        setUser({ ...user, password: e.target.value })
                      }
                    />
                    {type ? (
                      <FaLock
                        className="icon text-teal-500 absolute top-2 right-2 cursor-pointer"
                        onClick={() => setType(!type)}
                      />
                    ) : (
                      <FaUnlock
                        className="icon text-teal-500 absolute top-2 right-2 cursor-pointer"
                        onClick={() => setType(!type)}
                      />
                    )}
                  </div>

                  <div className="mb-4 relative">
                    <input
                      type="text"
                      placeholder="Mobile Number"
                      value={user.phone}
                      className="w-full p-2 border border-gray-400 rounded"
                      onChange={(e) =>
                        setUser({ ...user, phone: e.target.value })
                      }
                    />
                    <FaPhoneAlt className="icon text-teal-500 absolute top-2 right-2" />
                  </div>

                  <select
                    className="w-full p-2 border-b border-gray-400 mb-4 focus:outline-none focus:border-teal-500"
                    onChange={(e) => setUser({ ...user, role: e.target.value })}
                    value={user.role}
                  >
                    <option value="">Role</option>
                    <option value="1">Super Admin</option>
                    <option value="2">Admin</option>
                    <option value="3">Hr Executive</option>
                    <option value="4">Sales Executive</option>
                    <option value="5">Content Writer</option>
                  </select>

                  <div className="flex justify-between">
                    <button
                      type="submit"
                      className="p-2 bg-teal-500 rounded text-white"
                      onClick={updateUserDetails}
                    >
                      Update Details
                    </button>
                    <button
                      type="button"
                      className="p-2 bg-red-500 rounded text-white"
                      onClick={() => setEditUserModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add User Modal */}
          {addUserModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-gray-300 rounded p-4 border border-gray-400 max-w-md w-full">
                <form className="text-black">
                  <h3 className="text-center text-blue-500 text-xl mb-4">
                    CONSCIENTIOUS TECHNOLOGY
                  </h3>
                  <div className="mb-4 relative">
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full p-2 border border-gray-400 rounded"
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                    />
                    <FaEnvelope className="icon text-teal-500 absolute top-2 right-2" />
                  </div>

                  <div className="mb-4 relative">
                    <input
                      type={type ? "password" : "text"}
                      placeholder="Password"
                      className="w-full p-2 border border-gray-400 rounded"
                      onChange={(e) =>
                        setUser({ ...user, password: e.target.value })
                      }
                    />
                    {type ? (
                      <FaLock
                        className="icon text-teal-500 absolute top-2 right-2 cursor-pointer"
                        onClick={() => setType(!type)}
                      />
                    ) : (
                      <FaUnlock
                        className="icon text-teal-500 absolute top-2 right-2 cursor-pointer"
                        onClick={() => setType(!type)}
                      />
                    )}
                  </div>

                  <div className="mb-4 relative">
                    <input
                      type="text"
                      placeholder="Mobile Number"
                      className="w-full p-2 border border-gray-400 rounded"
                      onChange={(e) =>
                        setUser({ ...user, phone: e.target.value })
                      }
                    />
                    <FaPhoneAlt className="icon text-teal-500 absolute top-2 right-2" />
                  </div>

                  <select
                    className="w-full p-2 border-b border-gray-400 mb-4 focus:outline-none focus:border-teal-500"
                    onChange={(e) => setUser({ ...user, role: e.target.value })}
                    value={user.role}
                  >
                    <option value="">Role</option>
                    <option value="1">Super Admin</option>
                    <option value="2">Admin</option>
                    <option value="3">Hr Executive</option>
                    <option value="4">Sales Executive</option>
                    <option value="5">Content Writer</option>
                  </select>

                  <div className="flex justify-between">
                    <button
                      type="submit"
                      className="p-2 bg-teal-500 rounded text-white"
                      onClick={registerUser}
                    >
                      Add User
                    </button>
                    <button
                      type="button"
                      className="p-2 bg-red-500 rounded text-white"
                      onClick={() => setAddUserModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="table-container">
            <table className="w-full mt-4 border-gray-400">
              <thead className="bg-gray-800 text-white text-left">
                <tr>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Role</th>
                  <th className="py-2 px-4">Phone</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((user) => (
                  <tr key={user._id} className="border-b border-gray-400">
                    <td className="border-x border-gray-400 py-2 px-4">
                      {user.email}
                    </td>
                    <td className="border-r border-gray-400 py-2 px-4">
                      {getRoleName(user.role)}
                    </td>
                    <td className="border-r border-gray-400 py-2 px-4">
                      {user.phone}
                    </td>
                    <td className="border-r border-gray-400 py-2 px-4 flex space-x-2 justify-center">
                      <button
                        className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700"
                        onClick={() => {
                          setAddUserModal(false);
                          setEditUserModal(true);
                          setEditId(user._id);
                          setUser({
                            email: user.email,
                            phone: user.phone,
                            role: user.role,
                            password: user.password
                          });
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700"
                        onClick={() => deleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4 space-x-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white"
              }`}
            >
              Previous
            </button>

            <span className="px-4 py-2 font-semibold text-black">
              {currentPage}
            </span>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUp;
