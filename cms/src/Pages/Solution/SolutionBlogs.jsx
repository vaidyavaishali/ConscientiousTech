import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaEye } from "react-icons/fa";
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
const SolutionBlogCMS = () => {
  const router = useNavigate();
  const [userauth] = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userauth || !userauth.token) {
      router("/"); // Redirect to login page if not authenticated
    } else {
      fetchSolutions();
      fetchBlogs();
    }
  }, [userauth, router]);
  const [solutions, setSolutions] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [viewCardData, setViewCardData] = useState(null);
  const [viewHeaderData, setViewHeaderData] = useState(null);
  const [viewArticleData, setViewArticleData] = useState(null);
  const [viewBlogTagsData, setViewBlogTagsData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBlogs? filteredBlogs.slice(indexOfFirstItem, indexOfLastItem):[];
  const [formData, setFormData] = useState({
    category: "Solution",
    subCategory: "",
    cardHeading: "",
    cardSubHeading: "",
    articleData: [{ Title: "", Desc: "" }], // Initialize as array of objects
    blogTags: "",
    cardImage: null,
    headerImage: null,
    headerTitle: "",
    HeaderDesc: "",
  });

  // Fetch all blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://conscientious-technologies-backend.vercel.app/get-latest-blog-data-by-category/Solution"
      );
      setBlogs(response.data.blog);
      setFilteredBlogs(response.data.blog);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("error fetching Data");
    }
  };

  // Fetch all solutions
  const fetchSolutions = async () => {
    try {
      const response = await axios.get(
        "https://conscientious-technologies-backend.vercel.app/get-latest-solution-data"
      );
      setSolutions(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };
  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  // Handle changes in articleData (Title/Desc)
  const handleArticleChange = (index, e) => {
    const newArticleData = [...formData.articleData];
    newArticleData[index][e.target.name] = e.target.value;
    setFormData({ ...formData, articleData: newArticleData });
  };

  // Add new article
  const addArticle = () => {
    setFormData({
      ...formData,
      articleData: [...formData.articleData, { Title: "", Desc: "" }],
    });
  };

  // Remove article
  const removeArticle = (index) => {
    const newArticleData = formData.articleData.filter((_, i) => i !== index);
    setFormData({ ...formData, articleData: newArticleData });
  };

  // Open modal for editing or adding new blog
  const toggleModal = (blog = null) => {
    if (blog) {
      setCurrentBlog(blog);
      setFormData({
        category: blog.category,
        subCategory: blog.subCategory,
        cardHeading: blog.cardHeading,
        cardSubHeading: blog.cardSubHeading,
        articleData: blog.articleData || [{ Title: "", Desc: "" }], // Load article data or empty array
        blogTags: blog.blogTags,
        cardImage: null,
        headerImage: null,
        headerTitle: blog.headerTitle,
        HeaderDesc: blog.HeaderDesc,
      });
    } else {
      setCurrentBlog(null);
      setFormData({
        category: "Solution",
        subCategory: "",
        cardHeading: "",
        cardSubHeading: "",
        articleData: [{ Title: "", Desc: "" }], // Reset articleData to one empty item
        blogTags: "",
        cardImage: null,
        headerImage: null,
      });
    }
    setIsModalOpen(!isModalOpen);
  };

  // Function to open the popup with card data
  const viewCardDetails = (blog) => {
    setViewCardData(blog);
  };
  const viewHeaderDetails = (blog) => {
    console.log(blog);
    setViewHeaderData(blog);
  };

  const viewArticleDetails = (blog) => {
    setViewArticleData(blog);
  };
  // Function to open the popup with blog tags data
  const viewBlogTagsDetails = (blog) => {
    const blogTag = blog.blogTags.split(", ");
    setViewBlogTagsData(blogTag);
    // console.log(blogTag)
  };

  // Submit blog data (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "articleData") {
        form.append(key, JSON.stringify(formData[key])); // Convert articleData to JSON string
      } else {
        form.append(key, formData[key]);
      }
    });

    try {
      if (currentBlog) {
        // Update existing blog
        await axios.put(
          `https://conscientious-technologies-backend.vercel.app/edit-existing-blog-data/${currentBlog._id}`,
          form,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        // Create new blog
        await axios.post("https://conscientious-technologies-backend.vercel.app/create-new-blog-data", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchBlogs();
      toggleModal();
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  // Delete blog
  const handleDelete = async (id) => {
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
        try {
          await axios.delete(
            `https://conscientious-technologies-backend.vercel.app/delete-existing-blog-data-by-id/${id}`
          );
          Swal.fire("Deleted!", "Your data has been deleted.", "success");
          fetchBlogs();
        } catch (error) {
          console.error("Error deleting blog:", error);
          Swal.fire("Error", "Failed to delete data.", "error");
        }
      }
    });
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="container mx-auto mt-5 bg-gray-200 p-4">
          <div className="flex justify-between mb-4">
            <h1 className="text-xl font-bold">Manage Blogs for Solutions</h1>
            <select
              name=""
              id=""
              onChange={(e) => {
                if (e.target.value === "All") {
                  setFilteredBlogs(blogs);
                } else {
                  const filtered = blogs.filter(
                    (blog) => blog.subCategory === e.target.value
                  );
                  setFilteredBlogs(filtered);
                }
              }}
            >
              <option value="All">All</option>
              {blogs &&
                blogs.map((blog) => (
                  <option key={blog._id} value={blog.subCategory}>
                    {blog.subCategory}
                  </option>
                ))}
            </select>
            <Button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => toggleModal()}
            >
              Add New Blog
            </Button>
          </div>

          <table className="w-full border-collapse border mt-4">
            <thead className="bg-gray-800 text-white">
              <tr className="border-b py-2">
                <th className="border-r px-2 py-2">Category</th>
                <th className="border-r px-2 py-2">Subcategory</th>
                <th className="border-r px-2 py-2">Card Data</th>
                <th className="border-r px-2 py-2">Header Data</th>
                <th className="border-r px-2 py-2">Article Data</th>
                <th className="border-r px-2 py-2">Blog Tags</th>
                <th className="border-r px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems &&
                currentItems.map((blog) => (
                  <tr key={blog._id} className="border-b py-2">
                    <td className="border-r px-2 py-2">{blog.category}</td>
                    <td className="border-r px-2 py-2">{blog.subCategory}</td>
                    <td
                      className="border-r px-2 py-2"
                      onClick={() => viewCardDetails(blog)}
                      style={{ cursor: "pointer" }}
                    >
                      <FaEye />
                    </td>
                    <td
                      className="border-r px-2 py-2"
                      onClick={() => viewHeaderDetails(blog)}
                      style={{ cursor: "pointer" }}
                    >
                      <FaEye />
                    </td>
                    <td
                      className="border-r px-2 py-2"
                      onClick={() => viewArticleDetails(blog)}
                      style={{ cursor: "pointer" }}
                    >
                      <FaEye />
                    </td>
                    <td
                      className="border-r px-2 py-2"
                      onClick={() => viewBlogTagsDetails(blog)}
                      style={{ cursor: "pointer" }}
                    >
                      <FaEye />
                    </td>{" "}
                    <td className="border-r px-2 py-2">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                        size="sm"
                        onClick={() => toggleModal(blog)}
                      >
                        Edit
                      </button>{" "}
                      <button
                        className="hover:bg-red-700 bg-[red] px-2 py-1 rounded text-white shadow-md"
                        size="sm"
                        onClick={() => handleDelete(blog._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {/* Pagination */}
          <ul className="flex justify-center gap-[20px] mt-[90px]">
            <li>
              <button
                onClick={() =>
                  setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
                }
                className="bg-blue-500 hover:bg-blue-700 py-2 px-2 rounded text-white font-semibold"
              >
                Prev
              </button>
            </li>
            <li className="py-2 px-2 text-black font-semibold">
              {currentPage}
            </li>
            <li>
              <button
                onClick={() =>
                  setCurrentPage((prevPage) =>
                    Math.min(
                      prevPage + 1,
                      Math.ceil(blogs.length / itemsPerPage)
                    )
                  )
                }
                className="bg-blue-500 hover:bg-blue-700 py-2 px-2 rounded text-white font-semibold"
              >
                Next
              </button>
            </li>
          </ul>
          {/* Add/Edit Modal */}
          <Modal show={isModalOpen} onHide={() => toggleModal()} centered>
            <form onSubmit={handleSubmit} className="font-semibold">
              <Modal.Header closeButton className="bg-gray-800 text-white">
                <Modal.Title className="text-lg font-bold">
                  {currentBlog ? "Edit Blog" : "Add Blog"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="space-y-4">
                  <div className="mb-4">
                    <label className="block text-gray-700">solution Name</label>
                    <select
                      name=""
                      value={formData.subCategory}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subCategory: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded"
                      id=""
                    >
                      <option value="">Select solution</option>
                      {solutions.map((solution, index) => (
                        <option key={index} value={solution.solutionName}>
                          {solution.solutionName}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Header Title Field */}
                  <div className="mb-4">
                    <label className="font-semibold">Header Heading</label>
                    <input
                      type="text"
                      name="headerTitle"
                      value={formData.headerTitle}
                      onChange={handleInputChange}
                      className="form-control border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Header Description Field */}
                  <div className="mb-4">
                    <label className="font-semibold">Header Description</label>
                    <input
                      type="text"
                      name="HeaderDesc"
                      value={formData.HeaderDesc}
                      onChange={handleInputChange}
                      className="form-control border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Card Heading Field */}
                  <div className="mb-4">
                    <label className="font-semibold">Card Heading</label>
                    <input
                      type="text"
                      name="cardHeading"
                      value={formData.cardHeading}
                      onChange={handleInputChange}
                      className="form-control border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Card Subheading Field */}
                  <div className="mb-4">
                    <label className="font-semibold">Card Subheading</label>
                    <input
                      type="text"
                      name="cardSubHeading"
                      value={formData.cardSubHeading}
                      onChange={handleInputChange}
                      className="form-control border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Blog Tags Field */}
                  <div className="mb-4">
                    <label className="font-semibold">
                      Blog Tags (Separated By Commas)
                    </label>
                    <input
                      type="text"
                      name="blogTags"
                      value={formData.blogTags}
                      onChange={handleInputChange}
                      className="form-control border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Article Data Section */}
                  <div className="mb-4">
                    <label className="font-semibold">Article Data</label>
                    {formData.articleData.map((article, index) => (
                      <div key={index} className="mb-2">
                        <input
                          type="text"
                          name="Title"
                          placeholder="Title"
                          value={article.Title}
                          onChange={(e) => handleArticleChange(index, e)}
                          className="form-control border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1"
                        />
                        <textarea
                          name="Desc"
                          placeholder="Description"
                          value={article.Desc}
                          onChange={(e) => handleArticleChange(index, e)}
                          className="form-control border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1"
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeArticle(index)}
                          className="text-black"
                        >
                          Remove Article
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="success"
                      size="sm"
                      onClick={addArticle}
                      className="text-black"
                    >
                      Add Article
                    </Button>
                  </div>

                  {/* Card Image Field */}
                  <div className="mb-4">
                    <label className="font-semibold">Card Image</label>
                    <input
                      type="file"
                      name="cardImage"
                      onChange={handleFileChange}
                      className="form-control"
                    />
                  </div>

                  {/* Header Image Field */}
                  <div className="mb-4">
                    <label className="font-semibold">Header Image</label>
                    <input
                      type="file"
                      name="headerImage"
                      onChange={handleFileChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => toggleModal()}
                  className="text-black"
                >
                  Close
                </Button>
                <Button type="submit" variant="primary" className="text-black">
                  {currentBlog ? "Update Blog" : "Add Blog"}
                </Button>
              </Modal.Footer>
            </form>
          </Modal>

          {/* // Modal to view card data */}
          <Modal
            show={viewCardData !== null}
            onHide={() => setViewCardData(null)}
            centered
          >
            <Modal.Header closeButton className="border-b border-gray-200">
              <Modal.Title className="text-lg font-bold text-gray-800">
                Card Details
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="space-y-6">
              {viewCardData && (
                <>
                  {/* Card Heading */}
                  <div className="mb-4">
                    <label className="block font-semibold text-gray-700">
                      Card Heading:
                    </label>
                    <h5 className="text-lg font-medium text-gray-900">
                      {viewCardData.cardHeading}
                    </h5>
                  </div>

                  {/* Card Subheading */}
                  <div className="mb-4">
                    <label className="block font-semibold text-gray-700">
                      Card Subheading:
                    </label>
                    <h5 className="text-lg font-medium text-gray-900">
                      {viewCardData.cardSubHeading}
                    </h5>
                  </div>

                  {/* Card Image */}
                  <div className="mb-4">
                    <label className="block font-semibold text-gray-700">
                      Card Image:
                    </label>
                    {viewCardData.cardImage ? (
                      <img
                        src={viewCardData.cardImage}
                        alt="Card"
                        className="img-fluid rounded shadow-md max-w-full h-auto border border-gray-300"
                      />
                    ) : (
                      <p className="text-gray-500">No image available</p>
                    )}
                  </div>
                </>
              )}
            </Modal.Body>
            <Modal.Footer className="border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={() => setViewCardData(null)}
                className="bg-gray-500 text-white"
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* // Modal to view header data */}
          <Modal
            show={viewHeaderData !== null}
            onHide={() => setViewHeaderData(null)}
            centered
          >
            <Modal.Header closeButton className="border-b border-gray-200">
              <Modal.Title className="text-lg font-bold text-gray-800">
                Header Details
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="space-y-6">
              {viewHeaderData && (
                <>
                  {/* Header Title */}
                  <div className="mb-4">
                    <label className="block font-semibold text-gray-700">
                      Header Title:
                    </label>
                    <h5 className="text-lg font-medium text-gray-900">
                      {viewHeaderData.headerTitle}
                    </h5>
                  </div>

                  {/* Header Description */}
                  <div className="mb-4">
                    <label className="block font-semibold text-gray-700">
                      Header Description:
                    </label>
                    <p className="text-gray-600">{viewHeaderData.HeaderDesc}</p>
                  </div>

                  {/* Header Image */}
                  <div className="mb-4">
                    <label className="block font-semibold text-gray-700">
                      Header Image:
                    </label>
                    {viewHeaderData.headerImage ? (
                      <img
                        src={viewHeaderData.headerImage}
                        alt="Header"
                        className="img-fluid rounded shadow-md border border-gray-300 max-w-full w-[200px] h-[150px] object-cover"
                      />
                    ) : (
                      <p className="text-gray-500">No image available</p>
                    )}
                  </div>
                </>
              )}
            </Modal.Body>
            <Modal.Footer className="border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={() => setViewHeaderData(null)}
                className="bg-gray-500 text-white"
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* // Modal to view article data */}
          <Modal
            show={viewArticleData !== null}
            onHide={() => setViewArticleData(null)}
            centered
          >
            <Modal.Header closeButton className="border-b border-gray-200">
              <Modal.Title className="text-lg font-bold text-gray-800">
                Article Details
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="space-y-6">
              {viewArticleData &&
                viewArticleData.articleData.map((data, index) => (
                  <div
                    key={index}
                    className="mb-6 p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-200"
                  >
                    {/* Article Title */}
                    <div className="mb-4">
                      <label className="block font-semibold text-gray-700">
                        Article Title:
                      </label>
                      <h5 className="text-lg font-medium text-gray-900">
                        {data.Title}
                      </h5>
                    </div>

                    {/* Article Description */}
                    <div className="mb-4">
                      <label className="block font-semibold text-gray-700">
                        Article Description:
                      </label>
                      <p className="text-gray-600">{data.Desc}</p>
                    </div>
                  </div>
                ))}
            </Modal.Body>
            <Modal.Footer className="border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={() => setViewArticleData(null)}
                className="bg-gray-500 text-white"
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* // Modal to view blog tags data */}
          <Modal
            show={viewBlogTagsData !== null}
            onHide={() => setViewBlogTagsData(null)}
            centered
          >
            <Modal.Header closeButton className="border-b border-gray-200">
              <Modal.Title className="text-lg font-bold text-gray-800">
                Blog Tags Details
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="space-y-4">
              {viewBlogTagsData && (
                <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-200">
                  <label className="block font-semibold text-gray-700 mb-2">
                    Blog Tags :
                  </label>
                  <ul className="list-disc pl-5 text-gray-600">
                    {viewBlogTagsData.map((tag, index) => (
                      <li key={index} className="mb-1">
                        {index + 1}. {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer className="border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={() => setViewBlogTagsData(null)}
                className="bg-gray-500 text-white"
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
};

export default SolutionBlogCMS;
