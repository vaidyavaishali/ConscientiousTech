import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contextAPI/UserContext";


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

const OurPartener = () => {
  const router = useNavigate();
  const [userauth] = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userauth || !userauth.token) {
      router("/"); // Redirect to login page if not authenticated
    } else {
      fetchOurPartenerData();
    }
  }, [userauth, router]);
  const [OurPartenerData, setOurPartenerData] = useState([]);
  const [addOurPartenerData, setAddOurPartenerData] = useState({
    title: "",
    logo: "",
  });
  const [editOurPartenerData, setEditOurPartenerData] = useState({
    title: "",
    logo: "",
  });
  const [addOurPartenerDatashow, setAddOurPartenerDataShow] = useState(false);
  const [editOurPartenerDataShow, setEditOurPartenerDataShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editSelectedFile, setEditSelectedFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  const handleAddSelectedFile = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setAddOurPartenerData((prev) => ({ ...prev, logo: file }));
  };

  const handleEditSelectedFile = (e) => {
    const file = e.target.files[0];
    setEditSelectedFile(file);
    setEditOurPartenerData((prev) => ({ ...prev, logo: file }));
  };

  const addOurPartenerDatafunc = async () => {
    try {
      const formData = new FormData();
      formData.append("title", addOurPartenerData.title);
      formData.append("logo", addOurPartenerData.logo);

      const response = await axios.post(
        "https://conscientious-technologies-backend.vercel.app/add-partener-data",
        formData
      );
      if (response.status === 200) {
        setAddOurPartenerDataShow(false);
        setAddOurPartenerData({ title: "", logo: "" });
        fetchOurPartenerData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOurPartenerData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://conscientious-technologies-backend.vercel.app/get-partener-data"
      );
      setOurPartenerData(response.data.getdata);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Error fetching user data");
      setLoading(false);
    }
  };

  //edit our partener data

  const editOurPartenerDatafunc = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save these changes?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const formData = new FormData();
          formData.append("title", editOurPartenerData.title);
          formData.append("logo", editOurPartenerData.logo);
          const response = await axios.put(
            `https://conscientious-technologies-backend.vercel.app/edit-partener-data/${editId}`,
            formData
          );
          console.log(response.status);
          if (response.status === 200) {
            setEditId(null);
            setEditOurPartenerDataShow(false);
            fetchOurPartenerData();
            Swal.fire("Saved!", "Your changes have been saved.", "success");
          }
        } catch (error) {
          console.log(error);
          Swal.fire(
            "Error!",
            "Failed to save changes. Please try again later.",
            "error"
          );
        }
      }
    });
  };

  //delete Our Partener Data

  const deleteOurPartenerData = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // If user confirms deletion
        try {
          const response = await axios.delete(
            `https://conscientious-technologies-backend.vercel.app/delete-partener-data/${id}`
          );
          if (response.status === 200) {
            setEditId(null);
            fetchOurPartenerData();
            Swal.fire("Deleted!", "Your data has been deleted.", "success");
          }
        } catch (error) {
          console.log(error);
          Swal.fire(
            "Error!",
            "Failed to delete data. Please try again later.",
            "error"
          );
        }
      }
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = OurPartenerData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
    {loading ? (
        <Spinner />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="w-full bg-gray-300 h-full mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-xl text-black font-bold">Our Parteners</h1>
        <div className="text-white mb-5 mr-5 hover:scale-[1.1] bg-blue-500 hover:bg-blue-700 rounded-sm">
          <Button
            onClick={() => {
              setAddOurPartenerDataShow(true);
            }}
            className="text-base text-white font-bold"
          >
            +
          </Button>
        </div>
      </div>

      {/* add hero section modal */}
      <Modal
        show={addOurPartenerDatashow}
        onHide={() => {
          setAddOurPartenerDataShow(false);
        }}
      >
        <Modal.Header closeButton className="bg-gray-800 text-white">
          <Modal.Title>Add Hero Section Data</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-white">
          <form className="mx-auto max-w-lg">
            <fieldset className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-bold">
                Title
              </label>
              <input
                type="text"
                name="hero_title"
                id="title"
                className="form-input mt-1 block w-full rounded-md border border-gray-300 focus:border-blue-500"
                onChange={(e) => {
                  setAddOurPartenerData({
                    ...addOurPartenerData,
                    title: e.target.value,
                  });
                }}
              />
            </fieldset>

            <fieldset className="mb-4">
              <label htmlFor="hero-home-image" className="block font-bold">
                Logo
              </label>
              <div className="relative">
                <div>
                  <input
                    type="file"
                    name="hero_image"
                    id="hero-home-image"
                    className="mt-1 block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded file:text-sm file:font-semibold file:bg-gray-50 hover:file:bg-gray-100"
                    aria-describedby="file-upload-label"
                    onChange={handleAddSelectedFile}
                  />
                </div>
                {selectedFile && (
                  <div className="ml-2 mt-4">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Selected File"
                      className="w-24 h-14 object-cover rounded-md border border-gray-300 mt-2"
                    />
                    <p className="text-gray-700">{selectedFile.name}</p>
                  </div>
                )}
              </div>
            </fieldset>
          </form>
        </Modal.Body>
        <Modal.Footer className="bg-gray-100">
          <Button
            variant="secondary"
            onClick={() => setAddOurPartenerDataShow(false)}
            className="text-gray-700 hover:text-gray-900"
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setAddOurPartenerDataShow(false);
              addOurPartenerDatafunc();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* edit hero section modal */}

      <Modal
        show={editOurPartenerDataShow}
        onHide={() => {
          setEditOurPartenerDataShow(false);
        }}
      >
        <Modal.Header closeButton className="bg-gray-800 text-white">
          <Modal.Title>Edit Hero Section Data</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-white">
          <form className="mx-auto max-w-lg">
            <fieldset className="mb-4">
              <label
                htmlFor="our-partener"
                className="block text-gray-700 font-bold"
              >
                Our Partener Title
              </label>
              <input
                name="our-partener"
                id="our-partener"
                className="form-textarea mt-1 block w-full rounded-md border border-gray-300 focus:border-blue-500"
                onChange={(e) => {
                  setEditOurPartenerData({
                    ...editOurPartenerData,
                    title: e.target.value,
                  });
                }}
              ></input>
            </fieldset>
            <fieldset className="mb-4">
              <label htmlFor="hero-home-image" className="block font-bold">
                Our Partener Logo
              </label>
              <div className="relative">
                <div>
                  <input
                    type="file"
                    name="hero_image"
                    id="hero-home-image"
                    className="form-input  block w-full rounded-md overflow-hidden"
                    aria-describedby="file-upload-label"
                    onChange={handleEditSelectedFile}
                  />
                  <label
                    htmlFor="hero-home-image"
                    id="file-upload-label"
                    className="cursor-pointer hover:bg-blue-700 font-bold py-2 px-4 rounded-md border"
                  >
                    Upload File
                  </label>
                </div>
                {editSelectedFile && (
                  <div className="ml-2 mt-4">
                    <img
                      src={URL.createObjectURL(editSelectedFile)}
                      alt="Selected File"
                      className="w-24 h-14 object-cover rounded-md border border-gray-300 mt-2"
                    />
                    <p className="text-gray-700">{editSelectedFile.name}</p>
                  </div>
                )}
              </div>
            </fieldset>
          </form>
        </Modal.Body>
        <Modal.Footer className="bg-gray-100">
          <Button
            variant="secondary"
            onClick={() => {
              setEditOurPartenerDataShow(false);
            }}
            className="text-gray-700 hover:text-gray-900"
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setEditOurPartenerDataShow(false);
              editOurPartenerDatafunc();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <table className="w-full border-collapse border bg-white">
        <thead className="bg-gray-800 text-white">
          <tr >
            <th className="border p-2">Sr. No</th>
            <th className="border p-2">Our Partener Title</th>
            <th className="border p-2">Our Partener logo</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index} className="text-left border-b">
              <td className="border p-1">{index + indexOfFirstItem + 1}</td>
              <td className="border p-1">{item.title}</td>
              {/* <td className="border p-1">{item.heroHomedesc}</td> */}
              <td className="border p-1">
                <img
                  src={item.logo}
                  alt={item.title}
                  className="w-[60px] h-[60px]"
                />
              </td>
              <td className="p-1 flex gap-x-[10px]">
                <Button
                  onClick={() => {
                    setEditOurPartenerData({
                      title: item.title,
                      logo: item.logo,    
                    })
                      setEditOurPartenerDataShow(true);
                      setEditId(item._id);
                    
                  }}
                >
                  Edit
                </Button>
                <button
                  className="bg-[red] px-[20px] rounded-[7px] text-white shadow-md"
                  onClick={() => {
                    deleteOurPartenerData(item._id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <ul className="flex justify-center mt-4">
        {[
          ...Array(Math.ceil(OurPartenerData.length / itemsPerPage)).keys(),
        ].map((number) => (
          <li key={number} className="mx-1">
            <button
              onClick={() => paginate(number + 1)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {number + 1}
            </button>
          </li>
        ))}
      </ul>
    </div>
      )}
    </>
    
  );
};

export default OurPartener;
