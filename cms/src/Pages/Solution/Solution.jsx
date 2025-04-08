import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
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

const SolutionCMS = () => {
  const router = useNavigate();
  const [userauth] = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userauth || !userauth.token) {
      router("/"); // Redirect to login page if not authenticated
    } else {
      fetchSolutions();
    }
  }, [userauth, router]);
  const [solutions, setSolutions] = useState([]); // Fixed the name from 'solution' to 'solutions'
  const [solutionData, setSolutionData] = useState([]);
  const [solutionId, setSolutionId] = useState(null);
  const [solutionName, setSolutionName] = useState('');
  const [cardTitle, setCardTitle] = useState('');
  const [cardImage, setCardImage] = useState(null);
  const [cardDescription, setCardDescription] = useState('');
  const [headerTagLine, setHeaderTagLine] = useState('');
  const [headerDescription, setheaderDescription] = useState('')
  const [headerImage, setHeaderImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showHeaderModal, setShowHeaderModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page
  const [paginatedSolutions, setPaginatedSolutions] = useState([]);


  const openHeaderModal = (solution) => {
    setHeaderTagLine(solution.headerTagLine);
    setHeaderImage(solution.headerImage);
    setheaderDescription(solution.headerDescription);
    setShowHeaderModal(true);
  };

  const closeHeaderModal = () => {
    setShowHeaderModal(false);
  };

  useEffect(() => {
    setPaginatedSolutions(paginate(solutionData, currentPage, itemsPerPage));
  }, [solutionData, currentPage, itemsPerPage]);

  const fetchSolutions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://conscientious-technologies-backend.vercel.app/get-latest-solution-data');
      console.log(response.data);
      setSolutions(response.data);
      setSolutionData(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching data');
      setLoading(false);
      console.error('Error fetching Solution Data:', error);
    }
  };


  const paginate = (solutions, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return solutions.slice(startIndex, endIndex);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < Math.ceil(solutionData.length / itemsPerPage)) setCurrentPage(currentPage + 1);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`https://conscientious-technologies-backend.vercel.app/delete-existing-solution-data-by-id/${id}`);
          if (response.status === 200) {
            fetchSolutions(); // Refresh the solution list
            Swal.fire('Deleted!', 'Your data has been deleted.', 'success');
          }
        } catch (error) {
          console.log(error);
          Swal.fire('Error!', 'Failed to delete data. Please try again later.', 'error');
        }
      }
    });
  };

  const openModal = (solution = null) => {
    if (solution) {
      setSolutionId(solution._id);
      setSolutionName(solution.solutionName);
      setHeaderTagLine(solution.headerTagLine);
      setCardTitle(solution.cardTitle);
      setheaderDescription(solution.headerDescription);
      setCardDescription(solution.cardDescription);
      setCardImage(null); // Reset cardImage for editing
      setHeaderImage(null); // Reset headerImage for editing
    } else {
      setSolutionId(null); // Reset ID for adding a new solution
      setSolutionName('');
      setHeaderTagLine('');
      setCardDescription('');
      setCardTitle('');
      setheaderDescription('');
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    // Reset form fields
    setSolutionId(null);
    setSolutionName('');
    setHeaderTagLine('');
    setCardDescription('');
    setCardImage(null);
    setHeaderImage(null);
  };

  const openCardDataModal = (solution) => {
    setCardImage(solution.cardImage);
    setCardDescription(solution.cardDescription);
    setShowCardModal(true);
  };

  const closeCardDataModal = () => {
    setShowCardModal(false);
  };

  const handleFileChange = (event, setImage) => {
    setImage(event.target.files[0]); // Handle file input
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('solutionName', solutionName);
    formData.append('headerTagLine', headerTagLine);
    formData.append('headerDescription', headerDescription);
    formData.append('cardDescription', cardDescription);
    if (headerImage) formData.append('headerImage', headerImage);
    if (cardImage) formData.append('cardImage', cardImage);

    try {
      if (solutionId) {
        // Update existing solution
        const response = await axios.put(`https://conscientious-technologies-backend.vercel.app/edit-solution-data/${solutionId}`, formData);
        if (response.status === 200) {
          Swal.fire('Success!', 'Solution updated successfully.', 'success');
        }
      } else {
        // Create new solution
        const response = await axios.post('https://conscientious-technologies-backend.vercel.app/create-new-solution-data', formData);
        if (response.status === 200) {
          Swal.fire('Success!', 'New solution added successfully.', 'success');
        }
      }
      fetchSolutions(); // Refresh the solutions list
      closeModal(); // Close the modal after submission
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire('Error!', 'Failed to save data. Please try again later.', 'error');
    }
  };

  return (
    <>
    {loading ? (
      <Spinner />
    ) : error ? (
      <p className="text-red-500">{error}</p>
    ) : (
    <div className="p-4 bg-gray-200">
      <div className='flex justify-between'>
        <h1 className="text-xl font-bold">Solutions Management</h1>
        <select name="" id=""
        onChange={(e)=>{
          if(e.target.value === "All"){setSolutionData(solutions)}
          else {setSolutionData(solutions.filter((solution) => solution.solutionName === e.target.value))}
        }}
        >
          <option value="All">All</option>
          {solutions &&
            solutions.map((solution) => (
              <option value={solution.solutionName}>{solution.solutionName}</option>
            ))
          }
        </select>
        <button onClick={() => openModal()} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add New Solution
        </button>
      </div>

      <div className="mt-4">
        <table className="w-full border-collapse bg-white">
          <thead className='bg-gray-800 text-white'>
            <tr>
              <th className="border p-2">Sr No</th>
              <th className="border p-2">Solution Name</th>
              <th className="border p-2">Header Data</th>
              <th className="border p-2">Card Data</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSolutions.map((solution, index) => (
              <tr key={solution._id}>
                <td className="border p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="border p-2">{solution.solutionName}</td>
                <td className="border p-2">
                  <button onClick={() => openHeaderModal(solution)} className="bg-blue-950 text-white px-2 py-1 rounded mr-2">View</button>
                </td>
                <td className="border p-2">
                  <button onClick={() => openCardDataModal(solution)} className="bg-blue-950 text-white px-2 py-1 rounded mr-2">View</button>
                </td>
                <td className="border p-2">
                  <button onClick={() => openModal(solution)} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                  <button onClick={() => handleDelete(solution._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center gap-x-6 items-center mt-4">
          <button
            onClick={goToPreviousPage}
            className={`bg-blue-500 text-white px-4 py-2 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="mx-2">
            Page {currentPage} of {Math.ceil(solutions.length / itemsPerPage)}
          </span>
          <button
            onClick={goToNextPage}
            className={`bg-blue-500 text-white px-4 py-2 rounded ${currentPage === Math.ceil(solutions.length / itemsPerPage) ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={currentPage === Math.ceil(solutions.length / itemsPerPage)}
          >
            Next
          </button>
        </div>


      </div>

      <Modal show={showModal} onHide={closeModal}>
        <div className='w-[50vw] mx-auto bg-white'>
          <Modal.Header closeButton className="bg-gray-100">
            <Modal.Title>{solutionId ? 'Edit Solution' : 'Add New Solution'}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="w-full mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Solution Name</label>
                <input
                  type="text"
                  value={solutionName}
                  onChange={(e) => setSolutionName(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Header Tagline</label>
                <input
                  type="text"
                  value={headerTagLine}
                  onChange={(e) => setHeaderTagLine(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Header Description</label>
                <input
                  type="text"
                  value={headerDescription}
                  onChange={(e) => setheaderDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Header Image</label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, setHeaderImage)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <h1 className='text-lg font-semibold text-black'>Card Data</h1>
              <div className="mb-4">
                <label className="block text-gray-700">Card Title</label>
                <input
                  type="text"
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Card Image</label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, setCardImage)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Card Description</label>
                <textarea
                  value={cardDescription}
                  onChange={(e) => setCardDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className='flex justify-start gap-4'>
                <button className='py-2 px-4 bg-blue-500 text-white hover:bg-blue-700 rounded-md' type="submit">
                  {solutionId ? 'Update Solution' : 'Add Solution'}
                </button>
                <button className='py-2 px-4 border border-blue-500 text-blue-500 hover:bg-gray-500 hover:text-white rounded-md' onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </Modal.Body>
        </div>
      </Modal>

      <Modal show={showHeaderModal} onHide={closeHeaderModal}>
        <Modal.Header closeButton>
          <Modal.Title>Header Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold font-serif">Header Tagline</label>
            <p>{headerTagLine}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold font-serif">Header Description</label>
            <p>{headerDescription}</p>
          </div>

          <div className="mb-4">
            <label className="lock text-gray-700 font-bold font-serif">Header Image</label>
            {headerImage && (
              <img src={headerImage} alt="Header" className="w-full h-auto rounded" />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className='py-2 px-4 border border-blue-500 text-blue-500 hover:bg-gray-500 hover:text-white rounded-md' onClick={closeHeaderModal}>
            Close
          </button>
        </Modal.Footer>
      </Modal>

      {/* Card Data Modal */}
      <Modal show={showCardModal} onHide={closeCardDataModal}>
        <Modal.Header closeButton>
          <Modal.Title>Card Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold font-serif">Card Title</label>
            <p>{cardTitle}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold font-serif">Card Description</label>
            <p>{cardDescription}</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold font-serif">Card Image</label>
            {cardImage && (
              <img src={cardImage} alt="Card" className="w-[150px] h-[150px] rounded" />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeCardDataModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


    </div>
    )
  }
  </>
  );
};

export default SolutionCMS;